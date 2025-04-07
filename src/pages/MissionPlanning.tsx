
import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import DroneMissionMap from "@/components/map/DroneMissionMap";
import { facilities } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar as CalendarIcon, Clock, Loader2, Map, MapPin, Plane } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { missionsAPI, MissionFormData, dronesAPI } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

const MissionPlanning = () => {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const sensorOptions = ["RGB", "Thermal", "LiDAR", "Multispectral"];
  
  // State for form data
  const [formData, setFormData] = useState({
    name: "",
    facility: "",
    altitude: 40,
    pattern: "Grid",
    sensorType: "",
    frequency: 1,
    recurrence: "Once",
    date: "",
    time: "",
    assignedDroneId: ""
  });
  
  // State for date picker
  const [date, setDate] = useState<Date | undefined>(undefined);
  
  // State for waypoints (flight path)
  const [waypoints, setWaypoints] = useState<Array<{id: number, lat: number, lng: number}>>([]);
  
  // State for loading and errors
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for available drones
  const [availableDrones, setAvailableDrones] = useState<Array<{_id: string, droneId: string, model: string}>>([]);
  
  // Fetch available drones when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      const fetchAvailableDrones = async () => {
        try {
          const response = await dronesAPI.getAvailableDrones();
          setAvailableDrones(response.data.data);
        } catch (error) {
          console.error('Error fetching available drones:', error);
          toast({
            title: "Error",
            description: "Could not load available drones",
            variant: "destructive",
          });
        }
      };
      
      fetchAvailableDrones();
    }
  }, [isAuthenticated, toast]);

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleWaypointsChange = (newWaypoints: Array<{id: number, lat: number, lng: number}>) => {
    setWaypoints(newWaypoints);
  };
  
  // Handle date change from calendar component
  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      const formattedDate = format(newDate, "yyyy-MM-dd");
      setFormData(prev => ({ ...prev, date: formattedDate }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate waypoints
    if (waypoints.length < 3) {
      toast({
        title: "Validation Error",
        description: "Please add at least 3 waypoints to create a flight path",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Combine date and time
      const startDateTime = new Date(`${formData.date}T${formData.time}:00`);
      
      // Create mission data object
      const missionData: MissionFormData = {
        name: formData.name,
        location: {
          type: "Point",
          coordinates: [Math.random() * 10 + 30, Math.random() * 10 - 70], // Random coordinates for demo
          address: formData.facility
        },
        startTime: startDateTime.toISOString(),
        recurrenceType: formData.recurrence as 'Once' | 'Daily' | 'Weekly' | 'Monthly',
        flightPath: waypoints.map(wp => ({
          type: "Point",
          coordinates: [wp.lat, wp.lng]
        })),
        flightAltitude: formData.altitude,
        patternType: formData.pattern as 'Grid' | 'Crosshatch' | 'Perimeter',
        sensorType: formData.sensorType as 'RGB' | 'Thermal' | 'Multispectral' | 'LiDAR',
        status: "Scheduled"
      };
      
      // Add drone assignment if selected and not 'none'
      if (formData.assignedDroneId && formData.assignedDroneId !== 'none') {
        missionData.assignedDroneId = formData.assignedDroneId;
      }
      
      // Send to API
      const response = await missionsAPI.addMission(missionData);
      
      // Success message
      toast({
        title: "Mission Created",
        description: `${formData.name} has been scheduled for ${new Date(startDateTime).toLocaleString()}.`,
      });
      
      // Reset form
      setFormData({
        name: "",
        facility: "",
        altitude: 40,
        pattern: "Grid",
        sensorType: "",
        frequency: 1,
        recurrence: "Once",
        date: "",
        time: "",
        assignedDroneId: ""
      });
      setWaypoints([]);
      
    } catch (error: any) {
      console.error('Error creating mission:', error);
      setError(error.response?.data?.error || "Failed to create mission");
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to create mission",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 p-6 overflow-auto bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Card className="mb-6 bg-gradient-to-r from-drone-teal/5 to-transparent border border-drone-teal/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Map className="mr-2 h-5 w-5 text-drone-teal" />
                Mission Planning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Create a new drone mission by selecting a facility, defining waypoints on the map, and setting mission parameters. 
                Add at least 3 waypoints by clicking on the map to define a flight path.
              </p>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Mission Map */}
            <div className="lg:col-span-2">
              <DroneMissionMap 
                title="Mission Planning Map" 
                editable={true} 
                waypoints={waypoints}
                onWaypointsChange={handleWaypointsChange}
              />

            </div>
            
            {/* Mission Form */}
            <div className="lg:col-span-1">
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="pb-2 bg-gradient-to-r from-gray-50 to-transparent">
                  <CardTitle className="text-lg flex items-center">
                    <Plane className="mr-2 h-5 w-5 text-drone-teal" />
                    Mission Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Mission Name</Label>
                      <Input 
                        id="name" 
                        placeholder="Enter mission name" 
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="facility">Select Facility</Label>
                      <Select 
                        onValueChange={(value) => handleChange("facility", value)}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select facility" />
                        </SelectTrigger>
                        <SelectContent>
                          {facilities.map(facility => (
                            <SelectItem key={facility} value={facility}>
                              {facility}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Flight Altitude: {formData.altitude}m</Label>
                      <Slider 
                        min={10} 
                        max={120} 
                        step={5}
                        value={[formData.altitude]} 
                        onValueChange={(value) => handleChange("altitude", value[0])}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Pattern Type</Label>
                      <RadioGroup 
                        defaultValue="Grid"
                        className="flex space-x-4"
                        onValueChange={(value) => handleChange("pattern", value)}
                      >
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="Grid" id="pattern-grid" />
                          <Label htmlFor="pattern-grid">Grid</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="Crosshatch" id="pattern-crosshatch" />
                          <Label htmlFor="pattern-crosshatch">Crosshatch</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="Perimeter" id="pattern-perimeter" />
                          <Label htmlFor="pattern-perimeter">Perimeter</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sensor">Sensor Type</Label>
                      <Select 
                        onValueChange={(value) => handleChange("sensorType", value)}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select sensor" />
                        </SelectTrigger>
                        <SelectContent>
                          {sensorOptions.map(sensor => (
                            <SelectItem key={sensor} value={sensor}>
                              {sensor}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Recurrence</Label>
                      <RadioGroup 
                        defaultValue="Once"
                        className="flex space-x-4"
                        onValueChange={(value) => handleChange("recurrence", value)}
                      >
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="Once" id="one-time" />
                          <Label htmlFor="one-time">One-time</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="Daily" id="daily" />
                          <Label htmlFor="daily">Daily</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="Weekly" id="weekly" />
                          <Label htmlFor="weekly">Weekly</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="date"
                              variant="outline"
                              className="w-full justify-start text-left font-normal h-10"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? format(date, "PPP") : <span className="text-muted-foreground">Select date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={handleDateChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="time">Time</Label>
                        <div className="relative">
                          <Input 
                            id="time" 
                            type="time"
                            value={formData.time}
                            onChange={(e) => handleChange("time", e.target.value)}
                            required
                            className="pl-10"
                          />
                          <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="drone">Assign Drone (Optional)</Label>
                      <Select 
                        onValueChange={(value) => handleChange("assignedDroneId", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select drone (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {availableDrones.map(drone => (
                            <SelectItem key={drone._id} value={drone._id}>
                              {drone.model} ({drone.droneId})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-drone-teal hover:bg-drone-teal/90"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Mission...
                        </>
                      ) : (
                        'Create Mission'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionPlanning;
