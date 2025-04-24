
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

type MainNavigationProps = {
  isAuthenticated: boolean;
  onSignOut: () => void;
  userName?: string;
};

export function MainNavigation({ isAuthenticated, onSignOut, userName }: MainNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = () => {
    onSignOut();
    setIsMenuOpen(false);
  };

  const getUserInitials = () => {
    if (!userName) return "U";
    return userName.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="border-b bg-white sticky top-0 z-40">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="text-health-primary flex items-center gap-1">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-8 w-8"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                <path d="M12 13v8" />
                <path d="M8 9h8" />
                <path d="M12 5v4" />
              </svg>
              <span className="font-bold text-xl sm:text-2xl tracking-tight hidden sm:block">SymptomSense</span>
            </div>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-health-primary">
            Symptom Checker
          </Link>
          <Link to="/pill-analyzer" className="text-sm font-medium hover:text-health-primary">
            Pill Analyzer
          </Link>
          {isAuthenticated && (
            <Link to="/history" className="text-sm font-medium hover:text-health-primary">
              My History
            </Link>
          )}
        </nav>
        
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-2">
              <Avatar>
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{userName || "User"}</span>
                <button 
                  onClick={onSignOut}
                  className="text-xs text-muted-foreground text-left hover:text-health-primary"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="hidden md:block">
              <Link to="/login">
                <Button className="bg-health-primary">Sign in</Button>
              </Link>
            </div>
          )}
          
          {/* Mobile Menu */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-6 mt-8">
                <Link 
                  to="/" 
                  className="text-lg font-medium" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Symptom Checker
                </Link>
                <Link 
                  to="/pill-analyzer" 
                  className="text-lg font-medium" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pill Analyzer
                </Link>
                {isAuthenticated && (
                  <Link 
                    to="/history" 
                    className="text-lg font-medium" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My History
                  </Link>
                )}
                
                <div className="border-t mt-4 pt-4">
                  {isAuthenticated ? (
                    <>
                      <div className="flex items-center gap-2 mb-4">
                        <Avatar>
                          <AvatarFallback>{getUserInitials()}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{userName || "User"}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={handleSignOut} 
                        className="w-full"
                      >
                        Sign out
                      </Button>
                    </>
                  ) : (
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full bg-health-primary">Sign in</Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
