
import { useState, useEffect } from "react";
import { Calendar, MapPin, Clock, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Header from "@/components/layout/Header";
import StatsCard from "@/components/dashboard/StatsCard";
import MissionStatusChart from "@/components/dashboard/MissionStatusChart";
import MissionTable from "@/components/dashboard/MissionTable";
import DroneMissionMap from "@/components/map/DroneMissionMap";
import DroneIcon from "@/components/common/DroneIcon";
import { dashboardAPI } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    todayMissions: 0,
    monthMissions: 0,
    totalMissions: 0,
    totalDrones: 0,
    completedMissions: 0,
    ongoingMissions: 0,
    scheduledMissions: 0,
    abortedMissions: 0
  });
  const [recentMissions, setRecentMissions] = useState([]);
  const [monthlyMissionData, setMonthlyMissionData] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch dashboard stats
        const statsRes = await dashboardAPI.getStats();
        setDashboardStats(statsRes.data.data);
        
        // Fetch recent missions
        const missionsRes = await dashboardAPI.getRecentMissions();
        setRecentMissions(missionsRes.data.data);
        
        // Fetch monthly activity data
        const monthlyRes = await dashboardAPI.getMonthlyActivity();
        setMonthlyMissionData(monthlyRes.data.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Error loading dashboard",
          description: "Could not load dashboard data. Using fallback data.",
          variant: "destructive",
        });
        
        // Fallback to mock data if API fails
        import("@/lib/mockData").then(({ dashboardStats, missions, monthlyMissionData }) => {
          setDashboardStats(dashboardStats);
          setRecentMissions([...missions].sort((a, b) => 
            new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
          ).slice(0, 5));
          setMonthlyMissionData(monthlyMissionData);
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  // Prepare mission status data for pie chart
  const missionStatusData = [
    { name: "Completed", value: dashboardStats.completedMissions, color: "#52b788" },
    { name: "In Progress", value: dashboardStats.ongoingMissions, color: "#0a9396" },
    { name: "Scheduled", value: dashboardStats.scheduledMissions, color: "#005f73" },
    { name: "Aborted", value: dashboardStats.abortedMissions, color: "#ae2012" }
  ];

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 p-6 overflow-auto bg-gray-50">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard 
              title="Today's Missions" 
              value={dashboardStats.todayMissions}
              icon={<Calendar size={18} />} 
            />
            <StatsCard 
              title="Monthly Missions" 
              value={dashboardStats.monthMissions}
              icon={<BarChart3 size={18} />} 
            />
            <StatsCard 
              title="Total Missions" 
              value={dashboardStats.totalMissions}
              icon={<MapPin size={18} />} 
            />
            <StatsCard 
              title="Total Drones" 
              value={dashboardStats.totalDrones}
              icon={<DroneIcon size={18} />} 
            />
          </div>

          {/* Charts & Map */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map */}
            <div className="lg:col-span-2 h-72">
              <DroneMissionMap title="Live Drone Tracking" />
            </div>
            
            {/* Mission Status Chart */}
            <MissionStatusChart data={missionStatusData} />
          </div>
          
          {/* Monthly Activity Chart */}
          <div className="bg-white p-4 rounded-lg border">
            <h2 className="text-lg font-medium mb-4">Monthly Survey Activity</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyMissionData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completed" name="Completed" fill="#0a9396" />
                  <Bar dataKey="aborted" name="Aborted" fill="#ae2012" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Recent Missions Table */}
          <MissionTable missions={recentMissions} />
        </div>
        )}
      </div>
    </div>
  );
};

export default Index;
