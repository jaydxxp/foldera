# Foldera Web

Next.js App Router frontend for the Foldera drive-like experience.

## Local development

Create a `.env.local` from `.env.example`, then run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The app expects the backend API to be running and available at `NEXT_PUBLIC_API_URL`.

## Features

- Signup and login
- Nested folders
- Image uploads
- Breadcrumb navigation
- Folder size calculation

## Production

```bash
npm run build
npm start
```
