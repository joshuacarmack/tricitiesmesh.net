# Tri-Cities Mesh

The source for **[tricitiesmesh.net](https://tricitiesmesh.net)** — a community site for the [MeshCore](https://meshcore.io) mesh network in the Tri-Cities area of Northeast Tennessee (Kingsport · Johnson City · Bristol).

MeshCore is open-source firmware that turns affordable LoRa radios into an off-grid, long-range messaging network. No cell service, no fees, no internet required. (The community started on Meshtastic and moved to MeshCore in 2026.)

---

## About the Site

This site is built with [Hugo](https://gohugo.io/) using the [Docsy](https://www.docsy.dev/) theme. It covers:

- **Getting started** guides for new users, including the local radio preset
- **Coming from Meshtastic** migration guide
- **Node directory** — repeaters and fixed nodes across the region (`content/en/nodes/`)
- **Coverage map** links
- **Blog** and community news

Live site: [tricitiesmesh.net](https://tricitiesmesh.net)

---

## Running Locally

### Prerequisites

- [Node.js](https://nodejs.org/) 22 or later (LTS 24 recommended)
- [Go](https://go.dev/dl/) 1.18 or later (Hugo uses it to fetch the Docsy theme module)

`npm install` provides everything else: Hugo **extended** (pinned in `package.json`) and Dart Sass (`sass-embedded`), which Docsy 0.17+ requires.

### Setup

```bash
git clone https://github.com/joshuacarmack/tricitiesmesh.net.git
cd tricitiesmesh.net
npm install
npm run serve
```

Use the npm scripts (`npm run serve`, `npm run build:production`) rather than a global `hugo`, so the pinned Hugo and Dart Sass from `node_modules/.bin` are used.

Open [http://localhost:1313](http://localhost:1313) in your browser. Changes hot-reload automatically.

---

## Node pages

Each featured node is a page bundle in `content/en/nodes/<NAME>/index.md` with front matter like:

```yaml
meshcore:
  name: Bays Mountain 1
  role: Repeater        # Companion | Repeater | Room Server | Sensor
  publicKey: ""         # MeshCore public key (or its first few bytes)
  hardware: RAK4631
  status: Active        # Active | Migrating | Offline
location:
  name: Bays Mountain Radio Towers
  latitude: 36.52684
  longitude: -82.58682
```

---

## Updating Hugo and Docsy

```bash
npm run update:hugo                              # bump hugo-extended
npm install-scripts approve hugo-extended        # re-approve its installer
hugo mod get -u github.com/docsy/docsy/theme     # bump Docsy
hugo mod tidy && hugo mod npm pack && npm install
```

Read the [Docsy release notes](https://www.docsy.dev/blog/) before upgrading Docsy. Most releases include breaking changes.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for full details. The short version:

1. Fork the repo and create a feature branch.
2. Make your changes.
3. Open a pull request — all submissions go through GitHub PR review.

Content lives in `content/en/`. Hugo's [content organization docs](https://gohugo.io/content-management/organization/) are a good reference if you're adding pages.

---

## Troubleshooting

**`module "github.com/docsy/docsy/theme" ... hugoVersion`** — Your Hugo is too old. Docsy 0.18 needs Hugo extended v0.160.1+. Use `npm run serve` to get the pinned version.

**Sass / `TOCSS` errors** — Dart Sass isn't on your `PATH`. Run `npm install`, then build through the npm scripts.

**`npm dependencies are out of sync`** — After updating Docsy, run `hugo mod npm pack && npm install`.

**Hugo binary missing after `npm install`** — npm 11+ blocks install scripts unless approved. `hugo-extended` is approved in `package.json` under `allowScripts`. If you bump its version, run `npm install-scripts approve hugo-extended`.

**`binary with name "go" not found`** — Go is not installed. [Install Go](https://go.dev/dl/) and try again.

---

## Community

| Channel | Link |
|---|---|
| Facebook Group | [Tri-Cities Mesh](https://www.facebook.com/groups/1096862151623739) |
| Discord | [discord.gg/ZC9wqtxWTV](https://discord.gg/ZC9wqtxWTV) |
| Live Map | [map.meshcore.io](https://map.meshcore.io/) |

---

## License

See [LICENSE](LICENSE). This site is not affiliated with or endorsed by the MeshCore project.
