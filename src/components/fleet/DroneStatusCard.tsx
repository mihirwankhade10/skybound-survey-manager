
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DroneData } from "@/lib/mockData";
import StatusBadge from "@/components/common/StatusBadge";
import { Battery, MapPin } from "lucide-react";

interface DroneStatusCardProps {
  drone: DroneData;
}

const DroneStatusCard = ({ drone }: DroneStatusCardProps) => {
  // Determine battery color based on level
  const getBatteryColor = () => {
    if (drone.batteryLevel > 70) return "bg-drone-success";
    if (drone.batteryLevel > 30) return "bg-drone-warning";
    return "bg-drone-danger";
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-lg">{drone.name}</h3>
            <p className="text-xs text-muted-foreground">{drone.id} • {drone.model}</p>
          </div>
          <StatusBadge status={drone.status} />
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <MapPin size={14} className="mr-1 text-muted-foreground" />
            <span>{drone.location}</span>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm">
                <Battery size={14} className="mr-1 text-muted-foreground" />
                <span>Battery</span>
              </div>
              <span className="text-sm font-medium">{drone.batteryLevel}%</span>
            </div>
            <Progress value={drone.batteryLevel} className={getBatteryColor()} />
          </div>
          
          <div className="text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Assigned Mission:</span>
              <span className="font-medium">{drone.assignedMission || "None"}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-muted-foreground">Flight Hours:</span>
              <span className="font-medium">{drone.flightHours.toFixed(1)} hrs</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DroneStatusCard;
