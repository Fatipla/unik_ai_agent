export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose prose-lg dark:prose-invert">
        <p className="text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString()}</p>

        <h2>1. Information We Collect</h2>
        <p>
          We collect information you provide directly to us when you create an account, use our services,
          or communicate with us. This includes your email, name, and usage data.
        </p>

        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>Provide and improve our AI agent services</li>
          <li>Process transactions and manage subscriptions</li>
          <li>Send service-related communications</li>
          <li>Analyze usage patterns and optimize performance</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2>3. Data Sharing</h2>
        <p>
          We do not sell your personal information. We share data only with:
        </p>
        <ul>
          <li>Service providers (Stripe for payments, OpenAI for AI processing)</li>
          <li>Law enforcement when required by law</li>
        </ul>

        <h2>4. Data Retention</h2>
        <p>
          We retain your data for as long as your account is active. After account deletion:
        </p>
        <ul>
          <li>Free tier: Data deleted after 30 days</li>
          <li>Paid tiers: Data deleted after 90 days</li>
        </ul>

        <h2>5. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Correct inaccurate data</li>
          <li>Request data deletion</li>
          <li>Export your data</li>
          <li>Opt-out of marketing communications</li>
        </ul>

        <h2>6. Security</h2>
        <p>
          We implement industry-standard security measures including encryption, access controls,
          and regular security audits to protect your data.
        </p>

        <h2>7. Cookies</h2>
        <p>
          We use essential cookies for authentication and functional cookies for analytics.
          You can control cookie preferences through your browser settings.
        </p>

        <h2>8. GDPR Compliance</h2>
        <p>
          For EU users, we comply with GDPR requirements including data portability,
          right to erasure, and transparent data processing.
        </p>

        <h2>9. Contact</h2>
        <p>
          For privacy questions or to exercise your rights, email: privacy@unik.ai
        </p>
      </div>
    </div>
  );
}
