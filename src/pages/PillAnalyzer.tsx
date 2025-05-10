
import { useState } from "react";
import { PillImageUploader } from "@/components/pill-analyzer/PillImageUploader";
import { PillAnalysisResult as PillResultComponent } from "@/components/pill-analyzer/PillAnalysisResult";
import { PillAnalysisResult } from "@/types/health";
import { useToast } from "@/hooks/use-toast";
import { analyzePill } from "@/services/healthService";

const PillAnalyzer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PillAnalysisResult | null>(null);
  const { toast } = useToast();

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

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {!analysisResult ? (
        <PillImageUploader onAnalyze={handleAnalyzePill} isLoading={isLoading} />
      ) : (
        <PillResultComponent result={analysisResult} onReset={handleReset} />
      )}
    </div>
  );
};

export default PillAnalyzer;
