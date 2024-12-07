import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AI Synapse
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-primary transition-colors">
              Features
            </a>
            <a href="#use-cases" className="text-gray-600 hover:text-primary transition-colors">
              Use Cases
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-primary transition-colors">
              Pricing
            </a>
            <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;