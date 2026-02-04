import { PatternBg, Title } from "@/components";

const Legal = () => {
  return (
    <div className="min-h-screen bg-bg-primary">
      <PatternBg />
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <Title className="mb-8">Legal Information</Title>
        
        <div className="bg-bg-secondary/80 backdrop-blur-sm rounded-xl p-8 space-y-8">
          {/* Terms of Service */}
          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Terms of Service</h2>
            <div className="text-text-secondary space-y-4">
              <p>
                By using GrooveIT's services, you agree to these terms and conditions. 
                These terms apply to all users of our platform, including customers and merchants.
              </p>
              
              <h3 className="text-lg font-semibold text-text-primary mt-6 mb-2">1. Service Description</h3>
              <p>
                GrooveIT provides a platform connecting customers with local merchants for 
                delivery services. We facilitate transactions but are not directly responsible 
                for the products or services provided by merchants.
              </p>
              
              <h3 className="text-lg font-semibold text-text-primary mt-6 mb-2">2. User Responsibilities</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Provide accurate information when creating an account</li>
                <li>Use the platform in accordance with applicable laws</li>
                <li>Respect other users and merchants on the platform</li>
                <li>Pay for orders in a timely manner</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-text-primary mt-6 mb-2">3. Merchant Obligations</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Provide accurate product descriptions and pricing</li>
                <li>Fulfill orders in a timely manner</li>
                <li>Maintain food safety and quality standards</li>
                <li>Handle customer service inquiries professionally</li>
              </ul>
            </div>
          </section>
          
          {/* Liability */}
          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Limitation of Liability</h2>
            <div className="text-text-secondary space-y-4">
              <p>
                GrooveIT serves as an intermediary platform. While we strive to ensure 
                quality service, we are not liable for:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Product quality or accuracy of merchant listings</li>
                <li>Delivery delays due to circumstances beyond our control</li>
                <li>Disputes between customers and merchants</li>
                <li>Technical issues that may temporarily affect service</li>
              </ul>
            </div>
          </section>
          
          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Intellectual Property</h2>
            <div className="text-text-secondary space-y-4">
              <p>
                All content on the GrooveIT platform, including logos, designs, and software, 
                is protected by intellectual property laws. Users may not reproduce, modify, 
                or distribute our content without explicit permission.
              </p>
            </div>
          </section>
          
          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Account Termination</h2>
            <div className="text-text-secondary space-y-4">
              <p>
                We reserve the right to suspend or terminate accounts that violate these 
                terms or engage in fraudulent activity. Users may also terminate their 
                accounts at any time by contacting customer support.
              </p>
            </div>
          </section>
          
          <div className="border-t border-border-primary pt-6 mt-8">
            <p className="text-text-secondary text-sm">
              Last updated: February 2026<br />
              For questions about these terms, please contact us at legal@grooveit.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Legal;