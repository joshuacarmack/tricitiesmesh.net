# Tri-Cities Mesh

The source for **[tricitiesmesh.net](https://tricitiesmesh.net)** — a community site for [Meshtastic](https://meshtastic.org) users in the Tri-Cities area of Northeast Tennessee (Kingsport · Johnson City · Bristol).

Meshtastic is an open-source, off-grid, long-range messaging network built on affordable LoRa radios. No cell service, no fees, no internet required.

---

## About the Site

This site is built with [Hugo](https://gohugo.io/) using the [Docsy](https://www.docsy.dev/) theme. It covers:

- **Getting started** guides for new users
- **Node directory** — community nodes across the region
- **Coverage map** links
- **Blog** and community news

Live site: [tricitiesmesh.net](https://tricitiesmesh.net)

---

## Running Locally

### Prerequisites

- [Hugo **extended**](https://gohugo.io/installation/) v0.146.0 or later
- [Go](https://go.dev/dl/) 1.18 or later
- [Node.js](https://nodejs.org/) (for PostCSS/SCSS)

### Setup

```bash
git clone https://github.com/joshuacarmack/tricitiesmesh.net.git
cd tricitiesmesh.net
npm install
hugo server
```

Open [http://localhost:1313](http://localhost:1313) in your browser. Changes hot-reload automatically.

### Running with Docker

If you'd rather skip installing dependencies:

```bash
docker-compose up --build
```

Then open [http://localhost:1313](http://localhost:1313). Press **Ctrl+C** to stop.

To clean up:

```bash
docker-compose rm
```

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for full details. The short version:

1. Fork the repo and create a feature branch.
2. Make your changes.
3. Open a pull request — all submissions go through GitHub PR review.

Content lives in `content/en/`. Hugo's [content organization docs](https://gohugo.io/content-management/organization/) are a good reference if you're adding pages.

---

## Troubleshooting

**`shortcode "blocks/cover" not found`** — You're running an outdated Hugo version. Upgrade to v0.146.0+.

**`TOCSS: failed to transform "scss/main.scss"`** — You need the Hugo **extended** edition, not the standard one.

**`binary with name "go" not found`** — Go is not installed. [Install Go](https://go.dev/dl/) and try again.

---

## Community

| Channel | Link |
|---|---|
| Facebook Group | [Tri-Cities Meshtastic](https://www.facebook.com/groups/1096862151623739) |
| Discord | [discord.gg/ZC9wqtxWTV](https://discord.gg/ZC9wqtxWTV) |
| Live Coverage Map | [meshtastic.n4jhc.com](https://meshtastic.n4jhc.com/) |

---

## License

See [LICENSE](LICENSE). This site is not affiliated with or endorsed by the Meshtastic project.
