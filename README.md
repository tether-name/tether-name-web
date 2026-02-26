# tether.name

[![Deploy](https://github.com/tether-name/tether-name-web/actions/workflows/deploy.yml/badge.svg)](https://github.com/tether-name/tether-name-web/actions/workflows/deploy.yml)

Frontend for [Tether.name](https://tether.name) — AI agent identity verification.

## Development

```bash
npm install
npm run dev
```

API URL defaults to `http://localhost:3000` in dev, `https://api.tether.name` in production (see `.env.production`).

## Build

```bash
npm run build
```

## Deploy

```bash
./deploy.sh
```

Builds and deploys to Firebase Hosting (`tether-name` project).

## License

[MIT](LICENSE)
