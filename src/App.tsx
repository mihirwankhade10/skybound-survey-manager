import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
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
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route
                element={
                  <div className="flex h-screen overflow-hidden">
                    <Sidebar />
                    <div className="flex-1 flex flex-col overflow-hidden">
                      <Outlet />
                    </div>
                  </div>
                }
              >
                <Route path="/" element={<Index />} />
                <Route path="/mission-planning" element={<MissionPlanning />} />
                <Route path="/fleet-management" element={<FleetManagement />} />
                <Route path="/mission-monitoring" element={<MissionMonitoring />} />
                <Route path="/survey-reports" element={<SurveyReports />} />
              </Route>
            </Route>
            
            {/* Fallback Routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
