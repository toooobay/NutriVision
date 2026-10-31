import { Link, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Scale, TrendingUp } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();

  const navigationItems = [
    {
      path: "/food-analysis",
      icon: Camera,
      title: "Analisis Makanan",
      description: "Analisis foto makanan dengan AI"
    },
    {
      path: "/daily-tracker",
      icon: TrendingUp,
      title: "Tracker Harian",
      description: "Pantau asupan nutrisi harian"
    },
    {
      path: "/bmi",
      icon: Scale,
      title: "Kalkulator BMI",
      description: "Hitung indeks massa tubuh Anda"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = location === item.path;
        
        return (
          <Link key={item.path} href={item.path}>
            <Card className={`cursor-pointer transition-all hover-elevate ${
              isActive 
                ? "border-primary bg-primary/5" 
                : "border-muted hover:border-muted-foreground/50"
            }`}>
              <CardContent className="p-6 text-center space-y-3">
                <div className={`inline-flex p-3 rounded-lg ${
                  isActive 
                    ? "bg-primary text-white" 
                    : "bg-muted"
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}