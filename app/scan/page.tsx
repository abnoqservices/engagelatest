"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image"
import CameraScanner from "@/components/CameraScanner";
import AdminDashboard from "@/components/AdminDashboard";
import { ScanLine, Database, LogOut, Loader2, Sparkles, Zap, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import whiteLogo from "@/public/white_logo.png"
// Assuming these come from your auth context/provider
// import { useAuth } from "@/context/AuthContext";  ← uncomment/adjust as needed
// or from firebase/next-auth/etc

const Index = () => {
  const router = useRouter();

  // Example - adjust according to your actual auth implementation
  // const { user, loading, signOut } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState("scan");

  // You need to implement these variables/values according to your auth system
  const loading = false;     // ← replace with real loading state
  const user = true;         // ← replace with real user state (null/undefined = not logged in)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  const handleCardScanned = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleSignOut = async () => {
    try {
      // await signOut();           // ← your actual sign out function
      toast.success("Signed out successfully");
      router.push("/login");
    } catch (error) {
      console.error("Sign out failed:", error);
      toast.error("Failed to sign out");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl gradient-primary animate-pulse" />
            <Loader2 className="absolute inset-0 m-auto h-8 w-8 animate-spin text-primary-foreground" />
          </div>
          <p className="text-muted-foreground font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Optional: you can also return null or redirect here
  // if (!user) return null;

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 py-6 md:py-10">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 md:mb-12 animate-fade-in">
          <div className="flex items-center gap-3">
            <div>
            <Image src={whiteLogo} alt="Pexifly" width={110} height={40} />
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="gap-2 glass border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all duration-300"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </header>

        {/* Main Content */}
        <main>
          {/* Hero Section */}
          <div className="text-center mb-8 md:mb-12 animate-slide-up">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4 leading-tight">
              Scan Cards with{" "}
              <span className="text-gradient">AI Precision</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
              Extract data from visiting cards instantly. Powered by advanced AI for accurate, reliable results.
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 md:mb-10 p-1.5 h-14 glass rounded-2xl border border-border/50">
              <TabsTrigger
                value="scan"
                className="flex items-center gap-2 text-sm md:text-base rounded-xl data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300 "
              >
                <ScanLine className="w-4 h-4" />
                <span>Scan Card</span>
              </TabsTrigger>
              <TabsTrigger
                value="dashboard"
                className="flex items-center gap-2 text-sm md:text-base rounded-xl data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300 "
              >
                <Database className="w-4 h-4" />
                <span>Dashboard</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="scan" className="animate-fade-in">
              <CameraScanner onCardScanned={handleCardScanned} />

              {/* Features */}
              <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
                {[
                  {
                    icon: ScanLine,
                    title: "Camera Capture",
                    description: "Scan cards directly using your device camera with real-time preview",
                    color: "from-primary/20 to-primary/5",
                  },
                  {
                    icon: Sparkles,
                    title: "AI-Powered OCR",
                    description: "Advanced AI extracts text with high accuracy and smart field detection",
                    color: "from-accent/20 to-accent/5",
                  },
                  {
                    icon: Zap,
                    title: "Instant Save",
                    description: "All scanned cards are automatically saved and organized in your database",
                    color: "from-primary/20 to-accent/5",
                  },
                ].map((feature, idx) => (
                  <div
                    key={idx}
                    className={`group relative p-6 rounded-2xl bg-gradient-to-br ${feature.color} border border-border/50 hover-lift stagger-${
                      idx + 1
                    } opacity-0 animate-fade-in`}
                  >
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="font-heading font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="dashboard" className="animate-fade-in">
              <AdminDashboard
                refreshTrigger={refreshTrigger}
                onCardDeleted={() => setRefreshTrigger((prev) => prev + 1)}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Index;