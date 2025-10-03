// functions/api/submit-node.ts
type Env = {
  DISCORD_WEBHOOK_URL: string;
  TURNSTILE_SECRET?: string;
  NODE_UPLOADS?: R2Bucket;
  PUBLIC_R2_BASE?: string;
  THANKS_URL?: string;
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    // Content-type guard
    const ct = request.headers.get("content-type") || "";
    if (!/multipart\/form-data|application\/x-www-form-urlencoded/i.test(ct)) {
      return err(415, "Unsupported Media Type");
    }

    // Ensure webhook configured
    if (!env.DISCORD_WEBHOOK_URL) {
      console.error("Missing DISCORD_WEBHOOK_URL binding");
      return err(500, "Server is missing Discord configuration.");
    }

    const form = await request.formData();

    // Honeypot
    if (asText(form.get("company"))) {
      console.log("Honeypot hit; dropping silently.");
      return successResponse(env, { ok: true, dropped: true }, request);
    }

    // Optional Turnstile
    if (env.TURNSTILE_SECRET) {
      const token = asText(form.get("cf-turnstile-response"));
      if (!token) return err(400, "Turnstile token missing");
      const ok = await verifyTurnstile(env.TURNSTILE_SECRET, token, request);
      if (!ok) return err(400, "Turnstile verification failed");
    }

    // Collect fields
    const p = collectFields(form, [
      "contact_name","contact_email","callsign","ok_to_contact",
      "node_name","device","power","antenna","always_on",
      "city","lat","lon","elevation_ft","location_notes","show_as_approx",
      "coverage","photo_url"
    ]);

    // Normalize numbers
    p.lat = clipNum(p.lat, -90, 90);
    p.lon = clipNum(p.lon, -180, 180);
    p.elevation_ft = p.elevation_ft ? String(Math.max(0, Math.floor(Number(p.elevation_ft)))) : "";

    // Handle file
    const file = form.get("attachment");
    let fileMsg: string | undefined;
    let publicUrl: string | undefined;

    if (file instanceof File && file.size > 0) {
      if (env.NODE_UPLOADS) {
        const key = r2Key(file.name);
        await env.NODE_UPLOADS.put(key, file.stream(), {
          httpMetadata: { contentType: file.type || "application/octet-stream" }
        });
        if (env.PUBLIC_R2_BASE) {
          publicUrl = joinUrl(env.PUBLIC_R2_BASE, key);
          fileMsg = `📎 File: ${publicUrl} (${file.name}, ${prettyBytes(file.size)})`;
        } else {
          fileMsg = `📎 File stored in R2 (no public URL): ${key} (${file.name}, ${prettyBytes(file.size)})`;
        }
      } else {
        fileMsg = `📎 File will be attached directly to Discord (${file.name}, ${prettyBytes(file.size)})`;
      }
    }

    // Build embed
    const embed = buildDiscordEmbed(p);

    // Send embed first
    const baseBody = {
      username: "Tri-Cities Mesh",
      content: publicUrl ? fileMsg : undefined,
      embeds: [embed],
    };
    const dr = await fetch(env.DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(baseBody),
    });

    if (!dr.ok) {
      const txt = await safeText(dr);
      console.error("Discord embed failed", dr.status, txt);
      return err(502, `Discord webhook failed (embed): ${dr.status}`);
    }

    // If no R2 and we have a file, attach it now in a second call
    if (!env.NODE_UPLOADS && file instanceof File && file.size > 0) {
      const mp = new FormData();
      mp.append("payload_json", JSON.stringify({
        username: "Tri-Cities Mesh",
        content: fileMsg || "📎 Attachment",
      }));
      // Re-wrap file to ensure ordering
      const f = new File([await file.arrayBuffer()], file.name, {
        type: file.type || "application/octet-stream",
      });
      mp.append("files[0]", f, f.name);

      const dr2 = await fetch(env.DISCORD_WEBHOOK_URL, { method: "POST", body: mp });
      if (!dr2.ok) {
        const txt = await safeText(dr2);
        console.error("Discord attach failed", dr2.status, txt);
        return err(502, `Discord webhook failed (attachment): ${dr2.status}`);
      }
    }

    return successResponse(env, { ok: true }, request);
  } catch (e: any) {
    console.error("Server error", e?.message || e);
    return err(500, "Server error");
  }
};

// Optional GET to check routing quickly: open /api/submit-node in a browser.
export const onRequestGet: PagesFunction = async () =>
  new Response("submit-node function alive", { headers: { "content-type": "text/plain" } });

/* ---------------- helpers ---------------- */

function asText(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

function collectFields(form: FormData, keys: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of keys) out[k] = asText(form.get(k));
  return out;
}

async function verifyTurnstile(secret: string, token: string, request: Request): Promise<boolean> {
  const ip = request.headers.get("CF-Connecting-IP") || undefined;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);
  const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
  if (!r.ok) return false;
  const j = await r.json().catch(() => ({}));
  return !!j?.success;
}

function r2Key(filename: string): string {
  const clean = filename.replace(/[^\w.\-]+/g, "_");
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  return `nodes/${ts}-${clean}`;
}

function joinUrl(base: string, key: string): string {
  return `${base.replace(/\/$/, "")}/${key.replace(/^\//, "")}`;
}

function clipNum(s: string, min: number, max: number): string {
  if (!s) return "";
  const n = Number(s);
  if (Number.isNaN(n)) return s;
  return String(Math.min(max, Math.max(min, n)));
}

function prettyBytes(n: number): string {
  const units = ["B","KB","MB","GB","TB"];
  let u = 0;
  while (n >= 1024 && u < units.length - 1) { n /= 1024; u++; }
  return `${n.toFixed(u ? 1 : 0)} ${units[u]}`;
}

function truncate(s: string, max: number) {
  return s.length <= max ? s : s.slice(0, max - 1) + "…";
}

function buildDiscordEmbed(p: Record<string, string>) {
  const nodeBlock = [
    p.node_name ? `**${truncate(p.node_name, 240)}**` : "**—**",
    `Device: ${p.device || "—"}`,
    `Power: ${p.power || "—"}`,
    `Antenna: ${p.antenna || "—"}`,
    `Always On: ${p.always_on || "—"}`
  ].join("\n");

  const locBlock = [
    `City: ${p.city || "—"}`,
    `Lat/Lon: ${p.lat || "—"}, ${p.lon || "—"}`,
    `Elev (ft): ${p.elevation_ft || "—"}`,
    `Approx only: ${p.show_as_approx ? "Yes" : "No"}`
  ].join("\n");

  const contactBlock = [
    `Name: ${p.contact_name || "—"}`,
    `Email: ${p.contact_email || "—"}`,
    `Callsign: ${p.callsign || "—"}`,
    `OK to contact: ${p.ok_to_contact || "—"}`
  ].join("\n");

  return {
    title: "New Node Submission",
    description: truncate(p.coverage || "—", 2048),
    fields: [
      { name: "Node", value: truncate(nodeBlock, 1024), inline: false },
      { name: "Location", value: truncate(locBlock, 1024), inline: false },
      { name: "Contact", value: truncate(contactBlock, 1024), inline: false },
      p.photo_url ? { name: "Photo/Diagram URL", value: truncate(p.photo_url, 1024), inline: false } : null,
      p.location_notes ? { name: "Location Notes (private)", value: truncate(p.location_notes, 1024), inline: false } : null,
    ].filter(Boolean),
    url: p.photo_url || undefined,
    footer: { text: "Tri-Cities Mesh | Submit a Node" },
    timestamp: new Date().toISOString(),
  };
}

async function safeText(r: Response) {
  try { return await r.text(); } catch { return "<no body>"; }
}

function wantsHTML(request: Request): boolean {
  const accept = request.headers.get("accept") || "";
  return accept.includes("text/html") && !accept.includes("application/json");
}

function successResponse(env: Env, data: Record<string, unknown>, request: Request) {
  const thanks = env.THANKS_URL || "/submit-node/thanks/";
  if (wantsHTML(request)) {
    return new Response(null, { status: 303, headers: { Location: thanks } });
  }
  return new Response(JSON.stringify(data), { headers: { "content-type": "application/json" } });
}

function err(status: number, message: string) {
  return new Response(`Error ${status}: ${message}`, {
    status,
    headers: { "content-type": "text/plain" },
  });
}
