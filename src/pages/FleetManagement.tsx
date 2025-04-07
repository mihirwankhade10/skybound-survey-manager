
import { useState } from "react";
import Header from "@/components/layout/Header";
import { drones, DroneData } from "@/lib/mockData";
import DroneStatusCard from "@/components/fleet/DroneStatusCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const FleetManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  
  // Get unique locations from drones
  const locations = Array.from(new Set(drones.map(drone => drone.location)));
  
  // Filter drones based on search term and filters
  const filteredDrones = drones.filter(drone => {
    const matchesSearch = 
      drone.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      drone.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || drone.status === statusFilter;
    const matchesLocation = locationFilter === "all" || drone.location === locationFilter;
    
    return matchesSearch && matchesStatus && matchesLocation;
  });

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 p-6 overflow-auto bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-6">
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
            {filteredDrones.length > 0 ? (
              filteredDrones.map(drone => (
                <DroneStatusCard key={drone.id} drone={drone} />
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
