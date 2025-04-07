
import { useState } from "react";
import Header from "@/components/layout/Header";
import DroneMissionMap from "@/components/map/DroneMissionMap";
import { facilities } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const MissionPlanning = () => {
  const { toast } = useToast();
  const sensorOptions = ["RGB", "Thermal", "LiDAR", "Multispectral", "Chemical"];
  
  const [formData, setFormData] = useState({
    name: "",
    facility: "",
    altitude: 40,
    pattern: "Grid",
    sensorType: "",
    frequency: 1,
    recurrence: "one-time",
    date: "",
    time: ""
  });

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Mission data:", formData);
    toast({
      title: "Mission Created",
      description: `${formData.name} has been scheduled for planning.`,
    });
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 p-6 overflow-auto bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Mission Map */}
            <div className="lg:col-span-2">
              <DroneMissionMap 
                title="Mission Planning Map" 
                editable={true} 
              />
              <div className="mt-2 text-sm text-muted-foreground">
                Click on the map to add waypoints. Drag existing waypoints to adjust the flight path.
              </div>
            </div>
            
            {/* Mission Form */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="pt-6">
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
                        defaultValue="one-time"
                        className="flex space-x-4"
                        onValueChange={(value) => handleChange("recurrence", value)}
                      >
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="one-time" id="one-time" />
                          <Label htmlFor="one-time">One-time</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="recurring" id="recurring" />
                          <Label htmlFor="recurring">Recurring</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <div className="relative">
                          <Input 
                            id="date" 
                            type="date"
                            value={formData.date}
                            onChange={(e) => handleChange("date", e.target.value)}
                            required
                          />
                          <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
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
                          />
                          <Clock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full bg-drone-teal hover:bg-drone-teal/90">
                      Create Mission
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
