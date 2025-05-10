
import { useState } from "react";
import { PillImageUploader } from "@/components/pill-analyzer/PillImageUploader";
import { PillAnalysisResult as PillResultComponent } from "@/components/pill-analyzer/PillAnalysisResult";
import { PillAnalysisResult } from "@/types/health";
import { useToast } from "@/hooks/use-toast";
import { analyzePill } from "@/services/healthService";
import { MainNavigation } from "@/components/layout/MainNavigation";

const PillAnalyzer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PillAnalysisResult | null>(null);
  const { toast } = useToast();
  const [isAuthenticated] = useState(true); // For demo purposes
  const [userName] = useState("John Doe"); // For demo purposes

  const handleAnalyzePill = async (file: File) => {
    setIsLoading(true);
    
    try {
      // Convert file to base64
      const base64Image = await readFileAsDataURL(file);
      
      // Send to OpenAI for analysis
      const result = await analyzePill(base64Image);
      setAnalysisResult(result);
    } catch (error) {
      console.error("Error analyzing pill:", error);
      toast({
        title: "Error",
        description: "Failed to analyze the pill image. Please try again with a clearer image.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleReset = () => {
    setAnalysisResult(null);
  };

  const handleSignOut = () => {
    // This would be handled by the auth context in a real app
  };

  return (
    <div className="min-h-screen flex flex-col bg-health-light dark:bg-gray-900">
      <MainNavigation 
        isAuthenticated={isAuthenticated}
        onSignOut={handleSignOut}
        userName={userName}
      />
      
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 text-health-primary dark:text-health-secondary">Medication Identifier</h1>
          <p className="text-gray-600 dark:text-gray-300">Upload a photo of your medication to identify it and learn about its purpose and proper usage.</p>
        </div>
        
        {!analysisResult ? (
          <PillImageUploader onAnalyze={handleAnalyzePill} isLoading={isLoading} />
        ) : (
          <PillResultComponent result={analysisResult} onReset={handleReset} />
        )}
      </div>
    </div>
  );
};

export default PillAnalyzer;
