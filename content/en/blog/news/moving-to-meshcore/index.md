---
date: 2026-11-01
title: Tri-Cities Mesh is moving to MeshCore
linkTitle: Moving to MeshCore
description: >
  We're switching the regional mesh from Meshtastic to MeshCore. Here's why, and what you need to do.
author: Tri-Cities Mesh
---

Tri-Cities Mesh is moving from Meshtastic to **[MeshCore](https://meshcore.io)**.

## Why

Meshtastic got this community started, and we're grateful for it. As the local mesh grew, its design, where nearly every radio rebroadcasts what it hears, started to work against us in our hilly terrain.

MeshCore takes a different approach. **Only dedicated repeaters relay traffic.** Personal radios, called *companions*, don't. Direct messages travel along a learned path instead of flooding the whole network. That keeps the airwaves quieter and lets the network grow without slowing down.

## What you need to do

1. **Reflash your radio** with MeshCore using the [web flasher](https://flasher.meshcore.io/). Most Meshtastic hardware is supported.
2. **Install the MeshCore app** and pair it with your radio.
3. **Choose the USA/Canada (Recommended) preset** (910.525 MHz, BW 62.5, SF7, CR5).
4. **Send an advert** and say hi on the Public channel.

The [Getting Started guide](/docs/getting-started/) covers every step, and [Coming from Meshtastic](/docs/from-meshtastic/) explains what's different.

## Hosting a fixed node?

If you run a Meshtastic router on a roof, tower, or hilltop, please consider reflashing it as a MeshCore **repeater**. That's the single most helpful thing you can do during the switch. [Submit it](/submit-node/) once it's converted, and ask in the [Discord](/discord) if you'd like a hand.
