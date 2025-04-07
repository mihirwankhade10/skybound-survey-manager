
import { Calendar, Drone, MapPin, Clock, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Header from "@/components/layout/Header";
import StatsCard from "@/components/dashboard/StatsCard";
import MissionStatusChart from "@/components/dashboard/MissionStatusChart";
import MissionTable from "@/components/dashboard/MissionTable";
import DroneMissionMap from "@/components/map/DroneMissionMap";
import { dashboardStats, missions, monthlyMissionData } from "@/lib/mockData";

const Index = () => {
  // Only show the latest 5 missions
  const recentMissions = [...missions].sort((a, b) => 
    new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  ).slice(0, 5);

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
              icon={<Drone size={18} />} 
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
      </div>
    </div>
  );
};

export default Index;
