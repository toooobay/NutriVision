import Header from "@/components/Header";
import Navigation from "@/components/Navigation";

export default function MainMenu() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">NutriVision AI</h1>
            <p className="text-muted-foreground">
              Asisten nutrisi AI untuk hidup lebih sehat
            </p>
          </div>
          
          <Navigation />
          
          <div className="bg-muted/50 rounded-lg p-6 text-center">
            <h3 className="font-semibold mb-2">Tentang NutriVision AI</h3>
            <p className="text-sm text-muted-foreground">
              Platform kesehatan yang menggunakan AI untuk menganalisis nutrisi makanan dari foto 
              dan menghitung BMI dengan rekomendasi kesehatan yang personal dalam Bahasa Indonesia.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}