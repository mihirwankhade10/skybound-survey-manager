
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Waypoint } from "@/lib/mockData";

interface DroneMissionMapProps {
  title: string;
  waypoints?: Waypoint[];
  editable?: boolean;
  currentPosition?: { lat: number; lng: number } | null;
  onWaypointsChange?: (waypoints: Waypoint[]) => void;
}

const mockMap = () => {
  // This is just a visual placeholder for a real map
  return (
    <div className="h-full w-full flex items-center justify-center border-2 border-dashed rounded-md border-gray-300 bg-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-900/5"></div>
      
      {/* Map grid lines */}
      <div className="absolute inset-0" style={{ backgroundSize: '20px 20px', backgroundImage: 'linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)' }}></div>
      
      {/* Map elements */}
      <div className="relative w-full h-full">
        {/* Drone icon */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-6 h-6 bg-drone-teal text-white rounded-full flex items-center justify-center animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 8a2 2 0 0 0-2-2" />
              <path d="M12 14a2 2 0 0 0 2-2" />
              <path d="M9 10a2 2 0 0 1-2 2" />
              <path d="M10 6a2 2 0 0 1 2 2" />
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6V2" />
              <path d="M12 22v-4" />
              <path d="M6 12H2" />
              <path d="M22 12h-4" />
            </svg>
          </div>
        </div>
        
        {/* Flight path */}
        <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
          <path 
            d="M 100,100 L 150,80 L 200,120 L 250,90 L 300,110 L 350,70" 
            fill="none" 
            stroke="#0a9396" 
            strokeWidth="2" 
            strokeDasharray="5,5" 
          />
          
          {/* Waypoints */}
          <circle cx="100" cy="100" r="4" fill="#0a9396" />
          <circle cx="150" cy="80" r="4" fill="#0a9396" />
          <circle cx="200" cy="120" r="4" fill="#0a9396" />
          <circle cx="250" cy="90" r="4" fill="#0a9396" />
          <circle cx="300" cy="110" r="4" fill="#0a9396" />
          <circle cx="350" cy="70" r="4" fill="#0a9396" />
        </svg>
      </div>
      
      <div className="text-gray-400 text-sm font-medium z-10">
        {editable ? "Click to add waypoints" : "Live drone tracking"}
      </div>
    </div>
  );
};

const DroneMissionMap = ({ 
  title, 
  waypoints = [], 
  editable = false,
  currentPosition = null,
  onWaypointsChange
}: DroneMissionMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // In a real implementation, this would initialize a map library like Mapbox or Leaflet
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-2 h-[calc(100%-56px)]">
        <div className="h-full rounded-md overflow-hidden" ref={mapRef}>
          {mapLoaded ? (
            mockMap()
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-md">
              <div className="animate-pulse">Loading map...</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DroneMissionMap;
