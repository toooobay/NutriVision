import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  to?: string;
  children?: React.ReactNode;
}

export default function BackButton({ to = "/", children }: BackButtonProps) {
  return (
    <Link href={to}>
      <Button variant="ghost" size="sm" className="gap-2" data-testid="button-back">
        <ArrowLeft className="w-4 h-4" />
        {children || "Kembali"}
      </Button>
    </Link>
  );
}