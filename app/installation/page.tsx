const code = `<script src="https://agent.unik.ai/v1/widget.js" data-agent-id="AGENT-XXXX" defer></script>`;

export default function Page() {
  return (
    <main className="container mx-auto py-16 text-white">
      <h1 className="text-3xl font-bold mb-6">1-Minute Installation</h1>
      <p className="mb-4">Paste this before &lt;/body&gt; on your site.</p>
      <pre className="bg-black/40 p-4 rounded-md overflow-x-auto">
        <code>{code}</code>
      </pre>
    </main>
  );
}
