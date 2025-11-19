# @unik/agent-widget

Embeddable AI chat widget for Unik AI Agent platform.

## Installation

```bash
npm install @unik/agent-widget
```

## Usage

### Basic Usage

```javascript
import { initAgent } from '@unik/agent-widget';

initAgent({
  agentId: 'your-agent-id',
  lang: 'en',
  theme: 'light',
  tone: 'professional'
});
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `agentId` | string | required | Your unique agent ID |
| `apiUrl` | string | 'https://agent.unik.ai' | API endpoint |
| `lang` | string | 'en' | Language (en/de/al) |
| `theme` | 'light' \| 'dark' | 'light' | Widget theme |
| `tone` | string | 'professional' | Response tone |
| `brandColor` | string | '#624CAB' | Primary color |
| `position` | 'bottom-right' \| 'bottom-left' | 'bottom-right' | Widget position |
| `greeting` | string | '👋 Hello! How can I help you today?' | Initial message |
| `proactiveDelay` | number | 0 | Auto-open delay (seconds) |

### React Example

```jsx
import { useEffect } from 'react';
import { initAgent } from '@unik/agent-widget';

function App() {
  useEffect(() => {
    initAgent({
      agentId: process.env.REACT_APP_AGENT_ID,
      theme: 'dark',
      brandColor: '#ff6b6b'
    });
  }, []);

  return <div>Your app...</div>;
}
```

### Vue Example

```vue
<script setup>
import { onMounted } from 'vue';
import { initAgent } from '@unik/agent-widget';

onMounted(() => {
  initAgent({
    agentId: import.meta.env.VITE_AGENT_ID
  });
});
</script>
```

## TypeScript Support

Full TypeScript definitions included:

```typescript
import { initAgent, AgentConfig } from '@unik/agent-widget';

const config: AgentConfig = {
  agentId: 'abc123',
  theme: 'light',
  // ... other options
};

initAgent(config);
```

## SSR Compatibility

The widget checks for `window` availability and gracefully handles server-side rendering.

## License

MIT
