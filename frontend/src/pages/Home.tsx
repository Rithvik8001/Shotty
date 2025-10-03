import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Nav from "@/components/header/nav";
import { Link2, BarChart3, Shield } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full h-full">
      <Nav />

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-4xl w-full space-y-8 text-center">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              Shorten URLs.
              <br />
              Track Performance.
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Create short, memorable links and track every click with detailed analytics.
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              size="lg"
              className="px-8"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-16">
            <div className="space-y-2">
              <div className="flex justify-center">
                <div className="p-3 rounded-lg bg-secondary">
                  <Link2 className="h-6 w-6" />
                </div>
              </div>
              <h3 className="font-semibold">Simple & Fast</h3>
              <p className="text-sm text-muted-foreground">
                Create short links in seconds with our intuitive interface.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-center">
                <div className="p-3 rounded-lg bg-secondary">
                  <BarChart3 className="h-6 w-6" />
                </div>
              </div>
              <h3 className="font-semibold">Track Clicks</h3>
              <p className="text-sm text-muted-foreground">
                Monitor your link performance with real-time click tracking.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-center">
                <div className="p-3 rounded-lg bg-secondary">
                  <Shield className="h-6 w-6" />
                </div>
              </div>
              <h3 className="font-semibold">Secure & Reliable</h3>
              <p className="text-sm text-muted-foreground">
                Advanced security checks to protect you from malicious links.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
