
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 p-6 overflow-auto bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-white rounded-lg border shadow-sm">
          <MapPin className="mx-auto h-12 w-12 text-drone-teal mb-4" />
          <h1 className="text-3xl font-bold mb-2 text-drone-navy">404</h1>
          <p className="text-xl text-gray-600 mb-6">
            This location is off the map
          </p>
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved to another location.
          </p>
          <Button asChild className="bg-drone-teal hover:bg-drone-teal/90">
            <Link to="/">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
