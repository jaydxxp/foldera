# Foldera API

Express + MongoDB backend for the Foldera drive-like app.

## Scripts

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm start
```

## Environment

Copy `.env.example` to `.env` and fill in:

- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CLIENT_URL`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
