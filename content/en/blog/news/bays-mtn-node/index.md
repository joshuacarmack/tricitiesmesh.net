---
date: 2025-10-03
title: Installing a node on Bays Mountain
linkTitle: Bays Mountain Node
description: >
  A year of trial and error putting a node on the Kingsport Amateur Radio Club tower atop Bays Mountain.
author: Joshua Carmack
---

Bays Mountain is one of the best vantage points in the Tri-Cities, and the Kingsport Amateur Radio Club's tower up there is an obvious home for a mesh node. Getting one working has been harder than expected.

![Node on the tower](/nodes/bm/IMG_2935.jpg)

## The short version

- **July 2024.** The first node went up but wasn't working when installed.
- **January 2025.** We brought it down and found the battery had died before install. The RAK board didn't power itself back on when the battery recovered.
- **February 2025.** After a reset and reinstall it sent telemetry fine, but it wouldn't receive or relay messages.
- **Summer 2025.** We tested other hardware. A node at another corner of the mountain worked fine, which pointed to RF noise at the tower site.
- **October 2025.** We reinstalled with a new RAK node, a new enclosure, and a 900 MHz cavity filter. Next we'll try mounting it a few feet off the tower.

The full history, with photos, is on the [Bays Mountain node page](/nodes/bm/).

## What we've learned

High sites near other transmitters are noisy. Filtering and physical separation from the other antennas matter as much as height. A board that powers itself back on after a battery recovers is worth a lot when the node is up a tower.
