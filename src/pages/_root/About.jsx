import { PatternBg, Title } from "@/components";

const About = () => {
  return (
    <div className="min-h-screen bg-bg-primary">
      <PatternBg />
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <Title className="mb-8">About GrooveIT</Title>
        
        <div className="bg-bg-secondary/80 backdrop-blur-sm rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Our Story</h2>
          <p className="text-text-secondary mb-6 leading-relaxed">
            GrooveIT is more than just a delivery platform - we're your local marketplace 
            connecting you with the best merchants in your area. Founded with a mission to 
            support local businesses and provide convenient shopping experiences, we bring 
            your favorite stores right to your doorstep.
          </p>
          
          <h2 className="text-2xl font-bold text-text-primary mb-4">What We Do</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-bg-primary/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-2">🛍️ Local Shopping</h3>
              <p className="text-text-secondary text-sm">
                Browse and shop from local merchants, restaurants, and stores in your neighborhood.
              </p>
            </div>
            <div className="bg-bg-primary/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-2">🚚 Fast Delivery</h3>
              <p className="text-text-secondary text-sm">
                Quick and reliable delivery service to get your orders to you when you need them.
              </p>
            </div>
            <div className="bg-bg-primary/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-2">🏪 Support Local</h3>
              <p className="text-text-secondary text-sm">
                Help local businesses thrive by connecting them with customers in the community.
              </p>
            </div>
            <div className="bg-bg-primary/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-2">📱 Easy Experience</h3>
              <p className="text-text-secondary text-sm">
                Simple, intuitive platform that makes ordering and managing deliveries effortless.
              </p>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-text-primary mb-4">Our Values</h2>
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-text-primary">Community First</h4>
              <p className="text-text-secondary text-sm">We believe in strengthening local communities by supporting neighborhood businesses.</p>
            </div>
            <div>
              <h4 className="font-semibold text-text-primary">Quality Service</h4>
              <p className="text-text-secondary text-sm">We're committed to providing reliable, high-quality delivery services you can count on.</p>
            </div>
            <div>
              <h4 className="font-semibold text-text-primary">Innovation</h4>
              <p className="text-text-secondary text-sm">We continuously improve our platform to enhance the experience for both customers and merchants.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;