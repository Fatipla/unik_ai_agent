export default function RefundsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Refund & Cancellation Policy</h1>
      
      <div className="prose prose-lg dark:prose-invert">
        <p className="text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString()}</p>

        <h2>7-Day Free Trial</h2>
        <p>
          Our Starter plan includes a 7-day free trial. You can cancel anytime during the trial
          period without being charged. No credit card is required for the Free plan.
        </p>

        <h2>Monthly Subscriptions</h2>
        <p>
          Monthly subscriptions renew automatically on the same day each month. You can cancel
          your subscription at any time through the billing portal. Cancellation takes effect
          at the end of your current billing period.
        </p>
        <ul>
          <li>Cancel anytime - no questions asked</li>
          <li>Access continues until the end of your paid period</li>
          <li>No partial refunds for unused time in monthly plans</li>
          <li>Data retention for 30 days after cancellation</li>
        </ul>

        <h2>Yearly Subscriptions</h2>
        <p>
          Yearly subscriptions offer a 30% discount compared to monthly billing. If you cancel
          a yearly subscription:
        </p>
        <ul>
          <li>Within 7 days of purchase: Full refund available</li>
          <li>After 7 days: Pro-rated refund for unused months (minus processing fees)</li>
          <li>Access continues until the end of your paid period</li>
        </ul>

        <h2>Refund Eligibility</h2>
        <p>
          You may be eligible for a refund in the following cases:
        </p>
        <ul>
          <li>Service was unavailable for more than 24 hours</li>
          <li>Duplicate charges or billing errors</li>
          <li>Cancellation within 7 days of initial purchase</li>
          <li>Major feature not working as advertised</li>
        </ul>

        <h2>Non-Refundable Items</h2>
        <p>The following are non-refundable:</p>
        <ul>
          <li>Usage-based charges (AI processing costs)</li>
          <li>Overage charges beyond plan limits</li>
          <li>Add-on features or one-time purchases</li>
          <li>Charges more than 30 days old</li>
        </ul>

        <h2>How to Request a Refund</h2>
        <p>
          To request a refund, please contact us at{' '}
          <a href="mailto:support@unik-ks.com">support@unik-ks.com</a> with:
        </p>
        <ul>
          <li>Your account email address</li>
          <li>Transaction ID or invoice number</li>
          <li>Reason for refund request</li>
        </ul>
        <p>
          Refund requests are typically processed within 5-7 business days. Refunds are issued
          to the original payment method.
        </p>

        <h2>Cancellation Process</h2>
        <p>
          You can cancel your subscription at any time without contacting support:
        </p>
        <ol>
          <li>Log in to your dashboard</li>
          <li>Go to Settings → Billing</li>
          <li>Click "Manage Billing" to access the Paddle billing portal</li>
          <li>Click "Cancel Subscription"</li>
          <li>Confirm cancellation</li>
        </ol>
        <p>
          After cancellation, your account will be downgraded to the Free plan at the end
          of your current billing period.
        </p>

        <h2>Fair Use Policy</h2>
        <p>
          We reserve the right to refuse refunds for accounts that have violated our Terms
          of Service or engaged in fraudulent activity.
        </p>

        <h2>AI Cost Cap Guarantee</h2>
        <p>
          All paid plans include our 50% AI cost cap guarantee. If AI processing costs
          exceed this cap, we absorb the additional costs - you will never be charged
          beyond your subscription fee for AI usage.
        </p>

        <h2>Questions?</h2>
        <p>
          If you have questions about our refund policy, please contact us at{' '}
          <a href="mailto:support@unik-ks.com">support@unik-ks.com</a>
        </p>
      </div>
    </div>
  );
}
