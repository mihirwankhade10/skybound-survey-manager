
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Header from "@/components/layout/Header";
import { missions, droneUsageData, monthlyMissionData } from "@/lib/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/common/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Search, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SurveyReports = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [monthFilter, setMonthFilter] = useState("all");
  
  // Format duration in minutes to hours and minutes
  const formatDuration = (minutes: number | null) => {
    if (minutes === null) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  // Filter missions based on search term and month filter
  const filteredMissions = missions.filter(mission => {
    const matchesSearch = 
      mission.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      mission.facility.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (monthFilter === "all") return matchesSearch;
    
    const missionMonth = new Date(mission.startTime).getMonth() + 1;
    return matchesSearch && missionMonth.toString() === monthFilter;
  });

  // Colors for pie chart
  const COLORS = ['#0a9396', '#94d2bd', '#e9d8a6', '#ee9b00', '#ca6702', '#ae2012'];

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 p-6 overflow-auto bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Filters */}
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex flex-wrap items-end gap-4">
              <div className="w-full md:w-64 space-y-2">
                <label htmlFor="search" className="text-sm font-medium">Search Reports</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by name or facility..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="w-full md:w-48 space-y-2">
                <label htmlFor="month" className="text-sm font-medium">Month</label>
                <Select
                  onValueChange={setMonthFilter}
                  defaultValue="all"
                >
                  <SelectTrigger id="month" className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="All Months" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Months</SelectItem>
                    <SelectItem value="1">January</SelectItem>
                    <SelectItem value="2">February</SelectItem>
                    <SelectItem value="3">March</SelectItem>
                    <SelectItem value="4">April</SelectItem>
                    <SelectItem value="5">May</SelectItem>
                    <SelectItem value="6">June</SelectItem>
                    <SelectItem value="7">July</SelectItem>
                    <SelectItem value="8">August</SelectItem>
                    <SelectItem value="9">September</SelectItem>
                    <SelectItem value="10">October</SelectItem>
                    <SelectItem value="11">November</SelectItem>
                    <SelectItem value="12">December</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="ml-auto">
                <Button variant="outline" className="flex items-center">
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </div>
            </div>
          </div>
          
          {/* Analytics Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Missions per Month */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Missions per Month</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
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
              </CardContent>
            </Card>
            
            {/* Drone Usage */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Drone Usage (Flight Hours)</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={droneUsageData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="hours"
                      nameKey="drone"
                      label={({ drone }) => drone}
                    >
                      {droneUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} hours`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          {/* Missions Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Mission History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mission Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Facility</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Distance</TableHead>
                      <TableHead>Drone</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMissions.length > 0 ? (
                      filteredMissions.map(mission => (
                        <TableRow key={mission.id}>
                          <TableCell className="font-medium">{mission.name}</TableCell>
                          <TableCell>{formatDate(mission.startTime)}</TableCell>
                          <TableCell>{mission.facility}</TableCell>
                          <TableCell>{formatDuration(mission.duration)}</TableCell>
                          <TableCell>{mission.distanceFlown ? `${mission.distanceFlown} km` : "N/A"}</TableCell>
                          <TableCell>{mission.droneId || "Not assigned"}</TableCell>
                          <TableCell>
                            <StatusBadge status={mission.status} />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          No missions match your search criteria
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SurveyReports;
