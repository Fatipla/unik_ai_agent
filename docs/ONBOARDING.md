# 🎯 Onboarding Guide - Unik AI Agent

Welcome to Unik AI Agent! This guide will help you get your AI chatbot live in 3 simple steps.

## Step 1: Choose Your Activation

Decide which features you want to enable for your AI agent:

### ☑️ Widget
Embeddable chat widget for your website. Perfect for customer support and lead generation.

**When to use**: Any website where you want instant customer assistance.

### ☑️ WhatsApp
Connect your AI agent to WhatsApp Business for messaging support.

**When to use**: If your customers prefer WhatsApp communication.

### ☑️ Voice
Enable voice transcription and text-to-speech capabilities.

**When to use**: Phone support, voice commands, or accessibility features.

**How to enable**:
1. Go to Dashboard → Settings
2. Toggle the features you want
3. Save changes

---

## Step 2: Add Knowledge

Train your AI agent with your business knowledge so it can provide accurate, helpful responses.

### Option A: Add URLs

Train from your existing website or documentation:

1. Go to Dashboard → Knowledge Base
2. Click "Train from URLs"
3. Enter URLs (one per line):
   ```
   https://yoursite.com/faq
   https://yoursite.com/docs
   https://yoursite.com/about
   ```
4. Click "Start Training"
5. Wait for processing (usually 1-5 minutes)

**Best practices**:
- Use pages with clear, structured content
- Include FAQ, product docs, and about pages
- Avoid pages with heavy navigation/footers

### Option B: Upload Files

Train from documents:

1. Go to Dashboard → Knowledge Base
2. Click "Upload Files"
3. Select PDF, DOCX, or TXT files
4. Click upload

**Supported formats**: PDF, DOCX, TXT, MD (max 10MB each)

### What happens after training?

Your AI agent will:
- Learn from the provided content
- Answer questions using this knowledge
- Provide accurate, context-aware responses
- Maintain your brand voice and tone

---

## Step 3: Install Widget

Get your chat widget live on your website in under 60 seconds.

### Method 1: 1-Line Script (Easiest)

1. Go to Dashboard → Installation
2. Copy the script tag
3. Paste before `</body>` in your HTML:

```html
<script
  src="https://agent.unik.ai/widget.js"
  data-agent-id="YOUR_ID"
  defer
></script>
```

4. Save and refresh your site
5. **Done!** The widget should appear in the bottom-right corner

### Method 2: NPM Package (For React/Vue)

```bash
# Install
npm install @unik/agent-widget

# Use in your app
import { initAgent } from '@unik/agent-widget';

initAgent({
  agentId: 'YOUR_ID',
  lang: 'en',
  theme: 'light',
  tone: 'professional'
});
```

### Method 3: Google Tag Manager

1. Go to GTM → New Tag
2. Choose Custom HTML
3. Paste widget script
4. Set trigger to "All Pages"
5. Publish

### Method 4: Platform-Specific

- **Shopify**: Theme → Actions → Edit code → theme.liquid
- **WordPress**: Use "Insert Headers and Footers" plugin
- **Webflow**: Project Settings → Custom Code → Footer

See Dashboard → Installation for detailed platform-specific instructions.

---

## ✅ Onboarding Complete!

You're all set! Your AI agent is now:
- ✅ Trained with your knowledge
- ✅ Live on your website
- ✅ Ready to assist customers

### Next Steps

1. **Test the widget**: Try asking questions to see how it responds
2. **Review conversations**: Dashboard → Chat History to see all interactions
3. **Monitor usage**: Dashboard → Overview to track costs and limits
4. **Customize settings**: Adjust tone, language, and appearance
5. **Upgrade if needed**: If you hit limits, upgrade your plan

### Getting Help

- **Documentation**: Check /docs for detailed guides
- **API Reference**: See /docs/api for technical details
- **Support**: Email support@unik.ai or use the chat widget on our site

### Cost Management

Your plan includes:
- **Standard**: 500 chats/month, €9.995 AI cost cap
- **Pro**: 1,500 chats/month, €14.995 AI cost cap, Voice enabled
- **Enterprise**: Unlimited, €19.995 AI cost cap

**Important**: We automatically enforce a 50% AI cost cap so you never exceed your budget. When approaching the limit, you'll see upgrade prompts.

---

## Quick Start Checklist

- [ ] Choose activation features (Widget/WhatsApp/Voice)
- [ ] Add at least 1 URL or upload 1 file for training
- [ ] Wait for training to complete
- [ ] Get widget code from Installation page
- [ ] Install widget on your website
- [ ] Test by asking a question
- [ ] Review first conversation in Dashboard
- [ ] Set up billing (if using paid plan)

**Time to complete**: 10-15 minutes

**Need help?** We're here! support@unik.ai

---

## Pro Tips

1. **Start small**: Train with 2-3 key pages first, then expand
2. **Test thoroughly**: Ask various questions to ensure quality
3. **Monitor daily**: Check usage to avoid surprises
4. **Update knowledge**: Retrain when your content changes
5. **Use analytics**: Track which questions are most common

Happy building! 🚀
