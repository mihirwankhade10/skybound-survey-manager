import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LoginPage from "@/pages/Auth/LoginPage";
import Index from "./pages/Index";
import MissionPlanning from "./pages/MissionPlanning";
import FleetManagement from "./pages/FleetManagement";
import MissionMonitoring from "./pages/MissionMonitoring";
import SurveyReports from "./pages/SurveyReports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Index />} />
              <Route path="/mission-planning" element={<MissionPlanning />} />
              <Route path="/fleet-management" element={<FleetManagement />} />
              <Route path="/mission-monitoring" element={<MissionMonitoring />} />
              <Route path="/survey-reports" element={<SurveyReports />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
