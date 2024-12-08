import { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Features from "@/components/Features";
import UseCases from "@/components/UseCases";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "sonner";

export default function Index() {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        toast.success("Successfully logged in!");
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) {
        // Ensure we're on the root path after successful login
        if (window.location.hash.includes('access_token')) {
          navigate('/');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Welcome to AI Synapse
            </h2>
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#4C1D95',
                      brandAccent: '#8B5CF6',
                    },
                  },
                },
              }}
              providers={["google"]}
              view="sign_in"
              showLinks={true}
              socialLayout="vertical"
              redirectTo={window.location.origin}
            />
          </div>
        </div>
        <Features />
        <UseCases />
        <Pricing />
        <Footer />
      </div>
    );
  }

  return <DashboardLayout />;
}