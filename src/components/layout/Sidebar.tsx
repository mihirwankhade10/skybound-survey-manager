
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { navigationItems } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={cn(
        "h-screen bg-drone-navy text-white flex flex-col transition-all duration-300 border-r border-drone-navy/10",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {!collapsed && (
          <h1 className="text-lg font-semibold">
            <span className="text-drone-lightTeal">Drone</span>Survey
          </h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-white hover:bg-white/10 rounded-full ml-auto"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center p-2 rounded-md transition-colors",
                location.pathname === item.path
                  ? "bg-white/20 text-drone-lightTeal"
                  : "text-white/80 hover:bg-white/10 hover:text-white",
                collapsed ? "justify-center" : "justify-start"
              )}
            >
              <item.icon size={20} className={collapsed ? "mx-auto" : "mr-3"} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-white/10">
        {!collapsed && (
          <div className="text-xs text-white/60">
            DroneVision v1.0
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
