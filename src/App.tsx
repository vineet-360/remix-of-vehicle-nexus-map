import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { UserRoleProvider } from "./contexts/UserRoleContext";
import Index from "./pages/Index";
import Fleet from "./pages/Fleet";
import Trips from "./pages/Trips";
import Drivers from "./pages/Drivers";
import Vehicles from "./pages/Vehicles";
import Maintenance from "./pages/Maintenance";
import Reports from "./pages/Reports";
import Finance from "./pages/Finance";
import Settings from "./pages/Settings";
import System from "./pages/System";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserRoleProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/fleet" element={<Fleet />} />
              <Route path="/trips" element={<Trips />} />
              <Route path="/drivers" element={<Drivers />} />
              <Route path="/vehicles" element={<Vehicles />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </UserRoleProvider>
  </QueryClientProvider>
);

export default App;
