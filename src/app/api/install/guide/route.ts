import { NextRequest, NextResponse } from 'next/server';
import { getUserFromHeaders } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const user = getUserFromHeaders(request.headers);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const agentId = user.userId;

  const guides = {
    script: {
      title: '1-Line HTML Script',
      description: 'Simplest way to get started. Paste before closing </body> tag.',
      code: `<script src="https://agent.unik.ai/widget.js" data-agent-id="${agentId}" defer></script>`,
      steps: [
        'Open your website HTML file',
        'Find the closing </body> tag',
        'Paste the script above it',
        'Save and refresh your site',
      ],
    },
    npm: {
      title: 'NPM Package',
      description: 'For React, Vue, or other JavaScript frameworks.',
      code: `// Install\nnpm install @unik/agent-widget\n\n// Usage\nimport { initAgent } from '@unik/agent-widget';\n\ninitAgent({\n  agentId: '${agentId}',\n  lang: 'en',\n  theme: 'light',\n  tone: 'professional'\n});`,
      steps: [
        'Run: npm install @unik/agent-widget',
        'Import and initialize in your app',
        'Configure options as needed',
        'Build and deploy',
      ],
    },
    gtm: {
      title: 'Google Tag Manager',
      description: 'Deploy via GTM without code changes.',
      steps: [
        'Log into Google Tag Manager',
        'Create new Custom HTML tag',
        `Paste: <script src="https://agent.unik.ai/widget.js" data-agent-id="${agentId}"></script>`,
        'Set trigger to "All Pages"',
        'Publish container',
      ],
    },
    shopify: {
      title: 'Shopify',
      description: 'Install as theme extension.',
      steps: [
        'Go to Shopify Admin > Online Store > Themes',
        'Click "Actions" > "Edit code"',
        'Open theme.liquid',
        `Paste script before </body>: <script src="https://agent.unik.ai/widget.js" data-agent-id="${agentId}"></script>`,
        'Save and preview',
      ],
    },
    wordpress: {
      title: 'WordPress',
      description: 'Add via theme functions or plugin.',
      steps: [
        'Install "Insert Headers and Footers" plugin',
        'Go to Settings > Insert Headers and Footers',
        `Paste in Footer: <script src="https://agent.unik.ai/widget.js" data-agent-id="${agentId}"></script>`,
        'Save changes',
      ],
    },
    webflow: {
      title: 'Webflow',
      description: 'Embed in project settings.',
      steps: [
        'Open your Webflow project',
        'Go to Project Settings > Custom Code',
        `Paste in Footer Code: <script src="https://agent.unik.ai/widget.js" data-agent-id="${agentId}"></script>`,
        'Publish site',
      ],
    },
  };

  return NextResponse.json({ agentId, guides });
}
