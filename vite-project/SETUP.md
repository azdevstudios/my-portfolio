# Portfolio dashboard

## Local development

Use Node.js 24 and install dependencies with `npm install`.

Run `npx vercel dev` from `vite-project` to serve the React app and API functions together. `npm run dev` serves only the frontend.

Vercel project settings must contain these private environment variables for Development:

- `MONGODB_URI`: database connection string, with URL-encoded database credentials.
- `MONGODB_DB`: database name.
- `ADMIN_EMAIL`: dashboard login email.
- `ADMIN_PASSWORD_HASH`: full `scrypt:SALT:HASH` value.
- `SESSION_SECRET`: a randomly generated secret of at least 64 characters.

Keep `.env.local` ignored. Never prefix these variables with `VITE_`. Vercel Development environment variables are loaded by `vercel dev`.

## Content management

- `/admin/login`: email/password login.
- `/admin`: actual project summary.
- `/admin/projects`: searchable collection, create/edit, image upload, remove and immediate Undo.
- `/admin/profile`: name, title, location, homepage copy and About biography.
- `/admin/settings`: WhatsApp number and social URLs.

Project writes, profile/settings writes and image uploads require a signed admin cookie and same-origin JSON requests. Sessions last eight hours. Login attempts are limited per admin account per 15-minute window.

Public Projects reads MongoDB. Profile changes update the homepage, biography, contact location, WhatsApp and social links. Visitors see new content when they load or refresh a page. The contact form still opens WhatsApp; the visitor must press Send there.

Images support PNG/JPG/WebP inputs under 10 MB. The editor automatically resizes large images to at most 1600 pixels and uses WebP when it reduces size. The uploaded output must be under 2 MB and is stored in MongoDB. Browsers without conversion support can still upload originals under 2 MB. Uploaded image URLs are immutable. Removing a project archives it instead of permanently deleting its content. Undo is available in the current page notification. Uploaded images are retained; unused uploads are not automatically cleaned up.

## First-time import

If projects are not already imported, run `node server/seed-projects.js`. It reads local `.env.local` and inserts missing seed projects without overwriting existing records. Do not rerun it to sync later edits; use the dashboard.

## Validation

- `npm test`: isolated API/security tests. Uses an in-memory database mock and no real account credentials or live records.
- `npm run build`: production frontend build.

## Deploy to the existing Vercel project

1. Add the five required variables to the Vercel project's **Production** environment as well. Development-only values are not available to the live deployment.
2. Confirm the project Root Directory is `vite-project` if the Git repository contains that parent directory; the selected root must contain `package.json`, `vercel.json` and `api/`.
3. Commit source changes and push to the existing connected repository, or redeploy after setting variables. Do not commit `.env*`, `.vercel/`, or `node_modules/`.
4. Verify login, project save/refresh, public Projects and profile/contact updates on the deployment.

Keep the existing page rewrites: never rewrite `/api/*` or JS/CSS assets to `index.html`. MongoDB Atlas must permit the deployment's database connection.
