# Foldera

Foldera is a Google Drive-inspired image workspace with:

- JWT authentication with HTTP-only cookies
- Nested folders per user
- Cloudinary image uploads
- Recursive folder size calculation
- Next.js frontend and Express/MongoDB backend

## Project structure

- `client/` - Next.js App Router frontend with Tailwind CSS and shadcn-style UI
- `server/` - Express API with MongoDB, Mongoose, JWT auth, and Cloudinary uploads

## Setup

### 1. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 2. Configure environment variables

Backend:

```bash
cp server/.env.example server/.env
```

Frontend:

```bash
cp client/.env.example client/.env.local
```

Fill in MongoDB Atlas, Cloudinary, JWT secret, and API URL values.

### 3. Run locally

Backend:

```bash
cd server
npm run dev
```

Frontend:

```bash
cd client
npm run dev
```

## API overview

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/folders`
- `GET /api/folders?parentId=...`
- `GET /api/folders/:id/size`
- `POST /api/images/upload`
- `GET /api/images?folderId=...`
- `GET /api/mcp/tools`

## Deployment

### Frontend

- Deploy `client/` to Vercel
- Set `NEXT_PUBLIC_API_URL` to the deployed backend API origin with `/api`

### Backend

- Deploy `server/` to Render or Railway
- Set all values from `server/.env.example`
- Allow the frontend origin through `CLIENT_URL`

### Render keep-alive

- This repo now includes a root-level `render.yaml` that defines:
  - a `foldera-api` web service
  - a `foldera-api-keepalive` cron job
- The cron job runs every 10 minutes and pings `http://foldera-api:<port>/api/health` over Render's private network to help prevent the free web service from idling out.
- The cron schedule is `*/10 * * * *` in UTC, based on Render's cron job docs.
- Render cron jobs are not available on the free plan, so the keep-alive service is configured with `plan: starter`.
- After connecting the repo in Render, you can deploy both services from the Blueprint and then fill in the prompted secret env vars in the dashboard.

### Managed services

- Use MongoDB Atlas for the database
- Use Cloudinary for hosted image storage
