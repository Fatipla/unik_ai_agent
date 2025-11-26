# 🏗️ Arkitektura V2 - Multi-Tenant SaaS Backend

## 📋 Përmbledhje

Kjo është arkitektura e re, e plotë e backend-it për një platformë multi-tenant SaaS që përfshin:
- AI Agents & Chatbots
- Voice AI Module
- Knowledge Base Management
- Workflows Engine
- Billing & Subscriptions
- Webhooks
- Audit Logs

---

## 🗄️ Struktura e Databazës

### 1️⃣ **Multi-Tenancy Core**

#### Organizations
Organizatat janë njësia kryesore e multi-tenancy. Çdo organizatë ka planin e saj, përdoruesit, dhe të dhënat.

```typescript
{
  id: UUID
  name: string
  slug: string (unique)
  plan: string
  status: 'active' | 'suspended' | 'deleted'
  settings: JSON
  created_at: timestamp
  updated_at: timestamp
}
```

#### Users
Përdoruesit i përkasin një organizate dhe kanë role të ndryshme.

```typescript
{
  id: UUID
  organization_id: UUID (FK)
  email: string (unique)
  name: string
  password_hash: string
  role: 'owner' | 'admin' | 'member'
  email_verified: timestamp
  image: string
  created_at: timestamp
  updated_at: timestamp
}
```

#### API Keys
Çdo organizatë mund të gjenerojë API keys për të përdorur API-në public.

```typescript
{
  id: UUID
  organization_id: UUID (FK)
  name: string
  key_hash: string (unique)
  key_prefix: string
  permissions: string[]
  last_used_at: timestamp
  expires_at: timestamp
  created_by: UUID (FK users)
  created_at: timestamp
}
```

---

### 2️⃣ **Messaging & Communication**

#### Channels
Kanalet janë burimi i komunikimit (widget, WhatsApp, voice, API).

```typescript
{
  id: UUID
  organization_id: UUID (FK)
  name: string
  type: 'widget' | 'whatsapp' | 'voice' | 'api'
  settings: JSON
  is_active: boolean
  created_at: timestamp
  updated_at: timestamp
}
```

#### Contacts
Kontaktet janë klientët ose përdoruesit që komunikojnë me organizatën.

```typescript
{
  id: UUID
  organization_id: UUID (FK)
  email: string
  phone: string
  name: string
  metadata: JSON
  created_at: timestamp
  updated_at: timestamp
}
```

#### Conversations
Konversacionet janë biseda ndërmjet kontakteve dhe organizatës.

```typescript
{
  id: UUID
  organization_id: UUID (FK)
  contact_id: UUID (FK)
  channel_id: UUID (FK)
  status: 'active' | 'closed' | 'archived'
  metadata: JSON
  created_at: timestamp
  updated_at: timestamp
}
```

#### Messages
Mesazhet janë përmbajtja e konversacioneve.

```typescript
{
  id: UUID
  conversation_id: UUID (FK)
  direction: 'inbound' | 'outbound'
  role: 'user' | 'assistant' | 'system'
  content: text
  metadata: JSON (tokens, cost, etc.)
  created_at: timestamp
}
```

---

### 3️⃣ **AI & Knowledge Base**

#### AI Agents
Agjentët AI janë botët që përgjigjen në konversacione.

```typescript
{
  id: UUID
  organization_id: UUID (FK)
  name: string
  instructions: text
  model: string (default: 'gpt-4')
  settings: JSON (temperature, max_tokens, etc.)
  is_active: boolean
  created_at: timestamp
  updated_at: timestamp
}
```

#### Knowledge Sources
Burimet e dijes janë dokumentet, URL-të, ose teksti që përdoret për të trajnuar AI.

```typescript
{
  id: UUID
  organization_id: UUID (FK)
  name: string
  type: 'url' | 'file' | 'text'
  location: string
  status: 'pending' | 'processing' | 'ready' | 'failed'
  metadata: JSON
  created_at: timestamp
  updated_at: timestamp
}
```

#### Document Chunks
Copëzat e dokumenteve janë teksti i ndarë në pjesë të vogla për embedding.

```typescript
{
  id: UUID
  knowledge_source_id: UUID (FK)
  content: text
  embedding_vector: vector(1536)
  metadata: JSON (page_number, section, etc.)
  created_at: timestamp
}
```

---

### 4️⃣ **Workflows Engine**

#### Workflows
Workflow-et janë automatizime të personalizuara.

```typescript
{
  id: UUID
  organization_id: UUID (FK)
  name: string
  description: text
  definition: JSON {
    steps: [
      { id, type, config }
    ]
  }
  triggers: JSON [
    { type: 'webhook' | 'schedule' | 'event', config }
  ]
  is_active: boolean
  created_at: timestamp
  updated_at: timestamp
}
```

#### Workflow Runs
Ekzekutimet e workflow-eve.

```typescript
{
  id: UUID
  workflow_id: UUID (FK)
  status: 'running' | 'completed' | 'failed'
  input_data: JSON
  output_data: JSON
  error_message: text
  started_at: timestamp
  completed_at: timestamp
}
```

---

### 5️⃣ **Billing & Usage**

#### Plans
Produktet dhe çmimet.

```typescript
{
  id: string (e.g., 'chatbot_standard_monthly')
  product_type: 'chatbot' | 'voice' | 'bundle'
  tier: 'standard' | 'pro' | 'enterprise'
  billing_period: 'monthly' | 'yearly'
  currency: string (default: 'EUR')
  price: decimal
  is_active: boolean
  limits: JSON {
    max_conversations_per_month: number | null
    max_voice_calls_per_month: number | null
    has_widget_api: boolean
    has_kb_training: boolean
    has_basic_analytics: boolean
    has_advanced_analytics: boolean
    has_n8n_integration: boolean
    has_priority_support: boolean
    has_dedicated_support: boolean
    has_custom_integrations: boolean
    has_audit_logs: boolean
    has_call_recording: boolean
    has_call_analytics: boolean
    has_custom_voice_training: boolean
    has_white_label: boolean
    trial_days?: number
    savings_percent?: number
  }
  created_at: timestamp
  updated_at: timestamp
}
```

#### Subscriptions
Abonimet e organizatave.

```typescript
{
  id: UUID
  organization_id: UUID (FK)
  plan_id: string (FK)
  provider: 'stripe' | 'paddle'
  external_subscription_id: string
  status: 'trialing' | 'active' | 'past_due' | 'cancelled'
  current_period_start: timestamp
  current_period_end: timestamp
  cancel_at_period_end: boolean
  created_at: timestamp
  updated_at: timestamp
}
```

#### Usage
Tracking i përdorimit.

```typescript
{
  id: UUID
  organization_id: UUID (FK)
  period_start: timestamp
  period_end: timestamp
  metrics: JSON {
    conversations_count: number
    voice_calls_count: number
    ai_tokens: number
  }
  created_at: timestamp
  updated_at: timestamp
}
```

---

### 6️⃣ **Voice AI Module**

#### Call Sessions
Sesionet e thirrjeve.

```typescript
{
  id: UUID
  organization_id: UUID (FK)
  contact_id: UUID (FK)
  external_call_id: string
  direction: 'inbound' | 'outbound'
  status: 'initiated' | 'ringing' | 'in-progress' | 'completed' | 'failed'
  duration_seconds: integer
  recording_url: string
  metadata: JSON
  started_at: timestamp
  ended_at: timestamp
}
```

#### Call Turns
Turn-et e konversacionit në thirrje.

```typescript
{
  id: UUID
  call_session_id: UUID (FK)
  speaker: 'user' | 'agent'
  text: text
  audio_url: string
  duration_seconds: integer
  created_at: timestamp
}
```

#### Call Transcripts
Transkripimet e plota të thirrjeve.

```typescript
{
  id: UUID
  call_session_id: UUID (FK)
  full_text: text
  language: string
  confidence_score: decimal
  created_at: timestamp
}
```

---

### 7️⃣ **Webhooks**

#### Webhook Subscriptions
Webhooks për të dërguar events në external URLs.

```typescript
{
  id: UUID
  organization_id: UUID (FK)
  url: string
  events: string[] (e.g., ['conversation.created', 'call.completed'])
  secret: string
  is_active: boolean
  created_at: timestamp
  updated_at: timestamp
}
```

---

### 8️⃣ **Audit Logs**

#### Audit Logs
Logs për të gjitha veprimet.

```typescript
{
  id: UUID
  organization_id: UUID (FK)
  user_id: UUID (FK)
  action: string (e.g., 'agent.updated', 'plan.changed')
  resource_type: string (e.g., 'ai_agent', 'subscription')
  resource_id: UUID
  changes: JSON (before/after values)
  ip_address: inet
  user_agent: string
  created_at: timestamp
}
```

---

## 🔌 API Endpoints (v1)

### Authentication & Onboarding
```
POST   /api/v1/auth/signup
POST   /api/v1/auth/login
GET    /api/v1/me
```

### Organizations
```
GET    /api/v1/organizations
POST   /api/v1/organizations
PATCH  /api/v1/organizations/:id
DELETE /api/v1/organizations/:id
```

### Conversations
```
GET    /api/v1/conversations
POST   /api/v1/conversations
GET    /api/v1/conversations/:id
GET    /api/v1/conversations/:id/messages
POST   /api/v1/conversations/:id/messages
```

### AI Agents
```
GET    /api/v1/ai-agents
POST   /api/v1/ai-agents
GET    /api/v1/ai-agents/:id
PATCH  /api/v1/ai-agents/:id
DELETE /api/v1/ai-agents/:id
```

### Knowledge Base
```
GET    /api/v1/knowledge-sources
POST   /api/v1/knowledge-sources
GET    /api/v1/knowledge-sources/:id
DELETE /api/v1/knowledge-sources/:id
```

### Workflows
```
GET    /api/v1/workflows
POST   /api/v1/workflows
GET    /api/v1/workflows/:id
PATCH  /api/v1/workflows/:id
DELETE /api/v1/workflows/:id
POST   /api/v1/workflows/:id/run
```

### Voice AI
```
GET    /api/v1/call-sessions
POST   /api/v1/call-sessions
GET    /api/v1/call-sessions/:id
GET    /api/v1/call-sessions/:id/transcript
```

### Webhooks
```
GET    /api/v1/webhook-subscriptions
POST   /api/v1/webhook-subscriptions
DELETE /api/v1/webhook-subscriptions/:id
```

### Plans & Billing
```
GET    /api/v1/plans
GET    /api/v1/plans/comparison
GET    /api/v1/subscription
POST   /api/v1/subscription/checkout
POST   /api/v1/subscription/cancel
```

---

## 📊 Relationships Diagram

```
Organizations (1) ──> (∞) Users
Organizations (1) ──> (∞) API Keys
Organizations (1) ──> (∞) Channels
Organizations (1) ──> (∞) Contacts
Organizations (1) ──> (∞) Conversations
Organizations (1) ──> (∞) AI Agents
Organizations (1) ──> (∞) Knowledge Sources
Organizations (1) ──> (∞) Workflows
Organizations (1) ──> (1) Subscription
Organizations (1) ──> (∞) Usage
Organizations (1) ──> (∞) Call Sessions
Organizations (1) ──> (∞) Webhook Subscriptions
Organizations (1) ──> (∞) Audit Logs

Conversations (1) ──> (∞) Messages
Knowledge Sources (1) ──> (∞) Document Chunks
Workflows (1) ──> (∞) Workflow Runs
Call Sessions (1) ──> (∞) Call Turns
Call Sessions (1) ──> (1) Call Transcript
```

---

## ✅ Status

- [x] Master Schema Migration (100_master_schema.sql)
- [x] Drizzle Schema V2 (schema-v2.ts)
- [x] Plans Seed (101_seed_plans.sql)
- [ ] API Endpoints Implementation
- [ ] Services Layer
- [ ] Dashboard Updates
- [ ] Testing

---

## 🚀 Hapat e Ardhshëm

1. **FAZA 2**: Implementimi i API endpoints
2. **FAZA 3**: Implementimi i services layer
3. **FAZA 4**: Përditësimi i dashboards
4. **FAZA 5**: Testing i plotë

