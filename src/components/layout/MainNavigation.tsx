
import React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Heart, 
  Pill, 
  ClipboardList, 
  LogOut, 
  User, 
  Menu, 
  X, 
  FileText,
  Settings,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function MainNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, userName, signOut } = useAuth();
  const location = useLocation();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Fetch user avatar
  useEffect(() => {
    const fetchAvatar = async () => {
      if (!user) return;
      
      try {
        const { data } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', user.id)
          .single();
          
        if (data?.avatar_url) {
          const { data: fileData } = await supabase.storage
            .from('avatars')
            .download(data.avatar_url);
            
          if (fileData) {
            const url = URL.createObjectURL(fileData);
            setAvatarUrl(url);
          }
        }
      } catch (error) {
        console.error("Error fetching avatar:", error);
      }
    };
    
    fetchAvatar();
  }, [user]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = () => {
    signOut();
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
              <div className="h-8 w-8 mr-2">
                <img 
                  src="/doctor-icon.png" 
                  alt="SymptomSense" 
                  className="h-full w-full" 
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg">SymptomSense</span>
                <span className="text-xs text-muted-foreground">AI Health Assistant</span>
              </div>
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full ml-2" title={userName || user.email || "User"}>
                      <Avatar className="h-9 w-9">
                        {avatarUrl ? (
                          <AvatarImage src={avatarUrl} />
                        ) : (
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {userName ? userName.charAt(0).toUpperCase() : "U"}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex flex-col space-y-1 leading-none p-2">
                      <p className="font-medium">{userName || "User"}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer flex w-full items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Profile Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer text-destructive focus:text-destructive"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
            
            {user && (
              <Link to="/profile">
                <Avatar className="h-8 w-8">
                  {avatarUrl ? (
                    <AvatarImage src={avatarUrl} />
                  ) : (
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {userName ? userName.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
              </Link>
            )}
            
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
                <>
                  <Link
                    to="/profile"
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-accent"
                  >
                    <Settings className="mr-2 h-5 w-5" />
                    Profile Settings
                  </Link>
                  <Button 
                    variant="ghost" 
                    onClick={handleSignOut} 
                    className="flex items-center w-full px-3 py-2 text-left text-destructive hover:bg-accent"
                  >
                    <LogOut className="mr-2 h-5 w-5" />
                    Logout
                  </Button>
                </>
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
