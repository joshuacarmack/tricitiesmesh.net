---
title: Kingsport Monitor
description: Powered node in Kingsport, used for mapping and telemetry keeping.
date: 2025-04-13T10:55:00.000Z
lora:
  shortName: KPTM
  longName: Kingsport Monitor
  mode: CLIENT_HIDDEN
  nodeNumber: 0
  meshtasticId: "!34078216"
  mqtt: Direct
contact:
  name: Joshua Carmack
  amateurCallsign: N4JHC
  mestasticName: N4JHC
  email: n4jhcradio@gmail.com
  discord: 
location:
  name: Kingsport, TN (Wilcox Dr)
  latitude: 36.53747
  longitude: -82.54736
  agl: 1
  altitude: 377
---
Maintained by Joshua Carmack. Used for mapping purposes, runs this site plus multiple telemetry monitors.

View some of the telemetry at [https://tricitiesmesh.net/map](https://tricitiesmesh.net/map). This shows a live view of any node that can be heard from downtown Kingsport.

## Node Setup

The node is a Heltec V3 that is on a pole on my roof. It is powered with a PoE splitter so I can run simple CAT5E cable up to it for power. It is in a cheap NEMA enclosure with an external ALFA antenna.

![Node testing](fa442070-7582-43b5-9d7d-036e0115e343.jpg)

## Software

For the software portion, I have a Windows virtual machine running on my home server that has [MeshSense by Affirmatech](https://affirmatech.com/meshsense) installed. The node is connected to my Wi-Fi so the server is able to connect to it that way. I can then expose this software through my reverse proxy so anyone can visit [https://meshtastic.n4jhc.com/](https://meshtastic.n4jhc.com/) and view the interface of the application.

This was the first thing I set up and has proven to be an invaluable tool for testing and experimenting with nodes.