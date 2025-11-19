# **App Name**: Unik AI Agent Platform

## Core Features:

- Chatbot Web Widget: Integrate a customizable chatbot widget on websites for instant customer support.
- Voice Agent with n8n Orchestration: Implement a voice agent to handle voice calls, transcribe them, determine intent, and use TTS for responses. It can use n8n flows for calendar booking and complex workflows.
- Multi-Tenant User Authentication: Firebase Auth manages user accounts, roles, and permissions in a multi-tenant environment.
- Subscription Management with Stripe: Process and manage recurring subscriptions using Stripe, supporting monthly/yearly plans in EUR. Webhooks are used to update user plans and track billing.
- AI-Powered Chat Completions with Cost Management: Leverage OpenAI chat completions to provide intelligent responses in the chatbot and voice agent, while strictly monitoring and capping OpenAI costs at 50% of plan revenue. The system incorporates a tool that prevents costs from exceeding set limits.
- Knowledge Base Training: Allow users to train the AI agent by providing URLs to crawl or uploading files, which are then chunked, embedded, and stored for context in conversations.
- Comprehensive Analytics and Observability: Track key metrics, usage patterns, and conversion rates through widget events and aggregated dashboards for optimizing agent performance.

## Style Guidelines:

- Primary color: Deep purple (#624CAB) evoking professionalism and sophistication.
- Background color: Very light purple (#F0ECF5) provides a clean and modern backdrop.
- Accent color: Blue (#4C8AB9) complements the primary, enhancing readability and emphasizing key interactive elements.
- Headline font: 'Space Grotesk' sans-serif font is used for the title and headings throughout the interface for a techy, modern aesthetic. Body font: 'Inter' sans-serif, which is a good fit with 'Space Grotesk'.
- Code font: 'Source Code Pro' monospace font is used when code snippets are displayed in the app
- Use consistent, minimalist icons for navigation and features to ensure clarity and ease of use.
- Maintain a clean and intuitive layout with clear hierarchy, prioritizing key information and user actions.
