import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    price: "49",
    features: ["Basic AI analysis", "5 automated workflows", "Community support", "Basic reporting"],
  },
  {
    name: "Professional",
    price: "149",
    features: [
      "Advanced AI analysis",
      "Unlimited workflows",
      "Priority support",
      "Advanced analytics",
      "API access",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: [
      "Custom AI models",
      "Dedicated support",
      "SLA guarantee",
      "Custom integrations",
      "Advanced security",
    ],
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="border rounded-lg p-8 bg-white hover:shadow-lg transition-shadow"
            >
              <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">${plan.price}</span>
                {plan.price !== "Custom" && <span className="text-gray-600">/month</span>}
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="w-5 h-5 text-accent mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-primary hover:bg-primary/90">Get Started</Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;