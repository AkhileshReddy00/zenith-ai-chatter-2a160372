import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, Shield, Zap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-radial">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Professional AI Chat Assistant
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the next generation of AI conversation with secure authentication, 
            persistent chat history, and a beautiful interface.
          </p>
          
          <div className="pt-8">
            <Button 
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-gradient-primary hover:opacity-90 transition-opacity text-lg px-8 py-6"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 pt-16">
            <div className="bg-card p-6 rounded-xl shadow-lg">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Secure Authentication</h3>
              <p className="text-muted-foreground">
                Sign in with Google or email for a personalized experience
              </p>
            </div>
            <div className="bg-card p-6 rounded-xl shadow-lg">
              <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Persistent Chats</h3>
              <p className="text-muted-foreground">
                All your conversations are saved and organized
              </p>
            </div>
            <div className="bg-card p-6 rounded-xl shadow-lg">
              <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Fast & Responsive</h3>
              <p className="text-muted-foreground">
                Beautiful interface that works on all devices
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
