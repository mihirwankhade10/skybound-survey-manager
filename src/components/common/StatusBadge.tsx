
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MissionStatus, DroneStatus } from "@/lib/mockData";

interface StatusBadgeProps {
  status: MissionStatus | DroneStatus;
  size?: "sm" | "md" | "lg";
}

const StatusBadge = ({ status, size = "md" }: StatusBadgeProps) => {
  // Determine color based on status
  const getStatusColor = () => {
    switch (status) {
      case "Completed":
        return "bg-drone-success text-white";
      case "In Progress":
        return "bg-drone-teal text-white";
      case "Scheduled":
        return "bg-drone-navy text-white";
      case "Aborted":
        return "bg-drone-danger text-white";
      case "Flying":
        return "bg-drone-teal text-white animate-pulse-slow";
      case "Charging":
        return "bg-drone-charging text-white";
      case "Maintenance":
        return "bg-drone-warning text-white";
      case "Idle":
      default:
        return "bg-drone-idle text-white";
    }
  };

  // Determine size class
  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "px-2 py-0.5 text-xs";
      case "lg":
        return "px-3 py-1 text-sm";
      case "md":
      default:
        return "px-2.5 py-0.5 text-xs";
    }
  };

  return (
    <Badge className={cn(getStatusColor(), getSizeClass())}>
      {status}
    </Badge>
  );
};

export default StatusBadge;
