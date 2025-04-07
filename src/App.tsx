
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
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
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/mission-planning" element={<MissionPlanning />} />
              <Route path="/fleet-management" element={<FleetManagement />} />
              <Route path="/mission-monitoring" element={<MissionMonitoring />} />
              <Route path="/survey-reports" element={<SurveyReports />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
