import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import DroneMissionMap from "@/components/map/DroneMissionMap";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Pause, Play, Square, AlertTriangle, Battery, Wind, MapPin, Loader2 } from "lucide-react";
import StatusBadge from "@/components/common/StatusBadge";
import { useToast } from "@/components/ui/use-toast";
import DroneIcon from "@/components/common/DroneIcon";
import { missionsAPI, monitorAPI } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

const MissionMonitoring = () => {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [activeMissions, setActiveMissions] = useState<any[]>([]);
  const [selectedMissionId, setSelectedMissionId] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [missionData, setMissionData] = useState<any>(null);
  const [telemetryData, setTelemetryData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch active missions when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      fetchActiveMissions();
    }
  }, [isAuthenticated]);
  
  // Fetch mission data when selected mission changes
  useEffect(() => {
    if (selectedMissionId) {
      fetchMissionData();
      
      // Set up polling for live data updates
      const intervalId = setInterval(() => {
        if (!isPaused) {
          fetchMissionData();
        }
      }, 5000); // Poll every 5 seconds
      
      return () => clearInterval(intervalId);
    }
  }, [selectedMissionId, isPaused]);
  
  const fetchActiveMissions = async () => {
    // Function implementation unchanged
    setIsLoading(true);
    try {
      const response = await missionsAPI.getAllMissions();
      const missions = response.data.data;
      const active = missions.filter((mission: any) => 
        mission.status === "In Progress" || mission.status === "Scheduled"
      );
      setActiveMissions(active);
      
      // Set the first active mission as selected if available
      if (active.length > 0 && !selectedMissionId) {
        setSelectedMissionId(active[0]._id);
      }
    } catch (error) {
      console.error('Error fetching missions:', error);
      setError('Failed to load active missions');
      toast({
        title: "Error",
        description: "Could not load active missions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchMissionData = async () => {
    // Function implementation unchanged
    if (!selectedMissionId) return;
    
    try {
      const response = await monitorAPI.getLiveMissionData(selectedMissionId);
      setMissionData(response.data.data);
      
      // If mission has an assigned drone, fetch telemetry data
      if (response.data.data.droneInfo) {
        fetchDroneTelemetry(response.data.data.droneInfo.droneId);
      }
    } catch (error) {
      console.error('Error fetching mission data:', error);
      toast({
        title: "Error",
        description: "Could not load mission data",
        variant: "destructive",
      });
    }
  };
  
  const fetchDroneTelemetry = async (droneId: string) => {
    // Function implementation unchanged
    try {
      const response = await monitorAPI.getDroneTelemetry(droneId);
      setTelemetryData(response.data.data);
    } catch (error) {
      console.error('Error fetching drone telemetry:', error);
    }
  };
  
  const handlePauseResume = async () => {
    // Function implementation unchanged
    if (!missionData) return;
    
    try {
      setIsPaused(!isPaused);
      
      await monitorAPI.updateMissionStatus(selectedMissionId, {
        status: isPaused ? "In Progress" : "Paused"
      });
      
      toast({
        title: isPaused ? "Mission Resumed" : "Mission Paused",
        description: `${missionData.name} has been ${isPaused ? "resumed" : "paused"}.`,
      });
      
      fetchMissionData();
    } catch (error) {
      console.error('Error updating mission status:', error);
      toast({
        title: "Error",
        description: "Failed to update mission status",
        variant: "destructive",
      });
    }
  };
  
  const handleAbort = async () => {
    // Function implementation unchanged
    if (!missionData) return;
    
    try {
      await monitorAPI.updateMissionStatus(selectedMissionId, {
        status: "Aborted"
      });
      
      toast({
        title: "Mission Aborted",
        description: `${missionData.name} has been aborted.`,
        variant: "destructive"
      });
      
      fetchActiveMissions();
      fetchMissionData();
    } catch (error) {
      console.error('Error aborting mission:', error);
      toast({
        title: "Error",
        description: "Failed to abort mission",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 p-6 overflow-auto bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Mission Selector */}
          <div className="mb-6 w-full max-w-md">
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading missions...</span>
              </div>
            ) : (
              <Select 
                value={selectedMissionId}
                onValueChange={setSelectedMissionId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select active mission to monitor" />
                </SelectTrigger>
                <SelectContent>
                  {activeMissions.length > 0 ? (
                    activeMissions.map(mission => (
                      <SelectItem key={mission._id} value={mission._id}>
                        {/* Limit the text length of mission names to prevent overflow */}
                        {mission.name.length > 30 
                          ? `${mission.name.substring(0, 30)}...` 
                          : mission.name} 
                        {mission.location?.address 
                          ? ` (${mission.location.address.length > 20 
                              ? `${mission.location.address.substring(0, 20)}...` 
                              : mission.location.address})` 
                          : ''}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>No active missions</SelectItem>
                  )}
                </SelectContent>
              </Select>
            )}
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-drone-teal" />
            </div>
          ) : missionData ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Mission Map */}
              <div className="lg:col-span-2">
                <DroneMissionMap 
                  title={`Live Tracking: ${missionData.name.length > 30 ? `${missionData.name.substring(0, 30)}...` : missionData.name}`} 
                  currentPosition={missionData.currentLocation?.coordinates ? 
                    { lat: missionData.currentLocation.coordinates[1], lng: missionData.currentLocation.coordinates[0] } : 
                    undefined
                  }
                  waypoints={missionData.flightPath?.map((point: any, index: number) => ({
                    id: index,
                    lat: point.coordinates[1],
                    lng: point.coordinates[0]
                  })) || []}
                  editable={false}
                />
              </div>
              
              {/* Mission Status Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Mission Info */}
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex justify-between items-center">
                      {/* Truncate mission name if too long */}
                      <h2 className="text-lg font-semibold truncate max-w-[70%]" title={missionData.name}>
                        {missionData.name}
                      </h2>
                      {/* Fixed width for status badge to prevent overflow */}
                      <div className="min-w-[100px] text-right">
                        <StatusBadge status={missionData.status} />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Progress:</span>
                          <span className="font-medium">{missionData.progress}%</span>
                        </div>
                        <Progress value={missionData.progress} className="bg-muted" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center text-sm">
                          <DroneIcon size={16} className="mr-2 flex-shrink-0 text-muted-foreground" />
                          <div className="overflow-hidden">
                            <div className="text-muted-foreground">Drone</div>
                            <div className="font-medium truncate" title={missionData.droneInfo ? `${missionData.droneInfo.model} (${missionData.droneInfo.droneId})` : 'None assigned'}>
                              {missionData.droneInfo ? `${missionData.droneInfo.model} (${missionData.droneInfo.droneId})` : 'None assigned'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center text-sm">
                          <Battery size={16} className="mr-2 flex-shrink-0 text-muted-foreground" />
                          <div>
                            <div className="text-muted-foreground">Battery</div>
                            <div className="font-medium">
                              {missionData.batteryLevel ? `${missionData.batteryLevel}%` : 'N/A'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin size={16} className="mr-2 flex-shrink-0 text-muted-foreground" />
                          <div className="overflow-hidden">
                            <div className="text-muted-foreground">Location</div>
                            <div className="font-medium truncate" title={missionData.location?.address || 'Unknown location'}>
                              {missionData.location?.address || 'Unknown location'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center text-sm">
                          <Wind size={16} className="mr-2 flex-shrink-0 text-muted-foreground" />
                          <div>
                            <div className="text-muted-foreground">Wind</div>
                            <div className="font-medium">
                              {telemetryData ? `${telemetryData.windSpeed} m/s ${telemetryData.windDirection}` : 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Telemetry */}
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <h3 className="font-medium">Live Telemetry</h3>
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <div className="text-muted-foreground">Altitude:</div>
                      <div className="font-medium">
                        {missionData.telemetry?.altitude ? `${missionData.telemetry.altitude.toFixed(1)} m` : 'N/A'}
                      </div>
                      
                      <div className="text-muted-foreground">Speed:</div>
                      <div className="font-medium">
                        {missionData.telemetry?.speed ? `${missionData.telemetry.speed.toFixed(1)} m/s` : 'N/A'}
                      </div>
                      
                      <div className="text-muted-foreground">Coordinates:</div>
                      <div className="font-medium overflow-hidden text-ellipsis">
                        {missionData.currentLocation?.coordinates ? 
                          `${missionData.currentLocation.coordinates[1].toFixed(4)}° N, ${missionData.currentLocation.coordinates[0].toFixed(4)}° W` : 
                          'N/A'}
                      </div>
                      
                      <div className="text-muted-foreground">Est. time remaining:</div>
                      <div className="font-medium">{missionData.estimatedTimeRemaining || 'N/A'}</div>
                      
                      <div className="text-muted-foreground">Signal strength:</div>
                      <div className="font-medium">
                        {telemetryData?.signalStrength ? `${telemetryData.signalStrength}%` : 'N/A'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Mission Controls */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      className="flex items-center justify-center text-sm lg:text-base w-full px-2"
                      onClick={handlePauseResume}
                    >
                      {isPaused ? (
                        <>
                          <Play size={16} className="mr-1 flex-shrink-0" />
                          <span className="truncate">Resume Mission</span>
                        </>
                      ) : (
                        <>
                          <Pause size={16} className="mr-1 flex-shrink-0" />
                          <span className="truncate">Pause Mission</span>
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex items-center justify-center text-sm lg:text-base w-full px-2 text-drone-danger hover:text-drone-danger hover:border-drone-danger"
                      onClick={handleAbort}
                    >
                      <Square size={16} className="mr-1 flex-shrink-0" />
                      <span className="truncate">Abort Mission</span>
                    </Button>
                  </div>
                  
                  <Alert className="bg-amber-50 text-amber-800 border-amber-200">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                    <AlertDescription className="text-sm">
                      Warning: Low visibility conditions detected. Consider pausing the mission.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-lg border">
              <DroneIcon size={48} className="mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-medium mb-2">No Active Missions</h2>
              <p className="text-muted-foreground">
                There are no missions currently in progress.
                <br />
                Go to Mission Planning to schedule a new mission.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MissionMonitoring;