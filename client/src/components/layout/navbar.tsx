
import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function Navbar() {
  const [location, navigate] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout, isAdmin } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({ title: "Logged out", description: "You have been logged out." });
      navigate("/login");
    } catch (error) {
      toast({ title: "Logout error", description: "Failed to log out.", variant: "destructive" });
      navigate("/login");
    }
  };

  const navigation = [
    { name: "Careers", href: "/careers" },
    { name: "Internships", href: "/internships" },
    { name: "Courses", href: "/courses" },
    { name: "CV Showcase", href: "/cv-showcase" },
    { name: "Directory", href: "/directory" },
    { name: "Community Benefits", href: "/community-benefits" },
    { name: "Upload CV", href: "/cv-upload" },
    { name: "Admin", href: "/admin" },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return location === "/";
    }
    return location.startsWith(href);
  };

  const handleNavigation = (href: string) => {
    navigate(href);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-muted/95 backdrop-blur-sm border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <button 
              onClick={() => handleNavigation("/")} 
              className="flex items-center cursor-pointer text-xl font-bold text-primary hover:text-primary/80 transition-colors"
            >
              HubWithin
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 flex-1 justify-center">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className={`nav-link ${isActive(item.href) ? 'active' : ''} cursor-pointer whitespace-nowrap px-4 py-2 rounded-md font-medium transition-colors ${
                  isActive(item.href) 
                    ? 'text-primary font-semibold bg-primary/10' 
                    : 'text-foreground hover:text-primary'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Logout Button */}
          <div className="flex-shrink-0 ml-6">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 px-4 py-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-muted">
            <div className="px-4 py-3 space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`block w-full text-left nav-link ${isActive(item.href) ? 'active' : ''} cursor-pointer px-4 py-3 rounded-md font-medium transition-colors ${
                    isActive(item.href) 
                      ? 'text-primary font-semibold bg-primary/10' 
                      : 'text-foreground hover:text-primary'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              <div className="pt-3 mt-3 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-3"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
