export interface AgentConfig {
  agentId: string;
  apiUrl?: string;
  lang?: string;
  theme?: 'light' | 'dark';
  tone?: string;
  brandColor?: string;
  position?: 'bottom-right' | 'bottom-left';
  greeting?: string;
  proactiveDelay?: number;
}

export function initAgent(config: AgentConfig): void {
  if (typeof window === 'undefined') {
    console.warn('Unik Agent Widget: window not available (SSR)');
    return;
  }

  // Load widget script dynamically
  const script = document.createElement('script');
  script.src = config.apiUrl || 'https://agent.unik.ai/widget.js';
  script.setAttribute('data-agent-id', config.agentId);
  script.setAttribute('data-lang', config.lang || 'en');
  script.setAttribute('data-theme', config.theme || 'light');
  script.setAttribute('data-tone', config.tone || 'professional');
  script.setAttribute('data-brand-color', config.brandColor || '#624CAB');
  script.setAttribute('data-position', config.position || 'bottom-right');
  script.setAttribute('data-greeting', config.greeting || '👋 Hello! How can I help you today?');
  script.setAttribute('data-proactive-delay', String(config.proactiveDelay || 0));
  script.defer = true;

  document.body.appendChild(script);
}

export default { initAgent };
