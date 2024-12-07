import { Brain, Zap, Lock, Globe } from "lucide-react";

const features = [
  {
    icon: <Brain className="w-8 h-8" />,
    title: "AI Decision Engine",
    description:
      "Process complex data using proprietary algorithms to suggest optimal solutions for your business needs.",
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Customizable Workflows",
    description:
      "Automate decisions, set triggers, and deploy solutions instantly with no-code integrations.",
  },
  {
    icon: <Lock className="w-8 h-8" />,
    title: "Enterprise Security",
    description:
      "Bank-grade encryption and security measures to protect your sensitive data and decisions.",
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Global AI Collaboration",
    description:
      "Share anonymized insights across geographies while respecting privacy laws and regulations.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Powerful Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-lg border bg-white hover:shadow-lg transition-shadow animate-float"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="text-accent mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;