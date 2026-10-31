import { useState } from "react";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Scale, Activity, Heart, TrendingUp } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const bmiFormSchema = z.object({
  weight: z.number().min(20, "Berat badan minimal 20 kg").max(300, "Berat badan maksimal 300 kg"),
  height: z.number().min(100, "Tinggi badan minimal 100 cm").max(250, "Tinggi badan maksimal 250 cm"),
});

type BMIFormData = z.infer<typeof bmiFormSchema>;

interface BMIResult {
  bmi: number;
  category: string;
  categoryColor: string;
  advice: string;
  tips: string[];
  riskLevel: string;
}

function calculateBMI(weight: number, height: number): BMIResult {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  
  let category: string;
  let categoryColor: string;
  let advice: string;
  let tips: string[];
  let riskLevel: string;

  if (bmi < 18.5) {
    category = "Kekurangan Berat Badan";
    categoryColor = "destructive";
    riskLevel = "Rendah-Sedang";
    advice = "Anda memiliki berat badan kurang. Disarankan untuk menambah berat badan dengan cara yang sehat.";
    tips = [
      "Konsumsi makanan bergizi tinggi seperti kacang-kacangan, alpukat, dan protein",
      "Makan dalam porsi kecil tapi sering (5-6 kali sehari)",
      "Olahraga untuk membangun massa otot seperti angkat beban",
      "Konsultasikan dengan ahli gizi untuk program penambahan berat badan",
      "Hindari makanan kosong kalori dan fokus pada nutrisi berkualitas"
    ];
  } else if (bmi >= 18.5 && bmi < 25) {
    category = "Sehat";
    categoryColor = "default";
    riskLevel = "Rendah";
    advice = "Selamat! Berat badan Anda berada dalam kategori normal dan sehat.";
    tips = [
      "Pertahankan pola makan seimbang dengan gizi lengkap",
      "Lakukan olahraga rutin minimal 150 menit per minggu",
      "Konsumsi air putih yang cukup (8-10 gelas per hari)",
      "Tidur yang cukup 7-9 jam per malam",
      "Lakukan pemeriksaan kesehatan rutin setiap tahun"
    ];
  } else if (bmi >= 25 && bmi < 30) {
    category = "Sedikit Obesitas";
    categoryColor = "secondary";
    riskLevel = "Sedang";
    advice = "Anda memiliki kelebihan berat badan. Mulai program penurunan berat badan secara bertahap.";
    tips = [
      "Kurangi porsi makan dan hindari makanan tinggi kalori",
      "Perbanyak konsumsi sayuran dan buah-buahan",
      "Lakukan olahraga kardio seperti jalan cepat atau berenang",
      "Batasi konsumsi gula dan makanan olahan",
      "Pertimbangkan untuk berkonsultasi dengan ahli gizi"
    ];
  } else {
    category = "Obesitas";
    categoryColor = "destructive";
    riskLevel = "Tinggi";
    advice = "Anda berada dalam kategori obesitas. Sangat disarankan untuk menurunkan berat badan demi kesehatan.";
    tips = [
      "Konsultasikan dengan dokter untuk program penurunan berat badan",
      "Terapkan defisit kalori yang aman (500-750 kalori per hari)",
      "Fokus pada makanan tinggi protein dan serat",
      "Lakukan olahraga kombinasi kardio dan strength training",
      "Pertimbangkan bantuan profesional seperti ahli gizi dan personal trainer",
      "Monitor tekanan darah dan kadar gula darah secara rutin"
    ];
  }

  return {
    bmi: Math.round(bmi * 10) / 10,
    category,
    categoryColor,
    advice,
    tips,
    riskLevel
  };
}

export default function BMICalculator() {
  const [bmiResult, setBMIResult] = useState<BMIResult | null>(null);

  const form = useForm<BMIFormData>({
    resolver: zodResolver(bmiFormSchema),
    defaultValues: {
      weight: undefined,
      height: undefined,
    },
  });

  const onSubmit = (data: BMIFormData) => {
    const result = calculateBMI(data.weight, data.height);
    setBMIResult(result);
  };

  const resetCalculator = () => {
    setBMIResult(null);
    form.reset();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="mb-4">
          <BackButton />
        </div>
        
        <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Kalkulator BMI</h2>
        <p className="text-muted-foreground">
          Hitung Body Mass Index Anda dan dapatkan rekomendasi kesehatan
        </p>
      </div>

      {!bmiResult ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-primary" />
              Input Data Tubuh
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Berat Badan (kg)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            inputMode="decimal"
                            placeholder="Contoh: 65"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                            data-testid="input-weight"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tinggi Badan (cm)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            inputMode="decimal"
                            placeholder="Contoh: 170"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                            data-testid="input-height"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  data-testid="button-calculate-bmi"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Hitung BMI
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* BMI Result Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Hasil Perhitungan BMI</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary" data-testid="text-bmi-value">
                  {bmiResult.bmi}
                </div>
                <Badge variant={bmiResult.categoryColor as any} className="px-4 py-2 text-sm font-medium" data-testid="badge-bmi-category">
                  {bmiResult.category}
                </Badge>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-2">Tingkat Risiko Kesehatan:</p>
                <p className="font-medium" data-testid="text-risk-level">{bmiResult.riskLevel}</p>
              </div>

              <p className="text-muted-foreground">{bmiResult.advice}</p>
            </CardContent>
          </Card>

          {/* Health Tips Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Tips Kesehatan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3" data-testid="list-health-tips">
                {bmiResult.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3" data-testid={`list-tip-${index}`}>
                    <Activity className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <span className="text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* BMI Reference Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Referensi BMI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-300 rounded"></div>
                    <span>Kurang: &lt; 18.5</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-300 rounded"></div>
                    <span>Normal: 18.5 - 24.9</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-300 rounded"></div>
                    <span>Berlebih: 25 - 29.9</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-300 rounded"></div>
                    <span>Obesitas: ≥ 30</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button 
            onClick={resetCalculator}
            variant="outline" 
            className="w-full"
            data-testid="button-reset-calculator"
          >
            Hitung Ulang
          </Button>
        </div>
      )}
        </div>
      </main>
    </div>
  );
}