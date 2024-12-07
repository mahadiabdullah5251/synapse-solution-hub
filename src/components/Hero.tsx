import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="pt-32 pb-20 bg-gradient-to-b from-white to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Automate, Analyze, and Accelerate Your World
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            AI Synapse is your universal AI-driven Integrated Decision-Making Hub, empowering businesses
            and individuals to solve complex problems across all domains.
          </p>
          <div className="flex justify-center gap-4">
            <Button className="bg-primary hover:bg-primary/90 text-lg px-8 py-6">
              Get Started Free
            </Button>
            <Button variant="outline" className="text-lg px-8 py-6">
              Watch Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;