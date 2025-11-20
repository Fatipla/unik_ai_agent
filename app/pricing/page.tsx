const plans = [
  {
    id: 'standard',
    title: 'Standard',
    price: '€19.99',
    perks: ['500 conversations/mo', 'Widget & API', 'Knowledge Base', 'Basic Analytics', '7-Day Trial'],
  },
  {
    id: 'pro',
    title: 'Pro',
    price: '€29.99',
    perks: ['1500 conversations/mo', 'Voice (TTS/Whisper)', 'n8n Integration', 'Advanced Analytics'],
  },
  {
    id: 'enterprise',
    title: 'Enterprise',
    price: '€39.99',
    perks: ['Unlimited conversations', 'Dedicated Support', 'Custom Integrations', 'Full Audit Logs'],
  },
];

export default function Page() {
  return (
    <main className="container mx-auto py-16 text-white">
      <h1 className="text-3xl font-bold mb-8">Simple, predictable pricing</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div key={p.id} className="rounded-xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold mb-2">{p.title}</h2>
            <div className="text-2xl mb-4">
              {p.price}<span className="text-sm">/month</span>
            </div>
            <ul className="space-y-1 mb-6">
              {p.perks.map((x) => (
                <li key={x}>✓ {x}</li>
              ))}
            </ul>
            <a
              className="inline-block rounded-md bg-white/10 px-4 py-2"
              href={p.id === 'enterprise' ? '/contact' : '/signup'}
            >
              {p.id === 'enterprise'
                ? 'Contact Sales'
                : p.id === 'standard'
                ? 'Start 7-Day Trial'
                : 'Choose Pro'}
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}
