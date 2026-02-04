import { useState } from "react";
import { PatternBg, Title, Button, FormInput, FormTextarea } from "@/components";
import { useNotification } from "@/hooks";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notify] = useNotification();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // TODO: Implement actual contact form submission
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      notify({
        title: "Message Sent",
        variant: "success",
        description: "Thank you for contacting us! We'll get back to you soon."
      });
      
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      notify({
        title: "Error",
        variant: "error",
        description: "Failed to send message. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <PatternBg />
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <Title className="mb-8">Contact Us</Title>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-bg-secondary/80 backdrop-blur-sm rounded-xl p-8">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Get in Touch</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-text-primary mb-2 flex items-center">
                  <span className="mr-2">📍</span> Address
                </h3>
                <p className="text-text-secondary ml-6">
                  123 Delivery Street<br />
                  Business District<br />
                  City, State 12345
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-text-primary mb-2 flex items-center">
                  <span className="mr-2">📞</span> Phone
                </h3>
                <p className="text-text-secondary ml-6">
                  <a href="tel:+1234567890" className="hover:text-accent-primary transition-colors">
                    +1 (234) 567-8900
                  </a>
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-text-primary mb-2 flex items-center">
                  <span className="mr-2">📧</span> Email
                </h3>
                <p className="text-text-secondary ml-6">
                  <a href="mailto:support@grooveit.com" className="hover:text-accent-primary transition-colors">
                    support@grooveit.com
                  </a>
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-text-primary mb-2 flex items-center">
                  <span className="mr-2">🕒</span> Business Hours
                </h3>
                <div className="text-text-secondary ml-6 space-y-1">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="bg-bg-secondary/80 backdrop-blur-sm rounded-xl p-8">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormInput
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              
              <FormInput
                name="email"
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              
              <FormInput
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
              />
              
              <FormTextarea
                name="message"
                placeholder="Your Message"
                rows={5}
                value={formData.message}
                onChange={handleInputChange}
                required
              />
              
              <Button
                type="submit"
                isLoading={isSubmitting}
                className="w-full"
              >
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;