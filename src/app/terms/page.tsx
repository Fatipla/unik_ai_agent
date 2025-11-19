export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      
      <div className="prose prose-lg dark:prose-invert">
        <p className="text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString()}</p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using Unik AI Agent, you agree to be bound by these Terms of Service.
          If you disagree with any part of these terms, you may not use our services.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          Unik AI Agent provides AI-powered chatbot and voice agent services. We reserve the right
          to modify, suspend, or discontinue any aspect of the service with notice.
        </p>

        <h2>3. Account Registration</h2>
        <ul>
          <li>You must provide accurate and complete information</li>
          <li>You are responsible for maintaining account security</li>
          <li>One account per user; no account sharing</li>
          <li>Accounts are non-transferable</li>
        </ul>

        <h2>4. Subscription Plans</h2>
        <ul>
          <li>Free: 5 conversations per day, limited features</li>
          <li>Standard: €19.99/month, 500 conversations/month</li>
          <li>Pro: €29.99/month, 1,500 conversations/month, voice enabled</li>
          <li>Enterprise: €39.99/month, unlimited conversations</li>
        </ul>
        <p>
          Yearly plans offer 30% discount. All plans include 50% AI cost cap guarantee.
        </p>

        <h2>5. Billing and Payments</h2>
        <ul>
          <li>Payments processed via Stripe</li>
          <li>Subscriptions auto-renew unless cancelled</li>
          <li>Refunds available within 7 days of purchase</li>
          <li>AI costs are capped at 50% of plan revenue</li>
        </ul>

        <h2>6. Usage Limits and Fair Use</h2>
        <p>
          Usage limits are enforced per plan tier. Excessive usage that impacts service
          performance may result in throttling or suspension.
        </p>

        <h2>7. Prohibited Uses</h2>
        <p>You may not use our service to:</p>
        <ul>
          <li>Violate laws or regulations</li>
          <li>Infringe intellectual property rights</li>
          <li>Transmit malicious code or spam</li>
          <li>Attempt to bypass security measures</li>
          <li>Reverse engineer the service</li>
          <li>Generate harmful or illegal content</li>
        </ul>

        <h2>8. Content and Data</h2>
        <ul>
          <li>You retain ownership of your content</li>
          <li>You grant us license to process your data to provide services</li>
          <li>We use OpenAI for AI processing (subject to their terms)</li>
        </ul>

        <h2>9. Intellectual Property</h2>
        <p>
          All service components, including software, design, and content, are owned by
          Unik AI and protected by copyright and trademark laws.
        </p>

        <h2>10. Warranties and Disclaimers</h2>
        <p>
          Service provided "as is" without warranties. We do not guarantee uptime,
          accuracy of AI responses, or fitness for specific purposes.
        </p>

        <h2>11. Limitation of Liability</h2>
        <p>
          Our liability is limited to the amount paid in the past 12 months.
          We are not liable for indirect, incidental, or consequential damages.
        </p>

        <h2>12. Termination</h2>
        <p>
          We may suspend or terminate accounts for violations of these terms.
          You may cancel your subscription at any time through the billing portal.
        </p>

        <h2>13. Changes to Terms</h2>
        <p>
          We may update these terms with 30 days notice. Continued use after changes
          constitutes acceptance of new terms.
        </p>

        <h2>14. Governing Law</h2>
        <p>
          These terms are governed by the laws of the European Union. Disputes will be
          resolved through binding arbitration.
        </p>

        <h2>15. Contact</h2>
        <p>
          For questions about these terms, contact: legal@unik.ai
        </p>
      </div>
    </div>
  );
}
