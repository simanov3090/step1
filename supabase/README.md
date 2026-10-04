# Hosted order storage

Local development stores orders in the ignored `.data/orders.json` file. Vercel functions use a temporary filesystem, so production must use Supabase.

1. Create a Supabase project and run [`schema.sql`](schema.sql) in its SQL Editor.
2. Add these server-only variables to the Vercel project, then redeploy:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` (never prefix this with `NEXT_PUBLIC_`)
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `ADMIN_SESSION_SECRET`
3. Keep the service-role key private. The app uses it only in Route Handlers; browser requests cannot access it.

For local development, the Supabase variables are optional; the same API uses the file-backed store.

## Reservations

Re-run `schema.sql` in existing Supabase projects to create the `reservations` table. Existing orders are preserved. Reservations use the same server credentials; local development stores them in `.data/reservations.json`. The admin dashboard displays reservations and refreshes every 12 seconds. Guest count 7 represents the form option “6+ guests”.
