import { NextRequest, NextResponse } from 'next/server';
import { getUserFromHeaders } from '@/lib/auth';
import { env } from '@/lib/env';

export async function GET(request: NextRequest) {
  const user = getUserFromHeaders(request.headers);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const agentId = user.userId;
  const widgetOrigin = env.WIDGET_ORIGIN || 'https://agent.unik.ai';

  const code = `<!-- Unik AI Widget -->
<script
  src="${widgetOrigin}/widget.js"
  data-agent-id="${agentId}"
  data-lang="en"
  data-theme="light"
  data-tone="professional"
  data-brand-color="#624CAB"
  data-position="bottom-right"
  data-greeting="👋 Hello! How can I help you today?"
  data-proactive-delay="0"
  data-collect-email="true"
  data-show-upsell="true"
  defer
></script>`;

  return NextResponse.json({
    agentId,
    code,
    widgetUrl: `${widgetOrigin}/widget.js`,
  });
}
