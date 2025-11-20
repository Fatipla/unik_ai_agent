# Environment Variables për Vercel Deployment

Këto janë të gjitha variablat e environment që duhet të vendosen në Vercel Dashboard për deployment-in e suksesshëm.

## Database (Supabase Postgres)

```
POSTGRES_URL=postgresql://user:password@host:port/database
```

Marr këtë URL nga Supabase Dashboard → Settings → Database → Connection String (Transaction mode)

## NextAuth (Authentication)

```
NEXTAUTH_SECRET=your-random-32-character-secret
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
```

- `NEXTAUTH_SECRET`: Gjenero një secret të fortë (minimum 32 karaktere). Mund të përdorësh: `openssl rand -base64 32`
- `NEXTAUTH_URL`: URL-ja e plotë e deployment tuaj në Vercel

## Google OAuth (opsionale, por e rekomanduar)

```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Merr nga: https://console.cloud.google.com/apis/credentials
- Krijo një OAuth 2.0 Client ID
- Shto Authorized redirect URIs: `https://your-vercel-domain.vercel.app/api/auth/callback/google`

## Paddle Billing

```
PADDLE_VENDOR_ID=123456
PADDLE_CLIENT_ID=your_client_id
PADDLE_CLIENT_SECRET=your_client_secret
PADDLE_WEBHOOK_SECRET=your_webhook_secret
PADDLE_ENV=sandbox
```

Marr nga Paddle Dashboard:
- Vendor/Seller ID: Settings → Account
- API Keys: Developer Tools → Authentication
- Webhook Secret: Developer Tools → Notifications → Create webhook
  - Webhook URL: `https://your-vercel-domain.vercel.app/api/webhooks/paddle`
  - Events: `checkout.completed`, `transaction.completed`, `subscription.created`, `subscription.updated`, `subscription.canceled`, `payment.failed`

**Për Production:** Ndrysho `PADDLE_ENV=live` dhe përdor API keys të live environment.

## Paddle Price IDs (PUBLIC - duhet të fillojnë me NEXT_PUBLIC_)

```
NEXT_PUBLIC_PADDLE_PRICE_STANDARD_M=pri_01xxxxx
NEXT_PUBLIC_PADDLE_PRICE_STANDARD_Y=pri_01xxxxx
NEXT_PUBLIC_PADDLE_PRICE_PRO_M=pri_01xxxxx
NEXT_PUBLIC_PADDLE_PRICE_PRO_Y=pri_01xxxxx
NEXT_PUBLIC_PADDLE_PRICE_ENTERPRISE_M=pri_01xxxxx
NEXT_PUBLIC_PADDLE_PRICE_ENTERPRISE_Y=pri_01xxxxx
```

Merr nga Paddle Dashboard → Catalog → Prices. Kopjo Price ID për çdo plan dhe interval (monthly/yearly).

## OpenAI (për Chat API)

```
OPENAI_API_KEY=sk-proj-xxxxx
OPENAI_MODEL=gpt-4o-mini
```

- Marr API key nga: https://platform.openai.com/api-keys
- Model: `gpt-4o-mini` (default), `gpt-4o`, `gpt-4-turbo`, etj.

## Opsionale (Email, Voice, etj.)

Këto mund të shtohen më vonë për features shtesë:

```
# Email notifications (opsionale)
POSTMARK_KEY=
SENDGRID_KEY=

# Voice integration (opsionale)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
```

---

## Hapat e Deployment në Vercel:

1. **Import repo nga GitHub** në Vercel Dashboard
2. **Set Framework Preset:** Next.js
3. **Set Build Command:** `pnpm build` (ose le default)
4. **Environment Variables:** Shto të gjitha variablat e mësipërme në "Environment Variables" section
5. **Deploy!**

## Pas Deployment:

1. **Ekzekuto Migrations:**
   - Lidhu me Supabase database
   - Ekzekuto të gjitha migrations në `supabase/migrations/` me renditjen e duhur:
     ```sql
     001_create_billing_schema.sql
     002_enable_rls.sql
     003_create_rpc_functions.sql
     004_seed_entitlements.sql
     005_nextauth_schema.sql
     ```

2. **Testo Authentication:**
   - Regjistrohu një user test
   - Testo login
   - Testo Google OAuth

3. **Testo Paddle Checkout:**
   - Shko te `/pricing`
   - Kliko "Start 7-Day Trial" ose "Choose Pro"
   - Përdor Paddle test cards për të testuar checkout flow
   - Verifikoni që webhook po funksionon (shiko Paddle Dashboard → Developer Tools → Events)

4. **Monitoro Logs:**
   - Vercel Dashboard → Deployment → Functions → Logs
   - Kontrollo për gabime në authentication, Paddle webhooks, database queries

---

## Test Cards për Paddle (Sandbox):

- **Success:** 4242 4242 4242 4242
- **Declined:** 4000 0000 0000 0002
- CVV: çdo 3 shifra
- Expiry: çdo datë në të ardhmen

---

## Support:

Për probleme të deployment ose pyetje, kontrollo:
- Vercel logs
- Supabase logs
- Paddle webhook events
- Browser console për frontend errors
