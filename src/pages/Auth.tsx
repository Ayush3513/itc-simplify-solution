import React from "react";
import { useNavigate } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { IndianRupee, FileCheck, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  React.useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        toast({
          title: "Welcome!",
          description: "Successfully signed in to ITC Manager",
        });
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-primary-600 rounded-2xl flex items-center justify-center">
            <IndianRupee className="w-12 h-12 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          ITC Manager
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Simplify your GST Input Tax Credit Management
        </p>
        
        <div className="flex justify-center space-x-6 mt-8">
          <div className="text-center">
            <FileCheck className="mx-auto h-8 w-8 text-primary-600" />
            <p className="mt-2 text-sm text-gray-500">Easy Compliance</p>
          </div>
          <div className="text-center">
            <IndianRupee className="mx-auto h-8 w-8 text-primary-600" />
            <p className="mt-2 text-sm text-gray-500">Credit Tracking</p>
          </div>
          <div className="text-center">
            <BarChart3 className="mx-auto h-8 w-8 text-primary-600" />
            <p className="mt-2 text-sm text-gray-500">Smart Analytics</p>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <SupabaseAuth 
            supabaseClient={supabase} 
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#1E40AF',
                    brandAccent: '#1D4ED8',
                  },
                },
              },
            }}
            providers={[]}
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;