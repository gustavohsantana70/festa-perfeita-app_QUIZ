import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useStore } from "@/lib/store";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Guests from "./pages/Guests";
import ShoppingList from "./pages/ShoppingList";
import Budget from "./pages/Budget";
import Templates from "./pages/Templates";
import Chat from "./pages/Chat";
import Summary from "./pages/Summary";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Quiz from "./pages/Quiz";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Onboarding check disabled - allowing direct access
  // if (!user?.onboardingComplete) {
  //   return <Navigate to="/onboarding" replace />;
  // }

  return <>{children}</>;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

const App = () => {
  // Initialize auth listener
  const { setUser, setAuthenticated } = useStore();

  useEffect(() => {
    const initAuth = async () => {
      const { supabase } = await import('@/lib/supabase');

      // Get initial session
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        // Fetch profile from database
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        setUser({
          id: session.user.id,
          name: profile?.name || session.user.user_metadata.name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email!,
          onboardingComplete: profile?.onboarding_complete || false,
          partyType: profile?.party_type,
          partyDate: profile?.party_date,
          expectedGuests: profile?.expected_guests,
          totalBudget: profile?.total_budget,
        });
        setAuthenticated(true);
      }

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          // Fetch profile from database
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          setUser({
            id: session.user.id,
            name: profile?.name || session.user.user_metadata.name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email!,
            onboardingComplete: profile?.onboarding_complete || false,
            partyType: profile?.party_type,
            partyDate: profile?.party_date,
            expectedGuests: profile?.expected_guests,
            totalBudget: profile?.total_budget,
          });
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
          setUser(null);
        }
      });

      return () => subscription.unsubscribe();
    };

    initAuth();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
            <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/guests" element={<ProtectedRoute><Guests /></ProtectedRoute>} />
            <Route path="/shopping-list" element={<ProtectedRoute><ShoppingList /></ProtectedRoute>} />
            <Route path="/budget" element={<ProtectedRoute><Budget /></ProtectedRoute>} />
            <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/summary" element={<ProtectedRoute><Summary /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
