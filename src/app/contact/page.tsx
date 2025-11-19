export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
      
      <div className="prose prose-lg dark:prose-invert">
        <p className="text-xl text-muted-foreground mb-8">
          We're here to help! Reach out to us through any of the following channels.
        </p>

        <div className="space-y-8 not-prose">
          <div className="border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Support</h2>
            <p className="text-muted-foreground mb-2">
              For technical support, billing questions, or general inquiries:
            </p>
            <a 
              href="mailto:support@unik-ks.com" 
              className="text-primary hover:underline text-lg font-medium"
            >
              support@unik-ks.com
            </a>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Business Address</h2>
            <div className="text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">Unik Trading LLC</p>
              <p>28 Nëntori, nr 76/1</p>
              <p>Prishtina, Kosovo</p>
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Website</h2>
            <a 
              href="https://agent.unik-ks.com" 
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://agent.unik-ks.com
            </a>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Response Time</h2>
            <p className="text-muted-foreground">
              We typically respond to all inquiries within 24-48 hours during business days.
              For urgent matters, please mark your email as "Urgent" in the subject line.
            </p>
          </div>

          <div className="border rounded-lg p-6 bg-muted/50">
            <h2 className="text-2xl font-semibold mb-4">Before You Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              Please check our documentation and FAQ section first. Many common questions
              are already answered there:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• <a href="/pricing" className="text-primary hover:underline">Pricing & Plans</a></li>
              <li>• <a href="/terms" className="text-primary hover:underline">Terms of Service</a></li>
              <li>• <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a></li>
              <li>• <a href="/refunds" className="text-primary hover:underline">Refund Policy</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
