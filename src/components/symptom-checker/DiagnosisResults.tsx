
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DiagnosisResult, SeverityLevel } from "@/types/health";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, ThumbsDown, ThumbsUp } from "lucide-react";

type DiagnosisResultsProps = {
  results: DiagnosisResult[];
  onSave: () => void;
  onFeedback: (diagnosisId: string, isHelpful: boolean) => void;
  onReset: () => void;
};

export function DiagnosisResults({ results, onSave, onFeedback, onReset }: DiagnosisResultsProps) {
  // Find the highest severity level among all results
  const highestSeverity = results.reduce((highest, result) => {
    const severityOrder: Record<SeverityLevel, number> = {
      mild: 1,
      moderate: 2,
      severe: 3
    };
    
    return severityOrder[result.severity] > severityOrder[highest] 
      ? result.severity 
      : highest;
  }, "mild" as SeverityLevel);

  const getSeverityColor = (severity: SeverityLevel): string => {
    switch (severity) {
      case "mild": return "bg-health-mild";
      case "moderate": return "bg-health-moderate";
      case "severe": return "bg-health-severe";
      default: return "bg-health-mild";
    }
  };

  const getSeverityTextClass = (severity: SeverityLevel): string => {
    switch (severity) {
      case "mild": return "severity-mild";
      case "moderate": return "severity-moderate";
      case "severe": return "severity-severe";
      default: return "severity-mild";
    }
  };

  // Sort results by confidence score (highest first)
  const sortedResults = [...results].sort((a, b) => b.confidenceScore - a.confidenceScore);

  return (
    <div className="space-y-6 animate-fade-in">
      {highestSeverity === "severe" && (
        <Alert className="border-health-severe bg-red-50">
          <AlertTriangle className="h-5 w-5 text-health-severe" />
          <AlertTitle className="text-health-severe font-bold">Urgent Medical Attention Advised</AlertTitle>
          <AlertDescription>
            Our analysis suggests your symptoms may require immediate medical attention.
            Please contact emergency services or visit your nearest emergency room.
          </AlertDescription>
        </Alert>
      )}

      {highestSeverity === "moderate" && (
        <Alert className="border-health-moderate bg-yellow-50">
          <AlertTriangle className="h-5 w-5 text-health-moderate" />
          <AlertTitle className="text-health-moderate font-bold">Medical Consultation Recommended</AlertTitle>
          <AlertDescription>
            Based on your symptoms, we recommend consulting a healthcare professional within the next 24-48 hours.
          </AlertDescription>
        </Alert>
      )}

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-health-primary">Possible Conditions</CardTitle>
          <CardDescription>
            Based on your symptoms, these are potential conditions to consider. 
            This is not a diagnosis and should not replace professional medical advice.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {sortedResults.map((result) => (
            <div key={result.id} className="space-y-3 p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{result.conditionName}</h3>
                <Badge className={`${getSeverityColor(result.severity)} text-white`}>
                  {result.severity.charAt(0).toUpperCase() + result.severity.slice(1)}
                </Badge>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Confidence</span>
                  <span className="font-medium">{result.confidenceScore}%</span>
                </div>
                <Progress value={result.confidenceScore} max={100} className="h-2" />
              </div>
              
              <p className="text-sm text-muted-foreground">{result.description}</p>
              
              <div>
                <h4 className={`text-sm font-semibold mb-1 ${getSeverityTextClass(result.severity)}`}>
                  Advice:
                </h4>
                <p className="text-sm">{result.advice}</p>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs"
                  onClick={() => onFeedback(result.id, true)}
                >
                  <ThumbsUp className="h-3 w-3 mr-1" /> Helpful
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => onFeedback(result.id, false)}
                >
                  <ThumbsDown className="h-3 w-3 mr-1" /> Not Helpful
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onReset}>
            Check New Symptoms
          </Button>
          <Button onClick={onSave} className="bg-health-primary">
            Save Results
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
