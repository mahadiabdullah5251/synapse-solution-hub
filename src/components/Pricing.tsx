import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/use-subscription";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "49",
    features: [
      "5 automated workflows",
      "1,000 API calls/month",
      "10GB storage",
      "Community support",
      "Basic reporting"
    ],
  },
  {
    id: "professional",
    name: "Professional",
    price: "149",
    features: [
      "50 automated workflows",
      "10,000 API calls/month",
      "100GB storage",
      "Priority support",
      "Advanced analytics",
      "API access",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    features: [
      "500 automated workflows",
      "100,000 API calls/month",
      "1TB storage",
      "Dedicated support",
      "Custom integrations",
      "Advanced security",
    ],
  },
];

const Pricing = () => {
  const navigate = useNavigate();
  const { subscription, createSubscription, isLoading } = useSubscription();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();
  }, []);

  const handleSubscribe = async (planId: string) => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    await createSubscription.mutateAsync(planId);
  };

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const isCurrentPlan = subscription?.plan_id === plan.id;
            
            return (
              <div
                key={plan.id}
                className={`border rounded-lg p-8 bg-white hover:shadow-lg transition-shadow ${
                  isCurrentPlan ? "border-primary" : ""
                }`}
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
                <Button
                  className="w-full"
                  variant={isCurrentPlan ? "secondary" : "default"}
                  disabled={isLoading || isCurrentPlan}
                  onClick={() => handleSubscribe(plan.id)}
                >
                  {isLoading
                    ? "Processing..."
                    : isCurrentPlan
                    ? "Current Plan"
                    : "Get Started"}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Pricing;