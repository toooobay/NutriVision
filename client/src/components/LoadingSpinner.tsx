import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Brain, Utensils, BarChart3 } from "lucide-react";

interface LoadingSpinnerProps {
  stage: "uploading" | "analyzing" | "processing" | "complete";
  message?: string;
}

export default function LoadingSpinner({ stage, message }: LoadingSpinnerProps) {
  const stages = [
    { key: "uploading", label: "Mengunggah foto", icon: Utensils },
    { key: "analyzing", label: "Menganalisis makanan", icon: Brain },
    { key: "processing", label: "Menghitung nutrisi", icon: BarChart3 }
  ];

  const getCurrentStageIndex = () => {
    return stages.findIndex(s => s.key === stage);
  };

  const currentIndex = getCurrentStageIndex();

  return (
    <Card>
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          <div className="relative">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Memproses Analisis AI</h3>
            
            {message && (
              <p className="text-sm text-muted-foreground">{message}</p>
            )}
            
            <div className="space-y-3">
              {stages.map((stageItem, index) => {
                const Icon = stageItem.icon;
                const isActive = index === currentIndex;
                const isCompleted = index < currentIndex;
                
                return (
                  <div 
                    key={stageItem.key}
                    className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                      isActive ? "bg-primary/10 text-primary" : 
                      isCompleted ? "text-muted-foreground" : "text-muted-foreground/50"
                    }`}
                  >
                    <div className={`p-1 rounded-full ${
                      isActive ? "bg-primary text-white" : 
                      isCompleted ? "bg-green-500 text-white" : "bg-muted"
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">{stageItem.label}</span>
                    {isActive && (
                      <Loader2 className="w-4 h-4 animate-spin ml-auto" />
                    )}
                    {isCompleted && (
                      <span className="ml-auto text-green-500">✓</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}