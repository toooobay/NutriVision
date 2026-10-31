import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Utensils, Zap, Beef, Wheat, Droplets } from "lucide-react";

interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

interface NutritionCardProps {
  foodName: string;
  nutrition: NutritionInfo;
  confidence?: number;
}

export default function NutritionCard({ foodName, nutrition, confidence = 95 }: NutritionCardProps) {
  const macroNutrients = [
    {
      name: "Protein",
      value: nutrition.protein,
      unit: "g",
      icon: Beef,
      color: "text-blue-600"
    },
    {
      name: "Karbohidrat",
      value: nutrition.carbs,
      unit: "g",
      icon: Wheat,
      color: "text-orange-600"
    },
    {
      name: "Lemak",
      value: nutrition.fat,
      unit: "g",
      icon: Droplets,
      color: "text-purple-600"
    }
  ];

  const microNutrients = [
    { name: "Serat", value: nutrition.fiber, unit: "g" },
    { name: "Gula", value: nutrition.sugar, unit: "g" },
    { name: "Sodium", value: nutrition.sodium, unit: "mg" }
  ];

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg" data-testid="text-food-name">{foodName}</CardTitle>
          </div>
          <Badge variant="secondary" data-testid="badge-confidence">
            {confidence}% akurat
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Calories Display */}
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Zap className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Total Kalori</span>
          </div>
          <div className="text-3xl font-bold text-primary" data-testid="text-calories">
            {nutrition.calories}
          </div>
          <div className="text-sm text-muted-foreground">kkal</div>
        </div>

        {/* Macronutrients */}
        <div>
          <h4 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
            Makronutrisi
          </h4>
          <div className="grid grid-cols-3 gap-3">
            {macroNutrients.map((macro) => (
              <div key={macro.name} className="text-center p-3 bg-card border rounded-lg">
                <macro.icon className={`w-5 h-5 mx-auto mb-1 ${macro.color}`} />
                <div className="text-lg font-semibold" data-testid={`text-${macro.name.toLowerCase()}`}>
                  {macro.value}{macro.unit}
                </div>
                <div className="text-xs text-muted-foreground">{macro.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Micronutrients */}
        <div>
          <h4 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
            Detail Nutrisi
          </h4>
          <div className="space-y-2">
            {microNutrients.map((micro) => (
              <div key={micro.name} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                <span className="text-sm font-medium">{micro.name}</span>
                <span className="text-sm text-muted-foreground" data-testid={`text-${micro.name.toLowerCase()}`}>
                  {micro.value} {micro.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}