
import { useLocation } from "react-router-dom";
import { navigationItems } from "@/lib/mockData";
import { BellIcon, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Header = () => {
  const location = useLocation();
  
  // Get current page title based on path
  const getCurrentPageTitle = () => {
    const currentItem = navigationItems.find(item => item.path === location.pathname);
    return currentItem ? currentItem.name : "Dashboard";
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-drone-navy">
        {getCurrentPageTitle()}
      </h1>
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon">
          <BellIcon size={20} className="text-gray-500" />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings size={20} className="text-gray-500" />
        </Button>
        
        <div className="flex items-center">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-drone-teal text-white">JS</AvatarFallback>
          </Avatar>
          <div className="ml-2">
            <p className="text-sm font-medium">John Smith</p>
            <p className="text-xs text-gray-500">Facility Manager</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
