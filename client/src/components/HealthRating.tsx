import { CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type HealthRatingType = "Sangat Baik" | "Baik" | "Kurang";

interface HealthRatingProps {
  rating: HealthRatingType;
  reason: string;
}

export default function HealthRating({ rating, reason }: HealthRatingProps) {
  const getRatingConfig = (rating: HealthRatingType) => {
    switch (rating) {
      case "Sangat Baik":
        return {
          icon: CheckCircle,
          bgColor: "bg-health-excellent",
          textColor: "text-white",
          iconColor: "text-white"
        };
      case "Baik":
        return {
          icon: AlertCircle,
          bgColor: "bg-health-good",
          textColor: "text-foreground",
          iconColor: "text-foreground"
        };
      case "Kurang":
        return {
          icon: XCircle,
          bgColor: "bg-health-poor",
          textColor: "text-white",
          iconColor: "text-white"
        };
    }
  };

  const config = getRatingConfig(rating);
  const Icon = config.icon;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center">
        <Badge 
          className={`${config.bgColor} ${config.textColor} px-4 py-2 text-base font-semibold`}
          data-testid={`badge-rating-${rating.toLowerCase().replace(' ', '-')}`}
        >
          <Icon className={`w-5 h-5 mr-2 ${config.iconColor}`} />
          {rating}
        </Badge>
      </div>
      
      <div className="text-center">
        <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
          {reason}
        </p>
      </div>
    </div>
  );
}