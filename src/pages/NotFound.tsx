
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="flex justify-center mb-6">
          <AlertCircle className="h-16 w-16 text-red-500" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Page Not Found</h1>
        <p className="text-xl text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link to="/">Return to Home</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
