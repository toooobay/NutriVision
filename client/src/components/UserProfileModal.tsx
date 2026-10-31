import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, User, Target, Scale, Ruler, Calendar, Sparkles } from "lucide-react";

export interface UserProfile {
  age: number;
  gender: "male" | "female";
  height: number;
  weight: number;
  goal: "diet" | "maintain" | "bulking";
  targetWeight: number;
  targetMonths: number;
  dailyCalorieTarget?: number;
  dailyProteinTarget?: number;
  dailyCarbsTarget?: number;
  dailyFatTarget?: number;
}

interface GoalAnalysis {
  isAchievable: boolean;
  estimatedMonths: number;
  weeklyChange: number;
  dailyCalories: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
  message: string;
}

const LOCAL_STORAGE_KEY = "nutrivision_user_profile";

export function getUserProfile(): UserProfile | null {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
}

function calculateBMR(profile: UserProfile): number {
  if (profile.gender === "male") {
    return 88.362 + (13.397 * profile.weight) + (4.799 * profile.height) - (5.677 * profile.age);
  } else {
    return 447.593 + (9.247 * profile.weight) + (3.098 * profile.height) - (4.330 * profile.age);
  }
}

function analyzeGoal(profile: UserProfile): GoalAnalysis {
  const bmr = calculateBMR(profile);
  const tdee = bmr * 1.55;
  
  const weightDiff = profile.targetWeight - profile.weight;
  const weeklyChange = weightDiff / (profile.targetMonths * 4);
  
  let dailyCalories: number;
  let isAchievable = true;
  let message = "";
  let estimatedMonths = profile.targetMonths;
  
  if (profile.goal === "diet") {
    const calorieDeficit = Math.abs(weeklyChange) * 7700 / 7;
    dailyCalories = Math.max(1200, tdee - calorieDeficit);
    
    if (calorieDeficit > 1000) {
      isAchievable = false;
      estimatedMonths = Math.ceil(Math.abs(weightDiff) / (0.5 * 4));
      message = `Target terlalu cepat. Disarankan turun 0.5kg/minggu. Estimasi realistis: ${estimatedMonths} bulan.`;
      dailyCalories = tdee - 500;
    } else {
      message = `Target dapat dicapai dengan defisit ${Math.round(calorieDeficit)} kkal/hari.`;
    }
  } else if (profile.goal === "bulking") {
    const calorieSurplus = Math.abs(weeklyChange) * 7700 / 7;
    dailyCalories = tdee + calorieSurplus;
    
    if (calorieSurplus > 700) {
      isAchievable = false;
      estimatedMonths = Math.ceil(Math.abs(weightDiff) / (0.3 * 4));
      message = `Target terlalu cepat. Disarankan naik 0.25-0.5kg/minggu. Estimasi realistis: ${estimatedMonths} bulan.`;
      dailyCalories = tdee + 400;
    } else {
      message = `Target dapat dicapai dengan surplus ${Math.round(calorieSurplus)} kkal/hari.`;
    }
  } else {
    dailyCalories = tdee;
    message = "Menjaga berat badan dengan keseimbangan kalori.";
  }
  
  const dailyProtein = profile.weight * (profile.goal === "bulking" ? 2.0 : 1.6);
  const proteinCalories = dailyProtein * 4;
  const fatCalories = dailyCalories * 0.25;
  const carbCalories = dailyCalories - proteinCalories - fatCalories;
  
  return {
    isAchievable,
    estimatedMonths,
    weeklyChange,
    dailyCalories: Math.round(dailyCalories),
    dailyProtein: Math.round(dailyProtein),
    dailyCarbs: Math.round(carbCalories / 4),
    dailyFat: Math.round(fatCalories / 9),
    message
  };
}

export default function UserProfileModal() {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    age: 25,
    gender: "male",
    height: 170,
    weight: 70,
    goal: "maintain",
    targetWeight: 70,
    targetMonths: 3
  });
  const [analysis, setAnalysis] = useState<GoalAnalysis | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existing = getUserProfile();
    if (existing) {
      setProfile(existing);
    }
  }, []);

  useEffect(() => {
    if (profile.weight && profile.height && profile.age) {
      const result = analyzeGoal(profile);
      setAnalysis(result);
    }
  }, [profile]);

  const handleSave = () => {
    if (analysis) {
      const updatedProfile = {
        ...profile,
        dailyCalorieTarget: analysis.dailyCalories,
        dailyProteinTarget: analysis.dailyProtein,
        dailyCarbsTarget: analysis.dailyCarbs,
        dailyFatTarget: analysis.dailyFat
      };
      saveUserProfile(updatedProfile);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const goalLabels = {
    diet: "Diet (Turun Berat)",
    maintain: "Menjaga Berat",
    bulking: "Bulking (Naik Massa)"
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" data-testid="button-tools">
          <Settings className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profil Diet Personal
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age" className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Usia (tahun)
              </Label>
              <Input
                id="age"
                type="number"
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || 0 })}
                data-testid="input-age"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Jenis Kelamin</Label>
              <Select
                value={profile.gender}
                onValueChange={(v) => setProfile({ ...profile, gender: v as "male" | "female" })}
              >
                <SelectTrigger data-testid="select-gender">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Laki-laki</SelectItem>
                  <SelectItem value="female">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height" className="flex items-center gap-1">
                <Ruler className="w-3 h-3" />
                Tinggi (cm)
              </Label>
              <Input
                id="height"
                type="number"
                value={profile.height}
                onChange={(e) => setProfile({ ...profile, height: parseInt(e.target.value) || 0 })}
                data-testid="input-height"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight" className="flex items-center gap-1">
                <Scale className="w-3 h-3" />
                Berat (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                value={profile.weight}
                onChange={(e) => setProfile({ ...profile, weight: parseInt(e.target.value) || 0 })}
                data-testid="input-weight"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal" className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              Tujuan
            </Label>
            <Select
              value={profile.goal}
              onValueChange={(v) => setProfile({ ...profile, goal: v as "diet" | "maintain" | "bulking" })}
            >
              <SelectTrigger data-testid="select-goal">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diet">Diet (Turun Berat)</SelectItem>
                <SelectItem value="maintain">Menjaga Berat</SelectItem>
                <SelectItem value="bulking">Bulking (Naik Massa)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {profile.goal !== "maintain" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetWeight">Target Berat (kg)</Label>
                <Input
                  id="targetWeight"
                  type="number"
                  value={profile.targetWeight}
                  onChange={(e) => setProfile({ ...profile, targetWeight: parseInt(e.target.value) || 0 })}
                  data-testid="input-target-weight"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetMonths">Target (bulan)</Label>
                <Input
                  id="targetMonths"
                  type="number"
                  min={1}
                  max={24}
                  value={profile.targetMonths}
                  onChange={(e) => setProfile({ ...profile, targetMonths: parseInt(e.target.value) || 1 })}
                  data-testid="input-target-months"
                />
              </div>
            </div>
          )}

          {analysis && (
            <Card className={`border-2 ${analysis.isAchievable ? 'border-green-300 bg-green-50 dark:bg-green-950/30' : 'border-orange-300 bg-orange-50 dark:bg-orange-950/30'}`}>
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className={`w-4 h-4 ${analysis.isAchievable ? 'text-green-600' : 'text-orange-600'}`} />
                  <span className="font-semibold text-sm">Analisis AI</span>
                  <Badge variant={analysis.isAchievable ? "default" : "outline"} className={analysis.isAchievable ? "bg-green-600" : ""}>
                    {analysis.isAchievable ? "Realistis" : "Perlu Penyesuaian"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{analysis.message}</p>
                
                <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                  <div className="text-center p-2 rounded bg-background">
                    <p className="text-lg font-bold text-primary">{analysis.dailyCalories}</p>
                    <p className="text-xs text-muted-foreground">kkal/hari</p>
                  </div>
                  <div className="text-center p-2 rounded bg-background">
                    <p className="text-lg font-bold text-primary">{analysis.dailyProtein}g</p>
                    <p className="text-xs text-muted-foreground">Protein/hari</p>
                  </div>
                  <div className="text-center p-2 rounded bg-background">
                    <p className="text-lg font-bold text-primary">{analysis.dailyCarbs}g</p>
                    <p className="text-xs text-muted-foreground">Karbo/hari</p>
                  </div>
                  <div className="text-center p-2 rounded bg-background">
                    <p className="text-lg font-bold text-primary">{analysis.dailyFat}g</p>
                    <p className="text-xs text-muted-foreground">Lemak/hari</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Button onClick={handleSave} className="w-full" data-testid="button-save-profile">
            {saved ? "Tersimpan!" : "Simpan Profil"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
