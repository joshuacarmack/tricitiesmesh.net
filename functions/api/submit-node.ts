// /functions/api/submit-node.ts
export const onRequestPost: PagesFunction<{
  // Bindings (set these in Pages -> Settings -> Functions)
  DISCORD_WEBHOOK_URL: string;   // secret
  TURNSTILE_SECRET?: string;     // secret (optional if you use Turnstile)
  NODE_UPLOADS?: R2Bucket;       // R2 binding (optional)
  PUBLIC_R2_BASE?: string;       // e.g. https://r2.yourdomain.com (optional)
}> = async ({ request, env }) => {
  try {
    const form = await request.formData();

    // Honeypot
    if ((form.get("company") as string)?.trim()) {
      return new Response("ok", { status: 200 });
    }

    // (Optional) Turnstile server-side verification
    const tsToken = form.get("cf-turnstile-response") as string | null;
    if (env.TURNSTILE_SECRET && tsToken) {
      const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        body: new URLSearchParams({
          secret: env.TURNSTILE_SECRET,
          response: tsToken,
        }),
      }).then(r => r.json());
      if (!verify.success) return new Response("Turnstile failed", { status: 400 });
    }

    // Extract fields
    const payload: Record<string, string> = {};
    const want = [
      "contact_name","contact_email","callsign","ok_to_contact",
      "node_name","device","power","antenna","always_on",
      "city","lat","lon","elevation_ft","location_notes","show_as_approx",
      "coverage","photo_url"
    ];
    for (const k of want) {
      const v = form.get(k);
      if (typeof v === "string") payload[k] = v;
    }

    // Handle optional file
    let attachmentName: string | undefined;
    let publicUrl: string | undefined;

    const file = form.get("attachment");
    if (file instanceof File && file.size > 0) {
      if (env.NODE_UPLOADS) {
        // Store in R2, then include a link in Discord
        const key = `nodes/${Date.now()}-${file.name.replace(/\s+/g,"_")}`;
        await env.NODE_UPLOADS.put(key, file.stream(), {
          httpMetadata: { contentType: file.type || "application/octet-stream" }
        });
        attachmentName = file.name;
        if (env.PUBLIC_R2_BASE) {
          publicUrl = `${env.PUBLIC_R2_BASE.replace(/\/$/,"")}/${encodeURIComponent(key)}`;
        }
      } else {
        // No R2 bound: attempt to attach directly to Discord (size-limited)
        // Build multipart payload with the file + payload_json.
        const mp = new FormData();
        mp.append("files[0]", new File([await file.arrayBuffer()], file.name, { type: file.type || "application/octet-stream" }));
        mp.append("payload_json", JSON.stringify({
          username: "Tri-Cities Mesh",
          content: "New node submission (file attached).",
        }));
        const res = await fetch(env.DISCORD_WEBHOOK_URL, { method: "POST", body: mp });
        if (!res.ok) return new Response("Discord upload failed", { status: 500 });
      }
    }

    // Build Discord embed
    const embed = {
      title: "New Node Submission",
      description: payload.coverage || "—",
      fields: [
        { name: "Node", value: `**${payload.node_name || "—"}**\nDevice: ${payload.device || "—"}\nPower: ${payload.power || "—"}\nAntenna: ${payload.antenna || "—"}\nAlways On: ${payload.always_on || "—"}`, inline: false },
        { name: "Location", value: `City: ${payload.city || "—"}\nLat/Lon: ${payload.lat || "—"}, ${payload.lon || "—"}\nElev (ft): ${payload.elevation_ft || "—"}\nApprox only: ${payload.show_as_approx ? "Yes" : "No"}`, inline: false },
        { name: "Contact", value: `Name: ${payload.contact_name || "—"}\nEmail: ${payload.contact_email || "—"}\nCallsign: ${payload.callsign || "—"}\nOK to contact: ${payload.ok_to_contact || "—"}`, inline: false },
      ].filter(Boolean),
      url: payload.photo_url || undefined,
      footer: { text: "Tri-Cities Mesh | Submit a Node" },
      timestamp: new Date().toISOString(),
    };

    // Compose message
    const jsonBody: any = {
      username: "Tri-Cities Mesh",
      content: publicUrl
        ? `📎 File uploaded: ${publicUrl}${attachmentName ? ` (${attachmentName})` : ""}`
        : undefined,
      embeds: [embed],
    };

    // Send to Discord
    const dr = await fetch(env.DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(jsonBody),
    });
    if (!dr.ok) return new Response("Discord webhook failed", { status: 500 });

    // Respond to the browser
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    return new Response("Server error", { status: 500 });
  }
};
