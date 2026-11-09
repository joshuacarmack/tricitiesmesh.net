---
title: Coming from Meshtastic
description: Why Tri-Cities Mesh moved to MeshCore, and what changes for you.
weight: 3
---

Tri-Cities Mesh started on [Meshtastic](https://meshtastic.org). In 2026 the community moved to **[MeshCore](https://meshcore.io)**. This page covers what's different and how to switch.

## Why we switched

Meshtastic is a great project and got a lot of us into LoRa mesh. As the local network grew, we wanted a design that scales better over our hills and valleys:

- **Repeaters do the relaying.** In Meshtastic, nearly every radio rebroadcasts what it hears, which crowds the airwaves as the mesh grows. In MeshCore, only dedicated repeaters relay. Phones and handheld companions don't.
- **Direct messages find a route.** The first message to someone is flooded, and after that MeshCore sends DMs along a known path, so they don't hit the whole mesh each time.
- **Room servers.** Built-in bulletin boards keep messages for people who were offline.
- **Easy remote management.** You can check on and configure repeaters from the app over the air.

## What changes for you

The two networks **can't talk to each other**, so a Meshtastic radio won't see MeshCore traffic and MeshCore radios won't see Meshtastic traffic.

| | Meshtastic | MeshCore |
|---|---|---|
| Your phone's radio | Usually relays traffic | A **companion** that doesn't relay |
| Fixed relays | Router / Client roles | **Repeater** firmware |
| Radio settings | LongFast, etc. | **USA/Canada** preset: 910.525 MHz, BW 62.5, SF7, CR5 |
| Identity | Node number (`!abcd1234`) | A **public key** (contacts show a short prefix) |
| App | Meshtastic app | [MeshCore app](/docs/getting-started/#3-install-the-app) |

## Reflashing your radio

Most common Meshtastic hardware, including Heltec V3, RAK4631, T-Beam, T-Echo, and Seeed trackers, runs MeshCore too.

1. Write down anything you want to keep from your Meshtastic settings, such as the name and channel keys.
2. Open the [MeshCore flasher](https://flasher.meshcore.io/), pick your device, and choose **Companion**, or **Repeater** if it's a fixed site.
3. Follow [Getting Started](/docs/getting-started/) from step 3.

{{% alert title="Fixed Meshtastic nodes" color="info" %}}
If you host a fixed Meshtastic router on a roof or tower, reflashing it as a MeshCore **repeater** is one of the most helpful things you can do. Please [let us know](/submit-node/) once it's converted so we can update the node directory.
{{% /alert %}}
