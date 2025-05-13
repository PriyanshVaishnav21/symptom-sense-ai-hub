
import React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Heart, 
  Pill, 
  ClipboardList, 
  LogOut, 
  User, 
  Menu, 
  X, 
  FileText 
} from "lucide-react";

export function MainNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  
  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Navigation links configuration
  const navLinks = [
    { path: "/", name: "Home", icon: <Heart className="mr-2 h-5 w-5" />, public: true },
    { 
      path: "/symptom-checker", 
      name: "Symptom Checker", 
      icon: <ClipboardList className="mr-2 h-5 w-5" />,
      public: false
    },
    { 
      path: "/pill-analyzer", 
      name: "Pill Analyzer", 
      icon: <Pill className="mr-2 h-5 w-5" />, 
      public: false 
    },
    { 
      path: "/history", 
      name: "History", 
      icon: <User className="mr-2 h-5 w-5" />, 
      public: false 
    },
    { 
      path: "/medical-reports", 
      name: "Medical Reports", 
      icon: <FileText className="mr-2 h-5 w-5" />, 
      public: false 
    },
  ];

  // Filter links based on authentication status
  const filteredNavLinks = navLinks.filter(link => 
    link.public || (user && !link.public)
  );

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-background border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/doctor-icon.png" 
                alt="Health AI Assistant" 
                className="h-8 w-8 mr-2" 
              />
              <span className="font-bold text-lg">Health AI Assistant</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {filteredNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            
            <div className="flex items-center ml-4">
              <ThemeToggle />
              
              {user ? (
                <Button 
                  variant="ghost" 
                  onClick={() => signOut()} 
                  className="ml-3"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only">Logout</span>
                </Button>
              ) : (
                <Link to="/login">
                  <Button variant="default" className="ml-3">
                    Sign in
                  </Button>
                </Link>
              )}
            </div>
          </nav>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-4">
            <ThemeToggle />
            
            <Button variant="ghost" onClick={toggleMobileMenu} size="sm">
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t mt-3">
            <div className="space-y-1">
              {filteredNavLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                    isActive(link.path)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
              
              {user ? (
                <Button 
                  variant="ghost" 
                  onClick={() => signOut()} 
                  className="flex items-center w-full px-3 py-2 text-left"
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Logout
                </Button>
              ) : (
                <Link to="/login" className="block">
                  <Button variant="default" className="w-full mt-2">
                    Sign in
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
