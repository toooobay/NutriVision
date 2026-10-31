import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import UploadArea from "@/components/UploadArea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Leaf, Award, Lightbulb, Heart, UtensilsCrossed, Sparkles, History, TrendingUp, Clock, Ruler, Flame, BarChart3, CircleDot, ArrowRight, Info, Trash2, ShieldAlert } from "lucide-react";

interface TrafficLightIndicator {
  value: number;
  status: "green" | "yellow" | "red";
  label: string;
  explanation: string;
}

interface HealthierAlternative {
  original: string;
  alternative: string;
  benefit: string;
}

interface DietTipWithExplanation {
  tip: string;
  reason: string;
}

interface DetailedFoodAnalysis {
  foodName: string;
  servingSize: string;
  calories: number;
  glycemicIndex: string;
  allergens: string[];
  quickSummary: string;
  healthScore: number;
  qualityAssessment: string;
  macronutrients: {
    carbs: number;
    carbsPercent: number;
    protein: number;
    proteinPercent: number;
    fat: number;
    fatPercent: number;
    fiber: number;
    fiberPercent: number;
  };
  trafficLight?: {
    sugar: TrafficLightIndicator;
    sodium: TrafficLightIndicator;
    saturatedFat: TrafficLightIndicator;
  };
  healthierAlternatives?: HealthierAlternative[];
  vitaminsAndMinerals: Array<{
    name: string;
    amount: string;
    percentDV?: string;
  }>;
  healthBenefits: string[];
  dietTips: (string | DietTipWithExplanation)[];
  mealContext: string;
  portionAdvice: string;
  confidence: number;
}

type AppState = "upload" | "uploading" | "analyzing" | "processing" | "completed" | "error";

interface HistoryItem extends DetailedFoodAnalysis {
  id: string;
  timestamp: number;
  imageUrl?: string;
}

export default function Home() {
  const [appState, setAppState] = useState<AppState>("upload");
  const [analysisResult, setAnalysisResult] = useState<DetailedFoodAnalysis | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem("nutritionHistory");
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error("Failed to load history:", error);
      localStorage.removeItem("nutritionHistory");
    }
  }, []);

  // Save to daily tracker
  const saveToDailyTracker = (result: DetailedFoodAnalysis) => {
    try {
      const todayKey = new Date().toISOString().split('T')[0];
      const saved = localStorage.getItem("nutrivision_daily_tracker");
      let dailyData = saved ? JSON.parse(saved) : { date: todayKey, entries: [] };
      
      if (dailyData.date !== todayKey) {
        dailyData = { date: todayKey, entries: [] };
      }
      
      const entry = {
        id: Date.now().toString(),
        name: result.foodName,
        calories: result.calories,
        protein: result.macronutrients.protein,
        carbs: result.macronutrients.carbs,
        fat: result.macronutrients.fat,
        timestamp: Date.now()
      };
      
      dailyData.entries.push(entry);
      localStorage.setItem("nutrivision_daily_tracker", JSON.stringify(dailyData));
    } catch (error) {
      console.error("Failed to save to daily tracker:", error);
    }
  };

  // Save to history
  const saveToHistory = (result: DetailedFoodAnalysis, imageUrl?: string) => {
    try {
      const historyItem: HistoryItem = {
        ...result,
        id: Date.now().toString(),
        timestamp: Date.now(),
        imageUrl,
      };
      const newHistory = [historyItem, ...history].slice(0, 10); // Keep last 10
      setHistory(newHistory);
      localStorage.setItem("nutritionHistory", JSON.stringify(newHistory));
      
      // Also save to daily tracker
      saveToDailyTracker(result);
    } catch (error) {
      console.error("Failed to save history:", error);
      // If quota exceeded, try without image
      try {
        const historyItem: HistoryItem = {
          ...result,
          id: Date.now().toString(),
          timestamp: Date.now(),
        };
        const newHistory = [historyItem, ...history].slice(0, 10);
        setHistory(newHistory);
        localStorage.setItem("nutritionHistory", JSON.stringify(newHistory));
        
        // Still try to save to daily tracker
        saveToDailyTracker(result);
      } catch {
        console.error("Failed to save history even without image");
      }
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

  const handleFileUpload = async (file: File) => {
    console.log("File uploaded:", file.name);
    
    setAppState("uploading");
    setTargetProgress(10);
    
    try {
      // Convert image to data URL for persistent storage
      const dataUrl = await readFileAsDataURL(file);
      setUploadedImage(dataUrl);
      
      const formData = new FormData();
      formData.append('image', file);
      
      setAppState("analyzing");
      setTargetProgress(30);
      
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        body: formData,
      });
      
      setTargetProgress(70);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze food');
      }
      
      setAppState("processing");
      setTargetProgress(90);
      
      const result = await response.json();
      setAnalysisResult(result);
      saveToHistory(result, dataUrl);
      
      setTargetProgress(100);
      setTimeout(() => setAppState("completed"), 300);
    } catch (error) {
      console.error("Analysis failed:", error);
      setErrorMessage(error instanceof Error ? error.message : "Terjadi kesalahan");
      setAppState("error");
    }
  };

  const resetAnalysis = () => {
    setAppState("upload");
    setAnalysisResult(null);
    setErrorMessage("");
    setUploadedImage(null);
    setAnalysisProgress(0);
    setTargetProgress(0);
  };

  const loadFromHistory = (item: HistoryItem) => {
    setAnalysisResult(item);
    setUploadedImage(item.imageUrl || null);
    setAppState("completed");
    setShowHistory(false);
  };

  const clearAllHistory = () => {
    setHistory([]);
    localStorage.removeItem("nutritionHistory");
    setShowHistory(false);
  };

  // Smooth progress animation
  const [targetProgress, setTargetProgress] = useState(0);
  
  useEffect(() => {
    if (targetProgress === 0) {
      setAnalysisProgress(0);
      return;
    }
    
    const animateProgress = () => {
      setAnalysisProgress(prev => {
        if (prev >= targetProgress) return targetProgress;
        const step = Math.max(1, Math.floor((targetProgress - prev) / 10));
        return Math.min(prev + step, targetProgress);
      });
    };
    
    const interval = setInterval(animateProgress, 50);
    return () => clearInterval(interval);
  }, [targetProgress]);

  const getHealthScoreColor = (score: number) => {
    if (score >= 8) return "bg-green-100 text-green-800 border-green-300";
    if (score >= 6) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    return "bg-red-100 text-red-800 border-red-300";
  };

  const getTrafficLightColor = (status: "green" | "yellow" | "red") => {
    switch (status) {
      case "green": return "bg-green-500";
      case "yellow": return "bg-yellow-500";
      case "red": return "bg-red-500";
    }
  };

  const getTrafficLightBgColor = (status: "green" | "yellow" | "red") => {
    switch (status) {
      case "green": return "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800";
      case "yellow": return "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800";
      case "red": return "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800";
    }
  };

  const getEmergencyWarnings = (result: DetailedFoodAnalysis) => {
    const warnings: Array<{ title: string; message: string; severity: 'high' | 'critical' }> = [];
    
    if (result.trafficLight) {
      if (result.trafficLight.sugar.status === "red" && result.trafficLight.sugar.value > 25) {
        warnings.push({
          title: "Gula Sangat Tinggi",
          message: `Kandungan gula ${result.trafficLight.sugar.value}g sangat tinggi. Berbahaya untuk penderita diabetes dan dapat meningkatkan risiko obesitas.`,
          severity: result.trafficLight.sugar.value > 40 ? 'critical' : 'high'
        });
      }
      if (result.trafficLight.sodium.status === "red" && result.trafficLight.sodium.value > 600) {
        warnings.push({
          title: "Natrium Sangat Tinggi",
          message: `Kandungan natrium ${result.trafficLight.sodium.value}mg tinggi. Berbahaya untuk penderita hipertensi dan dapat menyebabkan retensi cairan.`,
          severity: result.trafficLight.sodium.value > 1000 ? 'critical' : 'high'
        });
      }
      if (result.trafficLight.saturatedFat.status === "red" && result.trafficLight.saturatedFat.value > 10) {
        warnings.push({
          title: "Lemak Jenuh Tinggi",
          message: `Kandungan lemak jenuh ${result.trafficLight.saturatedFat.value}g tinggi. Dapat meningkatkan kolesterol LDL dan risiko penyakit jantung.`,
          severity: result.trafficLight.saturatedFat.value > 15 ? 'critical' : 'high'
        });
      }
    }
    
    if (result.calories > 800) {
      warnings.push({
        title: "Kalori Sangat Tinggi",
        message: `Makanan ini mengandung ${result.calories} kkal. Lebih dari 40% kebutuhan kalori harian rata-rata dalam satu porsi.`,
        severity: result.calories > 1200 ? 'critical' : 'high'
      });
    }
    
    return warnings;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center justify-between mb-4">
          <BackButton />
          {history.length > 0 && appState === "upload" && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              data-testid="button-toggle-history"
            >
              <History className="w-4 h-4 mr-2" />
              Riwayat ({history.length})
            </Button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {appState === "upload" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {!showHistory ? (
                <>
                  <div className="text-center space-y-2">
                    <motion.h2 
                      className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      Analisis Nutrisi Makanan
                    </motion.h2>
                    <motion.p 
                      className="text-muted-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      Upload foto makanan untuk mendapatkan analisis nutrisi lengkap dengan AI
                    </motion.p>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <UploadArea
                      onFileUpload={handleFileUpload}
                    />
                  </motion.div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h2 className="text-2xl font-bold">Riwayat Analisis</h2>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={clearAllHistory}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                        data-testid="button-clear-history"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Hapus Semua
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowHistory(false)}
                      >
                        Tutup
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-4">
                    {history.map((item) => (
                      <Card 
                        key={item.id} 
                        className="hover-elevate cursor-pointer transition-all"
                        onClick={() => loadFromHistory(item)}
                        data-testid={`history-item-${item.id}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            {item.imageUrl && (
                              <img 
                                src={item.imageUrl} 
                                alt={item.foodName}
                                className="w-20 h-20 rounded-lg object-cover"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold truncate">{item.foodName}</h3>
                              <p className="text-sm text-muted-foreground truncate">
                                {item.servingSize} • {item.calories} kkal
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge 
                                  variant="outline" 
                                  className={`${getHealthScoreColor(item.healthScore)}`}
                                >
                                  {item.healthScore}/10
                                </Badge>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(item.timestamp).toLocaleDateString('id-ID')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {(appState === "uploading" || appState === "analyzing" || appState === "processing") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {uploadedImage && (
              <Card className="overflow-hidden">
                <div className="relative">
                  <img 
                    src={uploadedImage} 
                    alt="Food being analyzed" 
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <motion.div 
                    className="absolute inset-0 bg-primary/10"
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge className="bg-primary/90 backdrop-blur-sm">
                      <Sparkles className="w-3 h-3 mr-1 animate-spin" style={{ animationDuration: '2s' }} />
                      Menganalisis dengan AI
                    </Badge>
                  </div>
                </div>
              </Card>
            )}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center relative overflow-hidden">
                    <TrendingUp className="w-7 h-7 text-primary animate-spin" style={{ animationDuration: '3s' }} />
                  </div>
                  <h3 className="font-semibold text-lg">
                    {appState === "uploading" ? "Mengunggah foto..." :
                     appState === "analyzing" ? "Menganalisis nutrisi..." :
                     "Memproses hasil..."}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {appState === "uploading" ? "Menyiapkan gambar untuk analisis" :
                     appState === "analyzing" ? "AI sedang mengidentifikasi makanan dan nutrisi" :
                     "Menyusun hasil analisis lengkap"}
                  </p>
                </div>
                <div className="space-y-3">
                  <Progress value={analysisProgress} className="h-3" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{analysisProgress}% selesai</span>
                    <span>Mohon tunggu...</span>
                  </div>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-primary animate-pulse"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {appState === "error" && (
          <Card className="border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-red-600">
                <AlertTriangle className="w-6 h-6" />
                <div>
                  <h3 className="font-semibold">Terjadi Kesalahan</h3>
                  <p className="text-sm">{errorMessage || "Terjadi kesalahan saat menganalisis makanan. Silakan coba lagi."}</p>
                </div>
              </div>
              <Button 
                onClick={resetAnalysis}
                className="mt-4 w-full"
                data-testid="button-try-again"
              >
                Coba Lagi
              </Button>
            </CardContent>
          </Card>
        )}

        {appState === "completed" && analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {uploadedImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="overflow-hidden">
                  <img 
                    src={uploadedImage} 
                    alt="Analyzed food" 
                    className="w-full h-48 object-cover"
                  />
                </Card>
              </motion.div>
            )}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Hasil Analisis</h2>
              <Button 
                onClick={resetAnalysis}
                variant="outline"
                data-testid="button-new-analysis"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Analisis Foto Baru
              </Button>
            </div>

            {/* Food Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2" data-testid="text-food-name">
                      {analysisResult.foodName}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
                      <span data-testid="text-serving-size" className="flex items-center gap-1">
                        <Ruler className="w-3 h-3" />
                        {analysisResult.servingSize}
                      </span>
                      <span>•</span>
                      <span data-testid="text-calories" className="flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        {analysisResult.calories} kkal
                      </span>
                      <span>•</span>
                      <span data-testid="text-glycemic-index" className="flex items-center gap-1">
                        <BarChart3 className="w-3 h-3" />
                        GI: {analysisResult.glycemicIndex}
                      </span>
                    </div>
                    {analysisResult.allergens.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1 items-center">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Alergen:
                        </span>
                        {analysisResult.allergens.map((allergen, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {allergen}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <Badge 
                    className={`px-4 py-2 text-lg font-bold ${getHealthScoreColor(analysisResult.healthScore)}`}
                    data-testid="badge-health-score"
                  >
                    {analysisResult.healthScore}/10
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground" data-testid="text-quick-summary">
                  {analysisResult.quickSummary}
                </p>
              </CardContent>
            </Card>
            </motion.div>

            {/* Emergency Warnings */}
            {getEmergencyWarnings(analysisResult).length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 }}
              >
              <Card className="border-2 border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-950/50" data-testid="card-warnings">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                    <ShieldAlert className="w-5 h-5" />
                    Peringatan Kesehatan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getEmergencyWarnings(analysisResult).map((warning, index) => (
                      <div 
                        key={index} 
                        className={`p-3 rounded-lg border ${
                          warning.severity === 'critical' 
                            ? 'bg-red-100 border-red-400 dark:bg-red-900/50 dark:border-red-600' 
                            : 'bg-orange-100 border-orange-300 dark:bg-orange-900/50 dark:border-orange-600'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <AlertTriangle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                            warning.severity === 'critical' ? 'text-red-600' : 'text-orange-600'
                          }`} />
                          <div>
                            <p className={`font-semibold text-sm ${
                              warning.severity === 'critical' ? 'text-red-800 dark:text-red-300' : 'text-orange-800 dark:text-orange-300'
                            }`}>
                              {warning.title}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {warning.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              </motion.div>
            )}

            {/* Quality Assessment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
            <Card className="hover-elevate" data-testid="card-quality"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Penilaian Kualitas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm" data-testid="text-quality-assessment">{analysisResult.qualityAssessment}</p>
              </CardContent>
            </Card>
            </motion.div>

            {/* Macronutrients */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
            <Card className="hover-elevate"data-testid="card-macros"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UtensilsCrossed className="w-5 h-5 text-primary" />
                  Makronutrien
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Karbohidrat</p>
                    <p className="text-lg font-semibold" data-testid="text-carbs">
                      {analysisResult.macronutrients.carbs}g ({analysisResult.macronutrients.carbsPercent}%)
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Protein</p>
                    <p className="text-lg font-semibold" data-testid="text-protein">
                      {analysisResult.macronutrients.protein}g ({analysisResult.macronutrients.proteinPercent}%)
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Lemak</p>
                    <p className="text-lg font-semibold" data-testid="text-fat">
                      {analysisResult.macronutrients.fat}g ({analysisResult.macronutrients.fatPercent}%)
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Serat</p>
                    <p className="text-lg font-semibold" data-testid="text-fiber">
                      {analysisResult.macronutrients.fiber}g ({analysisResult.macronutrients.fiberPercent}%)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            </motion.div>

            {/* Traffic Light Indicators */}
            {analysisResult.trafficLight && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
              <Card className="hover-elevate" data-testid="card-traffic-light">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CircleDot className="w-5 h-5 text-primary" />
                    Status Nutrisi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Sugar */}
                    <div className={`p-4 rounded-lg border ${getTrafficLightBgColor(analysisResult.trafficLight.sugar.status)}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-4 h-4 rounded-full ${getTrafficLightColor(analysisResult.trafficLight.sugar.status)}`} />
                        <span className="font-semibold">Gula</span>
                      </div>
                      <p className="text-2xl font-bold">{analysisResult.trafficLight.sugar.value}g</p>
                      <Badge variant="outline" className="mt-2">{analysisResult.trafficLight.sugar.label}</Badge>
                      <p className="text-xs text-muted-foreground mt-2">{analysisResult.trafficLight.sugar.explanation}</p>
                    </div>
                    {/* Sodium */}
                    <div className={`p-4 rounded-lg border ${getTrafficLightBgColor(analysisResult.trafficLight.sodium.status)}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-4 h-4 rounded-full ${getTrafficLightColor(analysisResult.trafficLight.sodium.status)}`} />
                        <span className="font-semibold">Natrium</span>
                      </div>
                      <p className="text-2xl font-bold">{analysisResult.trafficLight.sodium.value}mg</p>
                      <Badge variant="outline" className="mt-2">{analysisResult.trafficLight.sodium.label}</Badge>
                      <p className="text-xs text-muted-foreground mt-2">{analysisResult.trafficLight.sodium.explanation}</p>
                    </div>
                    {/* Saturated Fat */}
                    <div className={`p-4 rounded-lg border ${getTrafficLightBgColor(analysisResult.trafficLight.saturatedFat.status)}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-4 h-4 rounded-full ${getTrafficLightColor(analysisResult.trafficLight.saturatedFat.status)}`} />
                        <span className="font-semibold">Lemak Jenuh</span>
                      </div>
                      <p className="text-2xl font-bold">{analysisResult.trafficLight.saturatedFat.value}g</p>
                      <Badge variant="outline" className="mt-2">{analysisResult.trafficLight.saturatedFat.label}</Badge>
                      <p className="text-xs text-muted-foreground mt-2">{analysisResult.trafficLight.saturatedFat.explanation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </motion.div>
            )}

            {/* Healthier Alternatives */}
            {analysisResult.healthierAlternatives && analysisResult.healthierAlternatives.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.37 }}
              >
              <Card className="hover-elevate border-green-200 dark:border-green-800" data-testid="card-alternatives">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <Leaf className="w-5 h-5" />
                    Alternatif Lebih Sehat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysisResult.healthierAlternatives.map((alt, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950">
                        <span className="text-sm font-medium text-muted-foreground">{alt.original}</span>
                        <ArrowRight className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm font-semibold text-green-700 dark:text-green-400">{alt.alternative}</span>
                        <span className="text-xs text-muted-foreground ml-auto">({alt.benefit})</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              </motion.div>
            )}

            {/* Vitamins & Minerals */}
            {analysisResult.vitaminsAndMinerals.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
              <Card className="hover-elevate"data-testid="card-vitamins"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-green-600" />
                    Vitamin & Mineral
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {analysisResult.vitaminsAndMinerals.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 rounded-lg bg-muted/50">
                        <span className="font-medium text-sm">{item.name}</span>
                        <div className="text-right">
                          <span className="text-sm font-semibold">{item.amount}</span>
                          {item.percentDV && (
                            <span className="text-xs text-muted-foreground ml-1">({item.percentDV})</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              </motion.div>
            )}

            {/* Health Benefits */}
            {analysisResult.healthBenefits.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
              <Card className="hover-elevate" data-testid="card-benefits">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    Manfaat Kesehatan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysisResult.healthBenefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Heart className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              </motion.div>
            )}

            {/* Diet Tips with Explanations */}
            {analysisResult.dietTips.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
              <Card className="hover-elevate" data-testid="card-tips">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-600" />
                    Tips Diet & Nutrisi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {analysisResult.dietTips.map((tipItem, index) => {
                      const tip = typeof tipItem === 'string' ? tipItem : tipItem.tip;
                      const reason = typeof tipItem === 'string' ? '' : tipItem.reason;
                      return (
                        <li key={index} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{tip}</p>
                            {reason && (
                              <p className="text-xs text-muted-foreground mt-1 flex items-start gap-1">
                                <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                {reason}
                              </p>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
              </motion.div>
            )}

            {/* Meal Context & Portion Advice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
            <Card className="hover-elevate" data-testid="card-recommendations">
              <CardHeader>
                <CardTitle>Rekomendasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Waktu Makan Ideal</h4>
                  <p className="text-sm text-muted-foreground">{analysisResult.mealContext}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">Saran Porsi</h4>
                  <p className="text-sm text-muted-foreground">{analysisResult.portionAdvice}</p>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    Tingkat kepercayaan analisis: {analysisResult.confidence}%
                  </p>
                </div>
              </CardContent>
            </Card>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
