
import { useState } from "react";
import { PillImageUploader } from "@/components/pill-analyzer/PillImageUploader";
import { PillAnalysisResult as PillResultComponent } from "@/components/pill-analyzer/PillAnalysisResult";
import { PillAnalysisResult } from "@/types/health";
import { getMockPillAnalysis } from "@/services/mockHealthData";
import { useToast } from "@/hooks/use-toast";

const PillAnalyzer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PillAnalysisResult | null>(null);
  const { toast } = useToast();

  const handleAnalyzePill = async (file: File) => {
    setIsLoading(true);
    
    try {
      const result = await getMockPillAnalysis(file);
      setAnalysisResult(result);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze the pill image. Please try again with a clearer image.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
