---
title: Getting Started
linkTitle: Getting Started
description: Get a MeshCore radio on the Tri-Cities mesh, from buying hardware to sending your first message.
weight: 2
---

This guide takes you from no radio to chatting on the Tri-Cities mesh. Most people finish in under an hour.

{{% alert title="Coming from Meshtastic?" color="info" %}}
MeshCore and Meshtastic can't talk to each other, even on the same hardware. Most Meshtastic radios can be reflashed with MeshCore. See [Coming from Meshtastic](/docs/from-meshtastic/) for what's different.
{{% /alert %}}

## 1. Get a radio

You need a LoRa radio that MeshCore supports, for the **US 915 MHz** band. Some good options:

| Radio | Good for | Notes |
|---|---|---|
| **Heltec V3 / V4** | First radio, tinkering | Cheap, with a small screen. Needs a battery or USB power. |
| **RAK WisMesh Pocket / Tag** (RAK4631) | Carrying with you | Very low power draw, so batteries last for days. |
| **Seeed Wio Tracker L1 Pro / SenseCAP T1000-E** | Carrying with you | Rugged and pocket-sized, with GPS. |
| **Seeed SenseCAP Solar Node P1 Pro** | Solar repeater | Weatherproof, with solar and battery built in. |
| **LilyGO T-Deck Plus / T-Lora Pager** | Using without a phone | Built-in keyboard and screen. |

The [MeshCore flasher](https://flasher.meshcore.io/) lists every supported device. If a radio isn't on the list, check before you buy.

{{% alert title="Antennas matter" color="warning" %}}
Always connect the antenna **before** powering a radio on. Transmitting without one can damage it. A better antenna usually helps range more than any setting does.
{{% /alert %}}

## 2. Flash MeshCore

1. Open **[flasher.meshcore.io](https://flasher.meshcore.io/)** in Chrome or Edge on a computer.
2. Plug the radio in over USB and choose your device.
3. Choose the firmware type:
   - **Companion (Bluetooth)** to use your phone. This is the right choice for most people.
   - **Companion (USB)** to use a computer.
   - **Repeater** or **Room Server** if the radio will be a fixed, always-on site. See [Running a repeater](#running-a-repeater).
4. Click flash and wait for it to finish.

## 3. Install the app

The MeshCore app runs on:

- **iPhone / iPad** on the [App Store](https://apps.apple.com/us/app/meshcore/id6742354151)
- **Android** on [Google Play](https://play.google.com/store/apps/details?id=com.liamcottle.meshcore.android)
- **Web** in Chrome at [app.meshcore.nz](https://app.meshcore.nz/)

Pair the app with your radio over Bluetooth, or over USB for the web and desktop app.

## 4. Use the Tri-Cities radio settings

The Tri-Cities mesh uses the standard **USA/Canada (Recommended)** preset. In the app, open your radio's settings and pick that preset. To set it by hand, use these values:

<div class="tcm-preset">
  <div><div class="tcm-preset-label">Frequency</div><div class="tcm-preset-value">910.525</div><div class="tcm-preset-label">MHz</div></div>
  <div><div class="tcm-preset-label">Bandwidth</div><div class="tcm-preset-value">62.5</div><div class="tcm-preset-label">kHz</div></div>
  <div><div class="tcm-preset-label">Spreading factor</div><div class="tcm-preset-value">7</div><div class="tcm-preset-label">SF</div></div>
  <div><div class="tcm-preset-label">Coding rate</div><div class="tcm-preset-value">5</div><div class="tcm-preset-label">CR</div></div>
</div>

Frequency, bandwidth, and spreading factor **must** match the rest of the mesh, or you won't hear anyone. Radios configured over USB serial can use this command:

```text
set radio 910.525,62.5,7,5
```

While you're in settings:

- **Name**: something people will recognize, such as your callsign or first name plus town.
- **Location**: optional. Share it if you want to show up on the [map](https://map.meshcore.io/). Use an approximate position if you'd rather not be exact.

## 5. Say hello

1. **Send an advert.** This announces your radio to the mesh so others can find you.
2. Open the **Public** channel and say hi. Tell people roughly where you are.
3. Check your **contacts** list. Repeaters and other users show up there as their adverts reach you.
4. To message someone directly, open their contact. Direct messages are end-to-end encrypted.

If you don't hear anything, you're probably out of range of a repeater for now. Try somewhere higher, near a window, or outdoors, and ask in our [Discord](/discord) for the nearest repeater.

## Running a repeater

Repeaters are what make the mesh work. If you have a high spot with power and you're willing to leave a radio on 24/7, a repeater is the best thing you can add.

- **Location beats everything.** Height and a clear view toward town matter more than radio power.
- **Power.** USB, PoE, or solar with a battery. Solar setups need enough battery to get through a few cloudy days.
- **Weatherproofing.** Use an outdoor enclosure, sealed cable glands, and a properly mounted external antenna.
- **Setup.** Flash the **Repeater** firmware, then configure it over USB with the [MeshCore config tool](https://config.meshcore.io/). Set the US preset and a name, and set an **admin password**. After that you can manage it remotely from the app.
- **Tell us about it.** [Submit your node](/submit-node/) so we can track coverage and feature it.

Not sure where to start? Email [contact@tricitiesmesh.net](mailto:contact@tricitiesmesh.net). We're happy to help pick a site and gear.

## Learn more

- [MeshCore documentation](https://docs.meshcore.io/)
- [MeshCore FAQ](https://github.com/meshcore-dev/MeshCore/blob/main/docs/faq.md)
- [Our community](/community/): Discord and Facebook for local help
