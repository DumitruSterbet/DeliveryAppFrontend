import { PatternBg, Title } from "@/components";

const Policy = () => {
  return (
    <div className="min-h-screen bg-bg-primary">
      <PatternBg />
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <Title className="mb-8">Privacy Policy</Title>
        
        <div className="bg-bg-secondary/80 backdrop-blur-sm rounded-xl p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Introduction</h2>
            <div className="text-text-secondary space-y-4">
              <p>
                At GrooveIT, we value your privacy and are committed to protecting your 
                personal information. This privacy policy explains how we collect, use, 
                and safeguard your data when you use our delivery platform.
              </p>
            </div>
          </section>
          
          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Information We Collect</h2>
            <div className="text-text-secondary space-y-4">
              <h3 className="text-lg font-semibold text-text-primary mt-6 mb-2">Personal Information</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Name, email address, and phone number</li>
                <li>Delivery address and billing information</li>
                <li>Account preferences and settings</li>
                <li>Order history and payment information</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-text-primary mt-6 mb-2">Technical Information</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Device information and operating system</li>
                <li>IP address and browser type</li>
                <li>Usage data and interaction with our platform</li>
                <li>Location data (with your permission)</li>
              </ul>
            </div>
          </section>
          
          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">How We Use Your Information</h2>
            <div className="text-text-secondary space-y-4">
              <p>We use your information to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Process and fulfill your orders</li>
                <li>Provide customer support and communicate with you</li>
                <li>Improve our services and user experience</li>
                <li>Send promotional offers and updates (with your consent)</li>
                <li>Ensure platform security and prevent fraud</li>
                <li>Comply with legal requirements</li>
              </ul>
            </div>
          </section>
          
          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Information Sharing</h2>
            <div className="text-text-secondary space-y-4">
              <p>We may share your information with:</p>
              
              <h3 className="text-lg font-semibold text-text-primary mt-6 mb-2">Service Partners</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Merchants to fulfill your orders</li>
                <li>Delivery partners to complete deliveries</li>
                <li>Payment processors for transaction processing</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-text-primary mt-6 mb-2">Legal Requirements</h3>
              <p>
                We may disclose information when required by law or to protect our rights, 
                your safety, or the safety of others.
              </p>
            </div>
          </section>
          
          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Data Security</h2>
            <div className="text-text-secondary space-y-4">
              <p>
                We implement industry-standard security measures to protect your data, including:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Encryption of sensitive data in transit and at rest</li>
                <li>Regular security audits and monitoring</li>
                <li>Access controls and authentication measures</li>
                <li>Secure payment processing systems</li>
              </ul>
            </div>
          </section>
          
          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Your Rights</h2>
            <div className="text-text-secondary space-y-4">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Access and review your personal information</li>
                <li>Update or correct your information</li>
                <li>Delete your account and associated data</li>
                <li>Opt-out of marketing communications</li>
                <li>Request a copy of your data</li>
              </ul>
              <p>
                To exercise these rights, please contact us at privacy@grooveit.com
              </p>
            </div>
          </section>
          
          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Cookies and Tracking</h2>
            <div className="text-text-secondary space-y-4">
              <p>
                We use cookies and similar technologies to enhance your experience, 
                analyze usage patterns, and provide personalized content. You can 
                manage cookie preferences through your browser settings.
              </p>
            </div>
          </section>
          
          {/* Changes to Policy */}
          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Policy Updates</h2>
            <div className="text-text-secondary space-y-4">
              <p>
                We may update this privacy policy periodically. We will notify you of 
                significant changes through email or platform notifications. Continued 
                use of our services constitutes acceptance of the updated policy.
              </p>
            </div>
          </section>
          
          <div className="border-t border-border-primary pt-6 mt-8">
            <p className="text-text-secondary text-sm">
              Last updated: February 2026<br />
              For privacy-related questions, contact us at privacy@grooveit.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Policy;