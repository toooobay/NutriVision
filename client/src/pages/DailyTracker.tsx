import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUserProfile, type UserProfile } from "@/components/UserProfileModal";
import { Flame, Drumstick, Wheat, Droplets, Plus, Trash2, Calendar, Target, AlertTriangle, CheckCircle } from "lucide-react";

interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: number;
}

interface DailyData {
  date: string;
  entries: FoodEntry[];
}

const LOCAL_STORAGE_KEY = "nutrivision_daily_tracker";

function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

function loadDailyData(): DailyData {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved) as DailyData;
      if (data.date === getTodayKey()) {
        return data;
      }
    }
  } catch {}
  return { date: getTodayKey(), entries: [] };
}

function saveDailyData(data: DailyData): void {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
}

export default function DailyTracker() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dailyData, setDailyData] = useState<DailyData>(() => loadDailyData());
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    name: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });

  useEffect(() => {
    const userProfile = getUserProfile();
    setProfile(userProfile);
  }, []);

  useEffect(() => {
    saveDailyData(dailyData);
  }, [dailyData]);

  const totals = dailyData.entries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fat: acc.fat + entry.fat
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const targets = profile ? {
    calories: profile.dailyCalorieTarget || 2000,
    protein: profile.dailyProteinTarget || 60,
    carbs: profile.dailyCarbsTarget || 250,
    fat: profile.dailyFatTarget || 65
  } : {
    calories: 2000,
    protein: 60,
    carbs: 250,
    fat: 65
  };

  const getProgressPercent = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (percent: number) => {
    if (percent >= 100) return "bg-green-500";
    if (percent >= 75) return "bg-yellow-500";
    return "bg-primary";
  };

  const getStatusBadge = (percent: number) => {
    if (percent >= 100) return { text: "Tercapai", variant: "default" as const, className: "bg-green-600" };
    if (percent >= 75) return { text: "Hampir", variant: "outline" as const, className: "text-yellow-600 border-yellow-600" };
    return { text: "Dalam Progress", variant: "outline" as const, className: "" };
  };

  const handleAddEntry = () => {
    if (!newEntry.name) return;
    
    const entry: FoodEntry = {
      id: Date.now().toString(),
      ...newEntry,
      timestamp: Date.now()
    };
    
    setDailyData(prev => ({
      ...prev,
      entries: [...prev.entries, entry]
    }));
    
    setNewEntry({ name: "", calories: 0, protein: 0, carbs: 0, fat: 0 });
    setShowAddForm(false);
  };

  const handleDeleteEntry = (id: string) => {
    setDailyData(prev => ({
      ...prev,
      entries: prev.entries.filter(e => e.id !== id)
    }));
  };

  const handleClearAll = () => {
    setDailyData({ date: getTodayKey(), entries: [] });
  };

  const nutrientCards = [
    { key: "calories", label: "Kalori", icon: Flame, unit: "kkal", color: "text-orange-500", current: totals.calories, target: targets.calories },
    { key: "protein", label: "Protein", icon: Drumstick, unit: "g", color: "text-red-500", current: totals.protein, target: targets.protein },
    { key: "carbs", label: "Karbohidrat", icon: Wheat, unit: "g", color: "text-amber-600", current: totals.carbs, target: targets.carbs },
    { key: "fat", label: "Lemak", icon: Droplets, unit: "g", color: "text-blue-500", current: totals.fat, target: targets.fat }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-4">
          <BackButton />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Tracker Nutrisi Harian
            </h2>
            <p className="text-muted-foreground flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {!profile && (
            <Card className="border-orange-300 bg-orange-50 dark:bg-orange-950/30">
              <CardContent className="py-4 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="font-medium text-sm">Profil Belum Diatur</p>
                  <p className="text-xs text-muted-foreground">Klik tombol pengaturan di header untuk mengatur profil diet Anda</p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {nutrientCards.map((nutrient) => {
              const percent = getProgressPercent(nutrient.current, nutrient.target);
              const status = getStatusBadge(percent);
              
              return (
                <motion.div
                  key={nutrient.key}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="hover-elevate" data-testid={`card-${nutrient.key}`}>
                    <CardContent className="pt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <nutrient.icon className={`w-5 h-5 ${nutrient.color}`} />
                        {percent >= 100 && <CheckCircle className="w-4 h-4 text-green-500" />}
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{nutrient.label}</p>
                        <p className="text-xl font-bold">
                          {nutrient.current}
                          <span className="text-sm font-normal text-muted-foreground">/{nutrient.target}{nutrient.unit}</span>
                        </p>
                      </div>
                      <Progress 
                        value={percent} 
                        className="h-2"
                      />
                      <Badge variant={status.variant} className={`text-xs ${status.className}`}>
                        {Math.round(percent)}%
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Makanan Hari Ini
                </CardTitle>
                <div className="flex gap-2">
                  {dailyData.entries.length > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleClearAll}
                      className="text-red-600"
                      data-testid="button-clear-daily"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Hapus Semua
                    </Button>
                  )}
                  <Button 
                    size="sm"
                    onClick={() => setShowAddForm(!showAddForm)}
                    data-testid="button-add-food"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Tambah Manual
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {showAddForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="p-4 rounded-lg border bg-muted/30 space-y-3"
                >
                  <div className="space-y-2">
                    <Label htmlFor="foodName">Nama Makanan</Label>
                    <Input
                      id="foodName"
                      value={newEntry.name}
                      onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })}
                      placeholder="Contoh: Nasi Goreng"
                      data-testid="input-food-name"
                    />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="calories" className="text-xs">Kalori (kkal)</Label>
                      <Input
                        id="calories"
                        type="number"
                        value={newEntry.calories}
                        onChange={(e) => setNewEntry({ ...newEntry, calories: parseInt(e.target.value) || 0 })}
                        data-testid="input-calories"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="protein" className="text-xs">Protein (g)</Label>
                      <Input
                        id="protein"
                        type="number"
                        value={newEntry.protein}
                        onChange={(e) => setNewEntry({ ...newEntry, protein: parseInt(e.target.value) || 0 })}
                        data-testid="input-protein"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="carbs" className="text-xs">Karbo (g)</Label>
                      <Input
                        id="carbs"
                        type="number"
                        value={newEntry.carbs}
                        onChange={(e) => setNewEntry({ ...newEntry, carbs: parseInt(e.target.value) || 0 })}
                        data-testid="input-carbs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="fat" className="text-xs">Lemak (g)</Label>
                      <Input
                        id="fat"
                        type="number"
                        value={newEntry.fat}
                        onChange={(e) => setNewEntry({ ...newEntry, fat: parseInt(e.target.value) || 0 })}
                        data-testid="input-fat"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddEntry} className="flex-1" data-testid="button-confirm-add">
                      Tambahkan
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddForm(false)}>
                      Batal
                    </Button>
                  </div>
                </motion.div>
              )}

              {dailyData.entries.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Belum ada makanan dicatat hari ini</p>
                  <p className="text-sm">Gunakan fitur Analisis Makanan atau tambah manual</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {dailyData.entries.map((entry) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{entry.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {entry.calories}kkal • P:{entry.protein}g • K:{entry.carbs}g • L:{entry.fat}g
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                        data-testid={`button-delete-${entry.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-muted/30">
            <CardContent className="py-4 text-center text-sm text-muted-foreground">
              <p>
                Tip: Hasil dari Analisis Makanan dapat ditambahkan ke tracker ini secara otomatis di masa mendatang.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
