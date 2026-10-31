import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Plus, Minus, RotateCcw } from "lucide-react";

interface SuggestionsProps {
  rating: "Sangat Baik" | "Baik" | "Kurang";
  suggestions: string[];
}

export default function Suggestions({ rating, suggestions }: SuggestionsProps) {
  const getSuggestionIcon = (suggestion: string) => {
    if (suggestion.includes("tambah") || suggestion.includes("lebih")) {
      return Plus;
    }
    if (suggestion.includes("kurangi") || suggestion.includes("sedikit")) {
      return Minus;
    }
    return RotateCcw;
  };

  const getSuggestionColor = (rating: "Sangat Baik" | "Baik" | "Kurang") => {
    switch (rating) {
      case "Sangat Baik":
        return "text-health-excellent";
      case "Baik":
        return "text-health-good";
      case "Kurang":
        return "text-health-poor";
    }
  };

  if (rating === "Sangat Baik" && suggestions.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Lightbulb className="w-5 h-5 text-primary" />
            Saran Nutrisi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="text-green-600 mb-2">🎉</div>
            <p className="text-sm text-muted-foreground">
              Pilihan makanan yang sangat baik! Pertahankan pola makan sehat seperti ini.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <Lightbulb className="w-5 h-5 text-primary" />
          Saran Nutrisi
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => {
            const Icon = getSuggestionIcon(suggestion);
            return (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <Icon className={`w-4 h-4 mt-0.5 ${getSuggestionColor(rating)} flex-shrink-0`} />
                <p className="text-sm text-foreground leading-relaxed">
                  {suggestion}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}