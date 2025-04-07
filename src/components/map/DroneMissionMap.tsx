
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, MapPin, Layers } from "lucide-react";

// Define Waypoint interface here instead of importing from mockData
export interface Waypoint {
  id: number;
  lat: number;
  lng: number;
}

interface DroneMissionMapProps {
  title: string;
  waypoints?: Waypoint[];
  editable?: boolean;
  currentPosition?: { lat: number; lng: number } | null;
  onWaypointsChange?: (waypoints: Waypoint[]) => void;
}

const DroneMissionMap = ({ 
  title, 
  waypoints = [], 
  editable = false,
  currentPosition = null,
  onWaypointsChange
}: DroneMissionMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [localWaypoints, setLocalWaypoints] = useState<Waypoint[]>(waypoints);
  const [nextId, setNextId] = useState(1);

  useEffect(() => {
    // In a real implementation, this would initialize a map library like Mapbox or Leaflet
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Update local waypoints when prop changes, but only if they're different
  useEffect(() => {
    // Only update if the waypoints prop has actually changed
    // This prevents unnecessary state updates that can cause infinite loops
    if (JSON.stringify(waypoints) !== JSON.stringify(localWaypoints)) {
      setLocalWaypoints(waypoints);
    }
  }, [waypoints]);
  
  // Update parent component when local waypoints change, but only if the callback exists
  useEffect(() => {
    // Only call the callback if it exists and if we're in editable mode
    // This prevents unnecessary updates in view-only mode
    if (onWaypointsChange && editable) {
      onWaypointsChange(localWaypoints);
    }
  }, [localWaypoints, onWaypointsChange, editable]);
  
  // Handle adding a new waypoint when clicking on the map
  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!editable) return;
    
    // Get click coordinates relative to the map container
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Convert to percentage for relative positioning
    const lat = (x / rect.width) * 100;
    const lng = (y / rect.height) * 100;
    
    // Add new waypoint
    const newWaypoint: Waypoint = {
      id: nextId,
      lat,
      lng
    };
    
    setNextId(nextId + 1);
    setLocalWaypoints([...localWaypoints, newWaypoint]);
  };
  
  // Handle dragging waypoints
  const handleWaypointDrag = (id: number, newLat: number, newLng: number) => {
    const updatedWaypoints = localWaypoints.map(wp => 
      wp.id === id ? { ...wp, lat: newLat, lng: newLng } : wp
    );
    setLocalWaypoints(updatedWaypoints);
  };
  
  // Handle removing a waypoint on right-click
  const handleWaypointRemove = (id: number) => {
    const updatedWaypoints = localWaypoints.filter(wp => wp.id !== id);
    setLocalWaypoints(updatedWaypoints);
  };

  // Enhanced visual map with better UI
  const mockMap = () => {
    // Create path string for SVG path element
    const createPathString = () => {
      if (localWaypoints.length < 2) return "";
      
      return localWaypoints.reduce((path, wp, index) => {
        const command = index === 0 ? `M ${wp.lat},${wp.lng}` : `L ${wp.lat},${wp.lng}`;
        return `${path} ${command}`;
      }, "");
    };
    
    // Function to clear all waypoints
    const clearAllWaypoints = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (editable) {
        setLocalWaypoints([]);
      }
    };
    
    return (
      <div className="h-full w-full flex flex-col">
        {/* Map controls */}
        {editable && (
          <div className="bg-white p-2 border-b flex justify-between items-center">
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <MapPin size={16} />
              <span>{localWaypoints.length} waypoints</span>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearAllWaypoints}
                disabled={localWaypoints.length === 0}
                className="h-8 px-2 text-xs"
              >
                <Trash2 size={14} className="mr-1" /> Clear All
              </Button>
            </div>
          </div>
        )}
        
        {/* Map area */}
        <div 
          className="flex-1 relative overflow-hidden border rounded-b-md"
          onClick={handleMapClick}
          style={{
            background: 'linear-gradient(to bottom, #e6f7ff, #f5f5f5)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'  
          }}
        >
          {/* Map background with satellite-like texture */}
          <div className="absolute inset-0 bg-blue-900/5 z-0">
            <div 
              className="w-full h-full opacity-20" 
              style={{ 
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%232563eb' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                backgroundSize: '150px 150px'
              }}
            ></div>
          </div>
          
          {/* Map grid lines */}
          <div 
            className="absolute inset-0 z-10" 
            style={{ 
              backgroundSize: '40px 40px', 
              backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)',
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)'
            }}
          ></div>
          
          {/* Compass rose */}
          <div className="absolute top-4 right-4 z-20 bg-white bg-opacity-80 p-2 rounded-full shadow-md">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" stroke="#666" />
              <path d="M12 2V6" stroke="#f43f5e" />
              <path d="M12 18V22" stroke="#666" />
              <path d="M2 12H6" stroke="#666" />
              <path d="M18 12H22" stroke="#666" />
              <text x="12" y="5" textAnchor="middle" fontSize="3" fill="#f43f5e">N</text>
              <text x="12" y="21" textAnchor="middle" fontSize="3" fill="#666">S</text>
              <text x="21" y="12.5" textAnchor="middle" fontSize="3" fill="#666">E</text>
              <text x="3" y="12.5" textAnchor="middle" fontSize="3" fill="#666">W</text>
            </svg>
          </div>
          
          {/* Map elements */}
          <div className="relative w-full h-full z-20">
            {/* Drone icon - only show if not in edit mode */}
            {!editable && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-8 h-8 bg-drone-teal text-white rounded-full flex items-center justify-center animate-pulse shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                <div className="w-12 h-12 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-drone-teal/30 animate-ping"></div>
              </div>
            )}
            
            {/* Flight path */}
            <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
              {/* Path connecting waypoints */}
              {localWaypoints.length > 1 && (
                <>
                  {/* Shadow path for depth effect */}
                  <path 
                    d={createPathString()} 
                    fill="none" 
                    stroke="rgba(0,0,0,0.2)" 
                    strokeWidth="4" 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    transform="translate(2,2)"
                  />
                  {/* Main path */}
                  <path 
                    d={createPathString()} 
                    fill="none" 
                    stroke="#0a9396" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="none"
                  />
                  {/* Direction arrows along path */}
                  {localWaypoints.length > 1 && localWaypoints.slice(0, -1).map((wp, i) => {
                    if (i < localWaypoints.length - 1) {
                      const nextWp = localWaypoints[i + 1];
                      // Calculate midpoint for arrow
                      const midX = (wp.lat + nextWp.lat) / 2;
                      const midY = (wp.lng + nextWp.lng) / 2;
                      // Calculate angle for arrow rotation
                      const angle = Math.atan2(nextWp.lng - wp.lng, nextWp.lat - wp.lat) * 180 / Math.PI;
                      
                      return (
                        <polygon 
                          key={`arrow-${i}`}
                          points="0,-3 6,0 0,3"
                          fill="#0a9396"
                          transform={`translate(${midX},${midY}) rotate(${angle})`}
                        />
                      );
                    }
                    return null;
                  })}
                </>
              )}
              
              {/* Waypoints */}
              {localWaypoints.map((waypoint, index) => (
                <g key={waypoint.id}>
                  {/* Shadow for depth */}
                  <circle 
                    cx={waypoint.lat + 1} 
                    cy={waypoint.lng + 1} 
                    r="8" 
                    fill="rgba(0,0,0,0.2)" 
                  />
                  {/* Waypoint marker */}
                  <circle 
                    cx={waypoint.lat} 
                    cy={waypoint.lng} 
                    r="8" 
                    fill={index === 0 ? "#047857" : (index === localWaypoints.length - 1 ? "#f43f5e" : "#0a9396")} 
                    stroke="white"
                    strokeWidth="2"
                    style={{ cursor: editable ? 'move' : 'default' }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      if (editable) handleWaypointRemove(waypoint.id);
                    }}
                  />
                  {/* Waypoint number */}
                  <text 
                    x={waypoint.lat} 
                    y={waypoint.lng} 
                    fill="white" 
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {index + 1}
                  </text>
                  {/* Waypoint label */}
                  <g transform={`translate(${waypoint.lat + 12}, ${waypoint.lng - 12})`}>
                    <rect 
                      x="0" 
                      y="0" 
                      width="24" 
                      height="16" 
                      rx="4" 
                      fill="white" 
                      fillOpacity="0.9"
                      stroke={index === 0 ? "#047857" : (index === localWaypoints.length - 1 ? "#f43f5e" : "#0a9396")}
                      strokeWidth="1"
                    />
                    <text 
                      x="12" 
                      y="8" 
                      fill="#374151" 
                      fontSize="10"
                      fontWeight="500"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {index === 0 ? "Start" : (index === localWaypoints.length - 1 ? "End" : `WP ${index + 1}`)}
                    </text>
                  </g>
                </g>
              ))}
            </svg>
          </div>
          
          {/* Help text */}
          {editable && localWaypoints.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center z-30">
              <div className="bg-white bg-opacity-80 p-4 rounded-lg shadow-md text-center max-w-xs">
                <MapPin size={32} className="mx-auto mb-2 text-drone-teal" />
                <h3 className="font-medium text-gray-900">Add Waypoints</h3>
                <p className="text-sm text-gray-600 mt-1">Click anywhere on the map to add waypoints and create your flight path.</p>
              </div>
            </div>
          )}
          
          {/* Instructions */}
          {editable && (
            <div className="absolute bottom-3 left-3 z-30 bg-white bg-opacity-90 p-2 rounded-md shadow-sm text-xs text-gray-600 border border-gray-200">
              <div className="flex items-center space-x-1 mb-1">
                <div className="w-3 h-3 rounded-full bg-047857"></div>
                <span>Start point</span>
              </div>
              <div className="flex items-center space-x-1 mb-1">
                <div className="w-3 h-3 rounded-full bg-f43f5e"></div>
                <span>End point</span>
              </div>
              <div className="flex items-center space-x-1">
                <Plus size={12} />
                <span>Click to add</span>
                <span className="mx-1">|</span>
                <Trash2 size={12} />
                <span>Right-click to remove</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full h-full shadow-md border border-gray-200">
      <CardHeader className="pb-2 bg-gradient-to-r from-drone-teal/10 to-transparent">
        <CardTitle className="text-lg flex items-center">
          <Layers className="mr-2 h-5 w-5 text-drone-teal" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-[calc(100%-56px)]">
        <div className="h-full overflow-hidden" ref={mapRef}>
          {mapLoaded ? (
            mockMap()
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-100">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 border-4 border-drone-teal border-t-transparent rounded-full animate-spin mb-2"></div>
                <div className="text-sm text-gray-600">Loading map...</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DroneMissionMap;
