# 🏗️ Plani i Refaktorimit të Arkitekturës

## 🎯 Objektivi
Implementimi i një arkitekture të plotë multi-tenant SaaS me 20+ entitete sipas specifikimit të fundit.

## 📊 Analiza e Gjendjes Aktuale

### ❌ Problemet
1. **Overlap i tabelave**: `users` vs `users_profile`, `subscriptions` vs `subscriptions_v2`
2. **Fragmentim**: 9 migrime të veçanta që krijojnë struktura të ndryshme
3. **Entitete që mungojnë**:
   - Channels, Contacts
   - AI Agents, Knowledge Sources, Document Chunks
   - Workflows, Workflow Runs
   - Call Sessions, Call Turns, Call Transcripts (voice AI i plotë)
   - Webhook Subscriptions
   - Audit Logs
   - API Keys (per multi-tenancy)

### ✅ Çfarë funksionon
- NextAuth authentication
- Basic conversations dhe messages
- Paddle billing integration (partial)
- Basic dashboards

## 🚀 Plani i Implementimit

### **FAZA 1: Pastrimi dhe Baza e Re (P0)**

#### 1.1 Krijimi i Migration-it Master
- **File**: `/supabase/migrations/100_master_schema.sql`
- **Përmban**:
  - DROP të tabelave të vjetra që konfliktojnë
  - CREATE të 20+ tabelave të reja
  - Indexes dhe foreign keys
  - RLS policies

#### 1.2 Skema e Re Drizzle
- **File**: `/src/lib/db/schema-v2.ts`
- **Përmban të gjitha entitetet**:
  1. **Core Multi-Tenancy**
     - organizations
     - users (unified)
     - api_keys
  
  2. **Messaging & Communication**
     - channels
     - contacts
     - conversations (refactored)
     - messages (refactored)
  
  3. **AI & Knowledge**
     - ai_agents
     - knowledge_sources
     - document_chunks
  
  4. **Workflows Engine**
     - workflows
     - workflow_runs
  
  5. **Billing & Usage**
     - plans (consolidated)
     - subscriptions (unified)
     - usage (metrics)
  
  6. **Voice AI Module**
     - call_sessions
     - call_turns
     - call_transcripts
  
  7. **Webhooks**
     - webhook_subscriptions
  
  8. **Audit**
     - audit_logs

---

### **FAZA 2: API Endpoints (P0)**

#### 2.1 Versioned REST API
- **Base**: `/api/v1/`
- **Endpoints**:
  - Auth & Onboarding
    - `POST /api/v1/auth/signup`
    - `POST /api/v1/auth/login`
    - `GET /api/v1/me`
  
  - Organizations
    - `GET /api/v1/organizations`
    - `POST /api/v1/organizations`
    - `PATCH /api/v1/organizations/:id`
  
  - Conversations
    - `GET /api/v1/conversations`
    - `POST /api/v1/conversations`
    - `GET /api/v1/conversations/:id/messages`
  
  - AI Agents
    - `GET /api/v1/ai-agents`
    - `POST /api/v1/ai-agents`
    - `PATCH /api/v1/ai-agents/:id`
  
  - Knowledge Base
    - `POST /api/v1/knowledge-sources`
    - `GET /api/v1/knowledge-sources`
  
  - Workflows
    - `GET /api/v1/workflows`
    - `POST /api/v1/workflows`
    - `POST /api/v1/workflows/:id/run`
  
  - Voice AI
    - `POST /api/v1/call-sessions`
    - `GET /api/v1/call-sessions/:id`
  
  - Webhooks
    - `GET /api/v1/webhook-subscriptions`
    - `POST /api/v1/webhook-subscriptions`

---

### **FAZA 3: Services Layer (P1)**

#### 3.1 Business Logic Services
- `/lib/services/organizations.service.ts`
- `/lib/services/conversations.service.ts`
- `/lib/services/ai-agents.service.ts`
- `/lib/services/workflows.service.ts`
- `/lib/services/billing.service.ts`
- `/lib/services/usage.service.ts`
- `/lib/services/voice.service.ts`

---

### **FAZA 4: Dashboard Updates (P1)**

#### 4.1 Admin Dashboard
- Platform-wide statistics
- Organization management
- Usage monitoring

#### 4.2 Client Dashboard
- Organization stats
- Conversations history
- Voice calls history
- Knowledge base management
- Workflows management

---

## 📋 Checklist

### FAZA 1
- [ ] Krijimi i `100_master_schema.sql`
- [ ] Krijimi i `schema-v2.ts`
- [ ] Update i `drizzle.config.ts`
- [ ] Ekzekutimi i migrimit
- [ ] Verifikimi i strukturës

### FAZA 2
- [ ] Auth & Onboarding endpoints
- [ ] Organizations CRUD
- [ ] Conversations & Messages
- [ ] AI Agents CRUD
- [ ] Knowledge Base endpoints
- [ ] Workflows CRUD
- [ ] Voice AI endpoints
- [ ] Webhooks management

### FAZA 3
- [ ] Services implementation
- [ ] Business logic
- [ ] Validations

### FAZA 4
- [ ] Admin dashboard update
- [ ] Client dashboard update
- [ ] UI components

---

## 🔄 Migration Strategy

### Approach: Fresh Start (Recommended)
- Krijon një migration të ri master
- Braktis strukturën e vjetër
- Të gjitha entitetet në një vend
- Më e lehtë për të menaxhuar

### Data Migration (If Needed)
- Export data nga tabela të vjetra
- Transform në strukturën e re
- Import në tabela të reja

---

## ⚠️ Warnings

1. **Breaking Changes**: Kjo është një refaktorim i plotë
2. **Backup**: Sigurohuni që të keni backup të të dhënave
3. **Testing**: Test i detajuar para deployment
4. **Environment Variables**: Verifikoni që `.env` variablat janë konfiguruar saktë

---

## 📅 Timeline

- **FAZA 1**: 2-3 orë (Schema dhe migration)
- **FAZA 2**: 4-6 orë (API endpoints)
- **FAZA 3**: 2-3 orë (Services)
- **FAZA 4**: 2-3 orë (Dashboards)

**Total**: ~10-15 orë pune
