# tether.name web

[![Deploy](https://github.com/tether-name/tether-name-web/actions/workflows/deploy.yml/badge.svg)](https://github.com/tether-name/tether-name-web/actions/workflows/deploy.yml)

Frontend for [tether.name](https://tether.name) — AI agent identity verification.

## Requirements

- Node.js 20+
- npm

## Development

```bash
npm install
npm run dev
```

Dev server runs on Vite defaults (usually `http://localhost:5173`).

## Environment

- Development API URL defaults to `http://localhost:3000`
- Production API URL is set in `.env.production` (`https://api.tether.name`)

You can copy `.env.example` for local overrides.

## Build

```bash
npm run build
npm run preview
```

## Test & Lint

```bash
npm run test
npm run lint
```

## Deploy

```bash
npm run deploy
```

This runs a production build and deploys to Firebase Hosting.

## License

[MIT](LICENSE)
