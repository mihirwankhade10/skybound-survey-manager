
import { useState } from "react";
import Header from "@/components/layout/Header";
import DroneMissionMap from "@/components/map/DroneMissionMap";
import { missions } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Pause, Play, Square, AlertTriangle, Battery, Wind, MapPin } from "lucide-react";
import StatusBadge from "@/components/common/StatusBadge";
import { useToast } from "@/components/ui/use-toast";
import DroneIcon from "@/components/common/DroneIcon";

const MissionMonitoring = () => {
  const { toast } = useToast();
  const activeMissions = missions.filter(mission => mission.status === "In Progress");
  const [selectedMissionId, setSelectedMissionId] = useState(activeMissions.length > 0 ? activeMissions[0].id : "");
  const [isPaused, setIsPaused] = useState(false);
  
  const selectedMission = missions.find(m => m.id === selectedMissionId);
  
  const handlePauseResume = () => {
    setIsPaused(!isPaused);
    toast({
      title: isPaused ? "Mission Resumed" : "Mission Paused",
      description: `${selectedMission?.name} has been ${isPaused ? "resumed" : "paused"}.`,
    });
  };
  
  const handleAbort = () => {
    toast({
      title: "Mission Aborted",
      description: `${selectedMission?.name} has been aborted.`,
      variant: "destructive"
    });
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 p-6 overflow-auto bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Mission Selector */}
          <div className="mb-6 w-full max-w-md">
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
                    <SelectItem key={mission.id} value={mission.id}>
                      {mission.name} ({mission.facility})
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>No active missions</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          {selectedMission ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Mission Map */}
              <div className="lg:col-span-2">
                <DroneMissionMap 
                  title={`Live Tracking: ${selectedMission.name}`} 
                  currentPosition={{ lat: 40.7128, lng: -74.0060 }}
                />
              </div>
              
              {/* Mission Status Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Mission Info */}
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-semibold">{selectedMission.name}</h2>
                      <StatusBadge status={selectedMission.status} />
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Progress:</span>
                          <span className="font-medium">{selectedMission.progress}%</span>
                        </div>
                        <Progress value={selectedMission.progress} className="bg-muted" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center text-sm">
                          <DroneIcon size={16} className="mr-2 text-muted-foreground" />
                          <div>
                            <div className="text-muted-foreground">Drone</div>
                            <div className="font-medium">{selectedMission.droneId}</div>
                          </div>
                        </div>
                        <div className="flex items-center text-sm">
                          <Battery size={16} className="mr-2 text-muted-foreground" />
                          <div>
                            <div className="text-muted-foreground">Battery</div>
                            <div className="font-medium">68%</div>
                          </div>
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin size={16} className="mr-2 text-muted-foreground" />
                          <div>
                            <div className="text-muted-foreground">Facility</div>
                            <div className="font-medium">{selectedMission.facility}</div>
                          </div>
                        </div>
                        <div className="flex items-center text-sm">
                          <Wind size={16} className="mr-2 text-muted-foreground" />
                          <div>
                            <div className="text-muted-foreground">Wind</div>
                            <div className="font-medium">8 mph NE</div>
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
                      <div className="font-medium">{selectedMission.altitude} m</div>
                      
                      <div className="text-muted-foreground">Speed:</div>
                      <div className="font-medium">4.2 m/s</div>
                      
                      <div className="text-muted-foreground">Coordinates:</div>
                      <div className="font-medium">40.7128° N, 74.0060° W</div>
                      
                      <div className="text-muted-foreground">Est. time remaining:</div>
                      <div className="font-medium">12 min</div>
                      
                      <div className="text-muted-foreground">Distance flown:</div>
                      <div className="font-medium">{selectedMission.distanceFlown} km</div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Mission Controls */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-1 justify-start"
                      onClick={handlePauseResume}
                    >
                      {isPaused ? (
                        <>
                          <Play size={16} className="mr-2" />
                          Resume Mission
                        </>
                      ) : (
                        <>
                          <Pause size={16} className="mr-2" />
                          Pause Mission
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 justify-start text-drone-danger hover:text-drone-danger hover:border-drone-danger"
                      onClick={handleAbort}
                    >
                      <Square size={16} className="mr-2" />
                      Abort Mission
                    </Button>
                  </div>
                  
                  <Alert className="bg-amber-50 text-amber-800 border-amber-200">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
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
