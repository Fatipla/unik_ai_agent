# 🔓 Full Access Guide - Development & Testing

## ✅ HAPI 1: Setup Admin Account

### Opsioni A: Përmes Dev Setup Page (MË I SHPEJTË)

1. **Hap në browser:**
   ```
   https://your-vercel-url.vercel.app/dev-setup
   ```

2. **Plot formën:**
   - **Name:** Admin (ose emri yt)
   - **Email:** admin@test.com (ose email-i yt)
   - **Password:** admin12345 (minimum 8 karaktere)
   - **Setup Key:** `change-me-in-production` (default)

3. **Kliko "Create Admin User"**

4. **Shko te `/login`** dhe hyr me kredencialet që krijove

5. **Access dashboards:**
   - Super Admin: `/admin`
   - Client Dashboard: `/dashboard`

---

### Opsioni B: Përmes API (cURL)

```bash
curl -X POST https://your-url.vercel.app/api/setup-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "admin12345",
    "name": "Admin",
    "setupKey": "change-me-in-production"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Admin user created successfully",
  "userId": "uuid-here",
  "email": "admin@test.com"
}
```

---

### Opsioni C: Direkt në Database (Supabase)

Nëse ke akses në Supabase SQL Editor:

```sql
-- 1. Gjej user ID
SELECT id, email FROM users WHERE email = 'your-email@example.com';

-- 2. Shto në admin_users
INSERT INTO admin_users (user_id, role, permissions)
VALUES ('your-user-id-from-step-1', 'super_admin', '["full_access"]');
```

---

## ✅ HAPI 2: Login & Access

1. **Hyr:**
   - Shko te: `/login`
   - Email: admin@test.com (ose çfarë krijove)
   - Password: admin12345

2. **Verify access:**
   - Duhet të shohësh "Dashboard" dhe "Logout" në navbar
   - Kliko "Dashboard"

3. **Test Super Admin:**
   - Shko te: `/admin`
   - Duhet të shohësh stats cards dhe users table
   - Nëse shikon "403 Forbidden", admin user nuk u krijua saktë

---

## 🔐 Environment Variables (të nevojshme)

### Vercel Dashboard → Settings → Environment Variables:

```bash
# Database (REQUIRED)
POSTGRES_URL=postgresql://user:pass@host:port/db

# Auth (REQUIRED)
NEXTAUTH_SECRET=your-32-char-secret
NEXTAUTH_URL=https://your-vercel-url.vercel.app

# Admin Setup (OPTIONAL - për testing)
ADMIN_SETUP_SECRET=your-custom-secret-key

# Paddle (OPTIONAL - për billing)
PADDLE_VENDOR_ID=...
PADDLE_CLIENT_ID=...
PADDLE_CLIENT_SECRET=...

# OpenAI (OPTIONAL - për chat)
OPENAI_API_KEY=sk-...
```

---

## 📋 Testing Checklist

### Authentication:
- [ ] `/signup` - Regjistrohu një user i ri
- [ ] `/login` - Hyr me credentials
- [ ] Navbar shows "Dashboard" dhe "Logout" kur je loguar
- [ ] `/dashboard` redirects te `/login` kur s'je loguar

### Client Dashboard:
- [ ] `/dashboard` - Overview cards (Profile, Plan, Usage)
- [ ] Tab "Përdorimi" - Progress bar
- [ ] Tab "Biseda" - Empty state (ose conversations nëse ke)
- [ ] Tab "Thirrje" - Empty state (ose calls nëse ke)

### Super Admin:
- [ ] `/admin` - Stats cards (Total Users, Subscriptions, etc.)
- [ ] Users table populated
- [ ] Non-admin users get 403 error

### Pricing:
- [ ] `/pricing` - Product selector (Chatbot, Voice, Bundle)
- [ ] Monthly/Yearly toggle
- [ ] Të gjitha cards me "Zgjidhni Planin" button
- [ ] Cards simetrike (same height, aligned buttons)

---

## 🐛 Troubleshooting

### Error: "Gabim gjatë autentifikimit"

**Causes:**
1. Database nuk është connected
2. NEXTAUTH_SECRET mungon
3. NEXTAUTH_URL është gabim

**Fix:**
```bash
# Vercel → Settings → Environment Variables
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=https://your-exact-vercel-url.vercel.app
```

Pastaj: **Redeploy** në Vercel.

---

### Error: "403 Forbidden" në `/admin`

**Cause:** User nuk është në tabelen `admin_users`

**Fix:**
- Përdor `/dev-setup` page për të krijuar admin
- Ose run SQL direkt në Supabase (shiko Opsioni C)

---

### Error: "Failed to fetch" në Dashboard

**Cause:** API routes po kthejnë 500 ose database nuk është configured

**Fix:**
1. Check Vercel logs: Deployment → Functions → Logs
2. Verify `POSTGRES_URL` është set correctly
3. Run migrations në Supabase

---

## 🚀 Quick Deploy Checklist

**Pre-Deploy:**
- [ ] All migrations run në Supabase (001-006)
- [ ] Environment variables set në Vercel
- [ ] `NEXTAUTH_SECRET` generated

**Post-Deploy:**
- [ ] Visit `/dev-setup` dhe krijo admin user
- [ ] Login te `/login`
- [ ] Test `/admin` dashboard
- [ ] Test `/dashboard` tabs
- [ ] Test `/pricing` product selector

---

## 🔑 Default Credentials (për DEV)

**Admin User:**
```
Email: admin@test.com
Password: admin12345
Setup Key: change-me-in-production
```

⚠️ **IMPORTANT:** Ndrysho `ADMIN_SETUP_SECRET` në production!

---

## 📞 Need Help?

1. Check Vercel deployment logs
2. Check Supabase logs
3. Browser console për frontend errors
4. Network tab për API call failures

**Common URLs:**
- Dev Setup: `/dev-setup`
- Login: `/login`
- Admin: `/admin`
- Client Dashboard: `/dashboard`
- Pricing: `/pricing`

---

## ✅ SUCCESS! 

Kur të gjitha këto funksionojnë:
- ✅ Login works
- ✅ `/admin` shows data
- ✅ `/dashboard` tabs work
- ✅ `/pricing` selector works

**You have FULL ACCESS!** 🎉

Start testing dhe developing!
