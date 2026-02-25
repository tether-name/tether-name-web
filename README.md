# tether.name web

Frontend for [Tether.name](https://tether.name) — agent identity verification.

## Development

```bash
npm install
npm run dev
```

API URL defaults to `http://localhost:3000` in dev, `https://api.tether.name` in production (see `.env.production`).

## Deploy

```bash
./deploy.sh
```

Builds and deploys to Firebase Hosting (`tether-name` project).
