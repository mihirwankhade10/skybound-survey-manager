import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Download, Search, Calendar, Filter, FileSpreadsheet } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const SurveyReports = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [monthFilter, setMonthFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
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
  
  // Filter missions based on search term, month filter, and status filter
  const filteredMissions = missions.filter(mission => {
    const matchesSearch = 
      mission.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      mission.facility.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMonth = monthFilter === "all" ? true : 
      (new Date(mission.startTime).getMonth() + 1).toString() === monthFilter;
    
    const matchesStatus = statusFilter === "all" ? true :
      mission.status === statusFilter;
    
    return matchesSearch && matchesMonth && matchesStatus;
  });

  // Export data to Excel
  const exportToExcel = () => {
    // Prepare data for export by transforming it
    const exportData = filteredMissions.map(mission => ({
      'Mission Name': mission.name,
      'Date': formatDate(mission.startTime),
      'Facility': mission.facility,
      'Duration': formatDuration(mission.duration),
      'Distance': mission.distanceFlown ? `${mission.distanceFlown} km` : "N/A",
      'Drone': mission.droneId || "Not assigned",
      'Status': mission.status
    }));
    
    // Create worksheet from data
    const ws = XLSX.utils.json_to_sheet(exportData);
    
    // Create workbook and add the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Mission Reports");
    
    // Generate Excel file and save
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Get current date for filename
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    saveAs(data, `mission-reports-${dateStr}.xlsx`);
  };

  // Colors for charts
  const COLORS = ['#0a9396', '#94d2bd', '#e9d8a6', '#ee9b00', '#ca6702', '#ae2012'];
  
  // Custom tooltip formatter for PieChart
  const customPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-md border">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-drone-teal">{`${payload[0].value} hours (${(payload[0].percent * 100).toFixed(1)}%)`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Survey Reports</h1>
              <p className="text-muted-foreground">
                View and analyze mission data and drone usage statistics
              </p>
            </div>
            <Button 
              variant="default" 
              className="flex items-center gap-2 bg-drone-teal hover:bg-drone-teal/90"
              onClick={exportToExcel}
            >
              <FileSpreadsheet className="h-4 w-4" />
              Export to Excel
            </Button>
          </div>
          
          {/* Filters */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Report Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-end gap-4">
                <div className="w-full sm:w-60 space-y-2">
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
                
                <div className="w-full sm:w-40 space-y-2">
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
                
                <div className="w-full sm:w-40 space-y-2">
                  <label htmlFor="status" className="text-sm font-medium">Status</label>
                  <Select
                    onValueChange={setStatusFilter}
                    defaultValue="all"
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Scheduled">Scheduled</SelectItem>
                      <SelectItem value="Aborted">Aborted</SelectItem>
                      <SelectItem value="Failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="ml-auto self-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSearchTerm("");
                      setMonthFilter("all");
                      setStatusFilter("all");
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Analytics Overview - Summary stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-muted-foreground text-sm">Total Missions</div>
                <div className="text-3xl font-bold mt-1">{filteredMissions.length}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {monthFilter !== "all" ? `For ${new Date(2023, parseInt(monthFilter) - 1).toLocaleString('default', { month: 'long' })}` : "All time"}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-muted-foreground text-sm">Completed Missions</div>
                <div className="text-3xl font-bold mt-1">
                  {filteredMissions.filter(m => m.status === "Completed").length}
                </div>
                <div className="text-xs text-green-600 mt-1">
                  {(() => {
                    const completedPct = filteredMissions.length 
                      ? (filteredMissions.filter(m => m.status === "Completed").length / filteredMissions.length * 100).toFixed(1) 
                      : 0;
                    return `${completedPct}% completion rate`;
                  })()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-muted-foreground text-sm">Total Flight Hours</div>
                <div className="text-3xl font-bold mt-1">
                  {(() => {
                    const totalMinutes = filteredMissions.reduce((acc, mission) => acc + (mission.duration || 0), 0);
                    return (totalMinutes / 60).toFixed(1);
                  })()}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Hours of operation</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-muted-foreground text-sm">Total Distance</div>
                <div className="text-3xl font-bold mt-1">
                  {(() => {
                    const totalDistance = filteredMissions.reduce((acc, mission) => acc + (mission.distanceFlown || 0), 0);
                    return totalDistance.toFixed(1);
                  })()}
                </div>
                <div className="text-xs text-muted-foreground mt-1">kilometers flown</div>
              </CardContent>
            </Card>
          </div>
          
          {/* Analytics Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Missions per Month */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Missions per Month</CardTitle>
                <CardDescription>Distribution of mission outcomes by month</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyMissionData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                    barGap={4}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={{ stroke: '#e5e7eb' }}
                      tickLine={false}
                    />
                    <YAxis 
                      axisLine={{ stroke: '#e5e7eb' }}
                      tickLine={false}
                      width={30}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '6px', 
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
                        border: '1px solid #e5e7eb'
                      }} 
                    />
                    <Legend 
                      verticalAlign="top" 
                      height={36}
                      wrapperStyle={{ paddingTop: '10px' }}
                    />
                    <Bar 
                      dataKey="completed" 
                      name="Completed" 
                      fill="#0a9396" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="aborted" 
                      name="Aborted" 
                      fill="#ae2012" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* Drone Usage */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Drone Usage (Flight Hours)</CardTitle>
                <CardDescription>Distribution of flight hours by drone</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={droneUsageData}
                      cx="50%"
                      cy="45%"
                      labelLine={false}
                      outerRadius={90}
                      innerRadius={40}
                      fill="#8884d8"
                      dataKey="hours"
                      nameKey="drone"
                      paddingAngle={2}
                    >
                      {droneUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={customPieTooltip} />
                    <Legend 
                      layout="horizontal" 
                      verticalAlign="bottom" 
                      align="center"
                      wrapperStyle={{ paddingTop: '20px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          {/* Missions Table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Mission History</CardTitle>
              <CardDescription>
                {filteredMissions.length === 1 
                  ? "1 mission found" 
                  : `${filteredMissions.length} missions found`
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Mission Name</TableHead>
                        <TableHead className="font-semibold">Date</TableHead>
                        <TableHead className="font-semibold">Facility</TableHead>
                        <TableHead className="font-semibold">Duration</TableHead>
                        <TableHead className="font-semibold">Distance</TableHead>
                        <TableHead className="font-semibold">Drone</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMissions.length > 0 ? (
                        filteredMissions.map(mission => (
                          <TableRow key={mission.id} className="hover:bg-muted/30">
                            <TableCell className="font-medium">{mission.name}</TableCell>
                            <TableCell>{formatDate(mission.startTime)}</TableCell>
                            <TableCell className="max-w-[180px] truncate" title={mission.facility}>
                              {mission.facility}
                            </TableCell>
                            <TableCell>{formatDuration(mission.duration)}</TableCell>
                            <TableCell>{mission.distanceFlown ? `${mission.distanceFlown} km` : "N/A"}</TableCell>
                            <TableCell className="whitespace-nowrap">{mission.droneId || "Not assigned"}</TableCell>
                            <TableCell>
                            <div className="w-[110px]">
                              <StatusBadge status={mission.status} />
                            </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No missions match your search criteria
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SurveyReports;