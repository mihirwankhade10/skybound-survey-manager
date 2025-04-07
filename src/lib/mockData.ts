
import { 
  Calendar, 
  LayoutGrid, 
  Map, 
  FileText 
} from "lucide-react";
import Drone from "@/components/common/DroneIcon";

// Navigation menu items
export const navigationItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: Calendar
  },
  {
    name: "Mission Planning",
    path: "/mission-planning",
    icon: Map
  },
  {
    name: "Fleet Management",
    path: "/fleet-management",
    icon: Drone
  },
  {
    name: "Mission Monitoring",
    path: "/mission-monitoring",
    icon: LayoutGrid
  },
  {
    name: "Survey Reports",
    path: "/survey-reports",
    icon: FileText
  }
];

// Mission status options
export type MissionStatus = "Completed" | "In Progress" | "Scheduled" | "Aborted";

// Drone status options
export type DroneStatus = "Idle" | "Flying" | "Charging" | "Maintenance";

// Mission pattern types
export type PatternType = "Grid" | "Crosshatch" | "Perimeter";

// Facility options
export const facilities = [
  "Main Campus",
  "North Factory",
  "East Warehouse",
  "South Distribution Center",
  "West Office Complex"
];

// Mock drones
export interface DroneData {
  id: string;
  name: string;
  location: string;
  batteryLevel: number;
  status: DroneStatus;
  assignedMission: string | null;
  lastMaintenance: string;
  model: string;
  flightHours: number;
}

export const drones: DroneData[] = [
  {
    id: "DRN-001",
    name: "Surveyor Alpha",
    location: "Main Campus",
    batteryLevel: 87,
    status: "Idle",
    assignedMission: null,
    lastMaintenance: "2025-03-12",
    model: "SkyEye Pro X5",
    flightHours: 127.4
  },
  {
    id: "DRN-002",
    name: "Falcon Eye",
    location: "North Factory",
    batteryLevel: 42,
    status: "Charging",
    assignedMission: null,
    lastMaintenance: "2025-03-28",
    model: "SkyEye Pro X5",
    flightHours: 98.2
  },
  {
    id: "DRN-003",
    name: "SkyWatch",
    location: "East Warehouse",
    batteryLevel: 68,
    status: "Flying",
    assignedMission: "Monthly Perimeter Check",
    lastMaintenance: "2025-03-18",
    model: "AeroVision Q2",
    flightHours: 156.7
  },
  {
    id: "DRN-004",
    name: "Raptor Scout",
    location: "South Distribution Center",
    batteryLevel: 94,
    status: "Idle",
    assignedMission: null,
    lastMaintenance: "2025-04-01",
    model: "AeroVision Q2",
    flightHours: 83.1
  },
  {
    id: "DRN-005",
    name: "Nimbus",
    location: "West Office Complex",
    batteryLevel: 23,
    status: "Maintenance",
    assignedMission: null,
    lastMaintenance: "2025-04-05",
    model: "SkyEye Pro X7",
    flightHours: 215.9
  },
  {
    id: "DRN-006",
    name: "Condor",
    location: "Main Campus",
    batteryLevel: 76,
    status: "Idle",
    assignedMission: null,
    lastMaintenance: "2025-03-22",
    model: "SkyEye Pro X7",
    flightHours: 142.3
  }
];

// Mock missions
export interface MissionData {
  id: string;
  name: string;
  facility: string;
  status: MissionStatus;
  droneId: string | null;
  startTime: string;
  endTime: string | null;
  duration: number | null;
  altitude: number;
  pattern: PatternType;
  sensorType: string;
  distanceFlown: number | null;
  progress: number;
  createdBy: string;
}

export const missions: MissionData[] = [
  {
    id: "MSN-001",
    name: "Quarterly Roof Inspection",
    facility: "Main Campus",
    status: "Completed",
    droneId: "DRN-001",
    startTime: "2025-04-01T09:30:00",
    endTime: "2025-04-01T10:45:00",
    duration: 75,
    altitude: 40,
    pattern: "Grid",
    sensorType: "Thermal",
    distanceFlown: 3.2,
    progress: 100,
    createdBy: "John Smith"
  },
  {
    id: "MSN-002",
    name: "Monthly Perimeter Check",
    facility: "East Warehouse",
    status: "In Progress",
    droneId: "DRN-003",
    startTime: "2025-04-07T13:15:00",
    endTime: null,
    duration: null,
    altitude: 35,
    pattern: "Perimeter",
    sensorType: "RGB",
    distanceFlown: 1.8,
    progress: 64,
    createdBy: "Sarah Johnson"
  },
  {
    id: "MSN-003",
    name: "Solar Panel Efficiency Survey",
    facility: "South Distribution Center",
    status: "Scheduled",
    droneId: null,
    startTime: "2025-04-09T11:00:00",
    endTime: null,
    duration: null,
    altitude: 50,
    pattern: "Grid",
    sensorType: "Thermal",
    distanceFlown: null,
    progress: 0,
    createdBy: "Michael Chen"
  },
  {
    id: "MSN-004",
    name: "Weekly Air Quality Sampling",
    facility: "North Factory",
    status: "Aborted",
    droneId: "DRN-002",
    startTime: "2025-04-05T15:30:00",
    endTime: "2025-04-05T15:47:00",
    duration: 17,
    altitude: 60,
    pattern: "Crosshatch",
    sensorType: "Chemical",
    distanceFlown: 0.7,
    progress: 32,
    createdBy: "Emily Davis"
  },
  {
    id: "MSN-005",
    name: "Building Facade Inspection",
    facility: "West Office Complex",
    status: "Completed",
    droneId: "DRN-006",
    startTime: "2025-04-03T10:00:00",
    endTime: "2025-04-03T11:30:00",
    duration: 90,
    altitude: 45,
    pattern: "Perimeter",
    sensorType: "RGB",
    distanceFlown: 4.1,
    progress: 100,
    createdBy: "Robert Wilson"
  },
  {
    id: "MSN-006",
    name: "Security Vulnerability Assessment",
    facility: "Main Campus",
    status: "Completed",
    droneId: "DRN-001",
    startTime: "2025-03-28T08:45:00",
    endTime: "2025-03-28T10:15:00",
    duration: 90,
    altitude: 30,
    pattern: "Grid",
    sensorType: "RGB",
    distanceFlown: 3.8,
    progress: 100,
    createdBy: "John Smith"
  },
  {
    id: "MSN-007",
    name: "Inventory Stock Count",
    facility: "East Warehouse",
    status: "Scheduled",
    droneId: null,
    startTime: "2025-04-10T09:00:00",
    endTime: null,
    duration: null,
    altitude: 20,
    pattern: "Grid",
    sensorType: "RGB",
    distanceFlown: null,
    progress: 0,
    createdBy: "Sarah Johnson"
  }
];

// Monthly mission data for charts
export const monthlyMissionData = [
  { month: "Jan", completed: 14, aborted: 2 },
  { month: "Feb", completed: 18, aborted: 1 },
  { month: "Mar", completed: 21, aborted: 3 },
  { month: "Apr", completed: 8, aborted: 1 }
];

// Drone usage data for charts
export const droneUsageData = [
  { drone: "DRN-001", hours: 42.3 },
  { drone: "DRN-002", hours: 31.7 },
  { drone: "DRN-003", hours: 48.2 },
  { drone: "DRN-004", hours: 27.5 },
  { drone: "DRN-005", hours: 12.8 },
  { drone: "DRN-006", hours: 35.4 }
];

// Dashboard statistics
export interface StatsData {
  todayMissions: number;
  monthMissions: number;
  totalMissions: number;
  totalDrones: number;
  ongoingMissions: number;
  completedMissions: number;
  abortedMissions: number;
  scheduledMissions: number;
}

export const dashboardStats: StatsData = {
  todayMissions: 2,
  monthMissions: 12,
  totalMissions: 65,
  totalDrones: 6,
  ongoingMissions: 1,
  completedMissions: 3,
  abortedMissions: 1,
  scheduledMissions: 2
};

// Mission waypoints for maps (fake coordinates)
export interface Waypoint {
  id: number;
  lat: number;
  lng: number;
}

export interface MissionPath {
  missionId: string;
  waypoints: Waypoint[];
}

export const missionPaths: MissionPath[] = [
  {
    missionId: "MSN-002",
    waypoints: [
      { id: 1, lat: 40.7128, lng: -74.0060 },
      { id: 2, lat: 40.7138, lng: -74.0070 },
      { id: 3, lat: 40.7148, lng: -74.0080 },
      { id: 4, lat: 40.7158, lng: -74.0070 },
      { id: 5, lat: 40.7148, lng: -74.0060 },
      { id: 6, lat: 40.7138, lng: -74.0050 },
      { id: 7, lat: 40.7128, lng: -74.0060 }
    ]
  }
];
