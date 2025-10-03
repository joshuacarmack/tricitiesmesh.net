// /functions/api/submit-node.ts
/**
 * Cloudflare Pages Function: Accepts form posts from /submit-node,
 * optionally verifies Turnstile, uploads an attachment to R2 (if bound),
 * and sends a Discord webhook with a rich embed. Redirects to THANKS_URL on success.
 */

type Env = {
  DISCORD_WEBHOOK_URL: string;
  TURNSTILE_SECRET?: string;
  NODE_UPLOADS?: R2Bucket;
  PUBLIC_R2_BASE?: string;
  THANKS_URL?: string;
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    // Only accept multipart or urlencoded posts
    const ct = request.headers.get("content-type") || "";
    if (!/multipart\/form-data|application\/x-www-form-urlencoded/i.test(ct)) {
      return err(415, "Unsupported Media Type");
    }

    const form = await request.formData();

    // Honeypot: if filled, pretend success (quietly drop)
    if (asText(form.get("company"))) {
      return successResponse(env, { ok: true, dropped: true });
    }

    // Turnstile (optional): if secret is configured, require a valid token
    if (env.TURNSTILE_SECRET) {
      const tsToken = asText(form.get("cf-turnstile-response"));
      if (!tsToken) return err(400, "Turnstile token missing");
      const verified = await verifyTurnstile(env.TURNSTILE_SECRET, tsToken, request);
      if (!verified) return err(400, "Turnstile verification failed");
    }

    // Extract fields from the form
    const payload = collectFields(form, [
      "contact_name",
      "contact_email",
      "callsign",
      "ok_to_contact",
      "node_name",
      "device",
      "power",
      "antenna",
      "always_on",
      "city",
      "lat",
      "lon",
      "elevation_ft",
      "location_notes",
      "show_as_approx",
      "coverage",
      "photo_url",
    ]);

    // Normalize some values
    payload.lat = clipNum(payload.lat, -90, 90);
    payload.lon = clipNum(payload.lon, -180, 180);
    payload.elevation_ft = payload.elevation_ft ? String(Math.max(0, Math.floor(Number(payload.elevation_ft)))) : "";

    // Optional file handling
    const file = form.get("attachment");
    let fileNote: string | undefined;
    let filePublicUrl: string | undefined;

    if (file instanceof File && file.size > 0) {
      // Prefer R2 → share URL; else attempt direct Discord attachment
      if (env.NODE_UPLOADS) {
        const key = r2Key(file.name);
        await env.NODE_UPLOADS.put(key, file.stream(), {
          httpMetadata: { contentType: file.type || "application/octet-stream" },
        });
        if (env.PUBLIC_R2_BASE) {
          filePublicUrl = joinUrl(env.PUBLIC_R2_BASE, key);
          fileNote = `📎 File uploaded: ${filePublicUrl} (${file.name}, ${prettyBytes(file.size)})`;
        } else {
          fileNote = `📎 File uploaded to R2 (no public URL configured): ${key} (${file.name}, ${prettyBytes(file.size)})`;
        }
      } else {
        // No R2 bound — we’ll attach directly to Discord after sending the embed message
        // Discord single-file limit is typically 25MB; your Worker memory/bandwidth also matters.
        // We’ll stream it in a second webhook call.
        fileNote = `📎 File will be attached directly to Discord (${file.name}, ${prettyBytes(file.size)})`;
      }
    }

    // Build Discord embed (keep values within Discord size constraints)
    const embed = buildDiscordEmbed(payload);

    // First webhook call: embed + optional file note/public URL
    const baseContent = filePublicUrl ? fileNote : undefined;
    const baseRes = await fetch(env.DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        username: "Tri-Cities Mesh",
        content: baseContent,
        embeds: [embed],
      }),
    });
    if (!baseRes.ok) return err(500, "Discord webhook failed (embed)");

    // If no R2 but we have a file, try to attach directly now
    if (!env.NODE_UPLOADS && file instanceof File && file.size > 0) {
      const mp = new FormData();
      mp.append(
        "payload_json",
        JSON.stringify({
          username: "Tri-Cities Mesh",
          content: fileNote || "📎 Attachment",
        }),
      );
      // Re-wrap the File to ensure payload_json is first (Discord sometimes picky about ordering)
      const f = new File([await file.arrayBuffer()], file.name, {
        type: file.type || "application/octet-stream",
      });
      mp.append("files[0]", f, f.name);

      const attachRes = await fetch(env.DISCORD_WEBHOOK_URL, { method: "POST", body: mp });
      if (!attachRes.ok) return err(500, "Discord webhook failed (attachment)");
    }

    // Success: redirect if HTML request, else JSON
    return successResponse(env, { ok: true });
  } catch (e: any) {
    return err(500, "Server error");
  }
};

/* -------------------- helpers -------------------- */

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

  const resp = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  });
  if (!resp.ok) return false;
  const data = await resp.json().catch(() => ({}));
  return !!data?.success;
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
  const units = ["B", "KB", "MB", "GB", "TB"];
  let u = 0;
  while (n >= 1024 && u < units.length - 1) {
    n /= 1024;
    u++;
  }
  return `${n.toFixed(u ? 1 : 0)} ${units[u]}`;
}

function buildDiscordEmbed(p: Record<string, string>) {
  const nodeBlock = [
    bold(p.node_name || "—"),
    `Device: ${p.device || "—"}`,
    `Power: ${p.power || "—"}`,
    `Antenna: ${p.antenna || "—"}`,
    `Always On: ${p.always_on || "—"}`,
  ].join("\n");

  const locBlock = [
    `City: ${p.city || "—"}`,
    `Lat/Lon: ${p.lat || "—"}, ${p.lon || "—"}`,
    `Elev (ft): ${p.elevation_ft || "—"}`,
    `Approx only: ${p.show_as_approx ? "Yes" : "No"}`,
  ].join("\n");

  const contactBlock = [
    `Name: ${p.contact_name || "—"}`,
    `Email: ${p.contact_email || "—"}`,
    `Callsign: ${p.callsign || "—"}`,
    `OK to contact: ${p.ok_to_contact || "—"}`,
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

function bold(s: string) {
  return s ? `**${truncate(s, 240)}**` : "**—**";
}

function truncate(s: string, max: number) {
  if (s.length <= max) return s;
  return s.slice(0, Math.max(0, max - 1)) + "…";
}

function wantsHTML(request: Request): boolean {
  const accept = request.headers.get("accept") || "";
  return accept.includes("text/html") && !accept.includes("application/json");
}

function successResponse(env: Env, data: Record<string, unknown>) {
  // If browser form post (Accept: text/html), redirect to thanks page
  // Otherwise return JSON
  const thanks = env.THANKS_URL || "/submit-node/thanks/";
  const reqAcceptsHtml = true; // Pages forms are regular submits; we prefer redirect
  if (reqAcceptsHtml) {
    return new Response(null, {
      status: 303,
      headers: { Location: thanks },
    });
  }
  return new Response(JSON.stringify(data), { headers: { "content-type": "application/json" } });
}

function err(status: number, message: string) {
  return new Response(JSON.stringify({ ok: false, error: message }), {
    status,
    headers: { "content-type": "application/json" },
  });
}
