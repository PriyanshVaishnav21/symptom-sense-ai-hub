
import React from "react";
import { Link } from "react-router-dom";

export function AppLogo() {
  return (
    <Link to="/" className="flex items-center">
      <div className="h-10 w-10 mr-2 flex-shrink-0">
        <img 
          src="/doctor-icon.png" 
          alt="SymptomSense" 
          className="h-full w-full object-contain"
        />
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-lg">SymptomSense</span>
        <span className="text-xs text-muted-foreground">AI Health Assistant</span>
      </div>
    </Link>
  );
}
