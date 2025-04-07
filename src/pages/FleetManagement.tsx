
import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import DroneStatusCard from "@/components/fleet/DroneStatusCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dronesAPI } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define the drone data type
export interface DroneData {
  _id: string;
  droneId: string;
  model: string;
  batteryLevel: number;
  location: {
    type: string;
    coordinates: number[];
  };
  status: string;
  assignedMissionId?: string;
  createdAt: string;
  name?: string; // For backward compatibility with UI
}

const FleetManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [drones, setDrones] = useState<DroneData[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Fetch drones from API
  useEffect(() => {
    const fetchDrones = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await dronesAPI.getAllDrones();
        const dronesData = response.data.data;
        
        // Add name property for backward compatibility with UI
        const formattedDrones = dronesData.map((drone: DroneData) => ({
          ...drone,
          name: `${drone.model} (${drone.droneId})` // Create a name from model and ID
        }));
        
        setDrones(formattedDrones);
        
        // Extract unique locations
        // For this example, we'll use the first coordinate as a location name
        const locationNames = Array.from(
          new Set(
            formattedDrones.map((drone: DroneData) => 
              `Location ${drone.location.coordinates[0].toFixed(2)}, ${drone.location.coordinates[1].toFixed(2)}`
            )
          )
        );
        
        setLocations(locationNames);
      } catch (error) {
        console.error('Error fetching drones:', error);
        setError('Failed to load drones. Please try again later.');
        toast({
          title: "Error",
          description: "Could not load drone data",
          variant: "destructive",
        });
        
        // Fallback to mock data
        import("@/lib/mockData").then(({ drones }) => {
          setDrones(drones);
          setLocations(Array.from(new Set(drones.map((drone: any) => drone.location))));
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDrones();
  }, [toast]);
  
  // Filter drones based on search term and filters
  const filteredDrones = drones.filter(drone => {
    const matchesSearch = 
      (drone.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
      drone.droneId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || drone.status === statusFilter;
    const matchesLocation = locationFilter === "all" || 
      (locationFilter && `Location ${drone.location.coordinates[0].toFixed(2)}, ${drone.location.coordinates[1].toFixed(2)}` === locationFilter);
    
    return matchesSearch && matchesStatus && matchesLocation;
  });

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 p-6 overflow-auto bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {/* Filters and actions */}
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex flex-wrap items-end gap-4">
              <div className="w-full md:w-64 space-y-2">
                <Label htmlFor="search">Search Drones</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by name or ID..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="w-full md:w-48 space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  onValueChange={setStatusFilter}
                  defaultValue="all"
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Idle">Idle</SelectItem>
                    <SelectItem value="Flying">Flying</SelectItem>
                    <SelectItem value="Charging">Charging</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-48 space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select
                  onValueChange={setLocationFilter}
                  defaultValue="all"
                >
                  <SelectTrigger id="location">
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map(location => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="ml-auto">
                <Button className="bg-drone-teal hover:bg-drone-teal/90">
                  <Plus className="mr-1 h-4 w-4" />
                  Add Drone
                </Button>
              </div>
            </div>
          </div>
          
          {/* Drone cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-3 flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : filteredDrones.length > 0 ? (
              filteredDrones.map(drone => (
                <DroneStatusCard key={drone._id || drone.droneId} drone={drone} />
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-muted-foreground">
                No drones match your search criteria
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FleetManagement;
