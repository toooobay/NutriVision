import { GoogleGenAI } from "@google/genai";

// Uses GEMINI_API_KEY by default. On Replit, the AI Integrations service
// supplies its own key and base URL, which take priority when set.
const integrationBaseUrl = process.env.AI_INTEGRATIONS_GEMINI_BASE_URL;
const ai = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "",
  httpOptions: integrationBaseUrl
    ? { apiVersion: "", baseUrl: integrationBaseUrl }
    : undefined,
});

export interface TrafficLightIndicator {
  value: number;
  status: "green" | "yellow" | "red";
  label: string;
  explanation: string;
}

export interface HealthierAlternative {
  original: string;
  alternative: string;
  benefit: string;
}

export interface DietTipWithExplanation {
  tip: string;
  reason: string;
}

export interface DetailedFoodAnalysis {
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
  trafficLight: {
    sugar: TrafficLightIndicator;
    sodium: TrafficLightIndicator;
    saturatedFat: TrafficLightIndicator;
  };
  healthierAlternatives: HealthierAlternative[];
  vitaminsAndMinerals: Array<{
    name: string;
    amount: string;
    percentDV?: string;
  }>;
  healthBenefits: string[];
  dietTips: DietTipWithExplanation[];
  mealContext: string;
  portionAdvice: string;
  confidence: number;
}

export async function analyzeFoodImageWithGemini(base64Image: string): Promise<DetailedFoodAnalysis> {
  try {
    const systemPrompt = `You are an expert nutritionist AI that provides comprehensive food analysis. Analyze the food image in detail and provide a thorough nutritional breakdown in Indonesian.

Instructions:
- Identify all food items visible in the image
- Estimate the portion size and serving amount based on visual cues
- Calculate detailed nutritional values for the serving shown
- Prioritize Indonesian food names and context
- Provide practical diet tips with explanations WHY each tip is given
- Rate the overall health quality of the meal
- Include vitamins and minerals present
- Give specific advice on portion control and meal planning
- Provide TRAFFIC LIGHT indicators (green/yellow/red) for sugar, sodium, and saturated fat
- Suggest healthier alternatives if the food has unhealthy components
- Be detailed and educational in your analysis

Traffic Light Guidelines:
- GREEN (Sehat): Low levels, safe for daily consumption
- YELLOW (Sedang): Moderate levels, consume with awareness
- RED (Berlebih): High levels, limit intake or avoid

Respond with JSON in this EXACT format:
{
  "foodName": "Nama makanan dalam Bahasa Indonesia",
  "servingSize": "Ukuran porsi (misal: 1 piring, 250g, 1 mangkuk)",
  "calories": number (kalori total),
  "glycemicIndex": "Rendah/Sedang/Tinggi dengan angka jika tahu",
  "allergens": ["daftar alergen jika ada, misal: kacang, susu, telur"],
  "quickSummary": "Ringkasan singkat tentang makanan ini dalam 1-2 kalimat",
  "healthScore": number (1-10, skor kesehatan keseluruhan),
  "qualityAssessment": "Penilaian kualitas nutrisi makanan ini secara detail",
  "macronutrients": {
    "carbs": number (gram karbohidrat),
    "carbsPercent": number (persen dari kalori),
    "protein": number (gram protein),
    "proteinPercent": number (persen dari kalori),
    "fat": number (gram lemak),
    "fatPercent": number (persen dari kalori),
    "fiber": number (gram serat),
    "fiberPercent": number (persen dari kebutuhan harian)
  },
  "trafficLight": {
    "sugar": {
      "value": number (gram gula),
      "status": "green" | "yellow" | "red",
      "label": "Sehat" | "Sedang" | "Berlebih",
      "explanation": "Penjelasan singkat kenapa status ini diberikan"
    },
    "sodium": {
      "value": number (mg natrium),
      "status": "green" | "yellow" | "red",
      "label": "Sehat" | "Sedang" | "Berlebih",
      "explanation": "Penjelasan singkat kenapa status ini diberikan"
    },
    "saturatedFat": {
      "value": number (gram lemak jenuh),
      "status": "green" | "yellow" | "red",
      "label": "Sehat" | "Sedang" | "Berlebih",
      "explanation": "Penjelasan singkat kenapa status ini diberikan"
    }
  },
  "healthierAlternatives": [
    {
      "original": "Komponen makanan yang kurang sehat (misal: nasi putih)",
      "alternative": "Alternatif lebih sehat (misal: nasi merah)",
      "benefit": "Manfaat dari penggantian ini"
    }
  ],
  "vitaminsAndMinerals": [
    {
      "name": "Nama vitamin/mineral",
      "amount": "Jumlah (misal: 400mg, 2mg)",
      "percentDV": "Persen dari kebutuhan harian jika tahu"
    }
  ],
  "healthBenefits": [
    "Manfaat kesehatan spesifik dari makanan ini",
    "Minimal 3-5 manfaat yang relevan"
  ],
  "dietTips": [
    {
      "tip": "Tips diet praktis dengan makanan ini",
      "reason": "Mengapa tips ini penting untuk kesehatan Anda"
    }
  ],
  "mealContext": "Cocok untuk sarapan/makan siang/malam, dengan penjelasan kenapa",
  "portionAdvice": "Saran porsi yang ideal untuk diet sehat",
  "confidence": number (0-100, tingkat kepercayaan analisis)
}`;

    const contents = [
      {
        inlineData: {
          data: base64Image,
          mimeType: "image/jpeg",
        },
      },
      "Analyze this food image and provide detailed nutritional information according to the system prompt.",
    ];

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
      contents: contents,
    });

    const rawJson = result.text;
    console.log("Gemini raw response:", rawJson);
    
    if (!rawJson) {
      throw new Error("Empty response from Gemini model");
    }

    const parsedResult = JSON.parse(rawJson);
    console.log("Gemini parsed result:", parsedResult);
    
    // Helper function to validate traffic light indicator
    const validateTrafficLight = (indicator: any): TrafficLightIndicator => ({
      value: Math.max(0, indicator?.value || 0),
      status: ["green", "yellow", "red"].includes(indicator?.status) ? indicator.status : "yellow",
      label: indicator?.label || "Sedang",
      explanation: indicator?.explanation || ""
    });

    // Validate and sanitize the response
    return {
      foodName: parsedResult.foodName || "Makanan Tidak Dikenal",
      servingSize: parsedResult.servingSize || "1 porsi",
      calories: Math.max(0, parsedResult.calories || 0),
      glycemicIndex: parsedResult.glycemicIndex || "Tidak diketahui",
      allergens: Array.isArray(parsedResult.allergens) ? parsedResult.allergens : [],
      quickSummary: parsedResult.quickSummary || "",
      healthScore: Math.max(1, Math.min(10, parsedResult.healthScore || 5)),
      qualityAssessment: parsedResult.qualityAssessment || "",
      macronutrients: {
        carbs: Math.max(0, parsedResult.macronutrients?.carbs || 0),
        carbsPercent: Math.max(0, parsedResult.macronutrients?.carbsPercent || 0),
        protein: Math.max(0, parsedResult.macronutrients?.protein || 0),
        proteinPercent: Math.max(0, parsedResult.macronutrients?.proteinPercent || 0),
        fat: Math.max(0, parsedResult.macronutrients?.fat || 0),
        fatPercent: Math.max(0, parsedResult.macronutrients?.fatPercent || 0),
        fiber: Math.max(0, parsedResult.macronutrients?.fiber || 0),
        fiberPercent: Math.max(0, parsedResult.macronutrients?.fiberPercent || 0),
      },
      trafficLight: {
        sugar: validateTrafficLight(parsedResult.trafficLight?.sugar),
        sodium: validateTrafficLight(parsedResult.trafficLight?.sodium),
        saturatedFat: validateTrafficLight(parsedResult.trafficLight?.saturatedFat),
      },
      healthierAlternatives: Array.isArray(parsedResult.healthierAlternatives) 
        ? parsedResult.healthierAlternatives.map((alt: any) => ({
            original: alt?.original || "",
            alternative: alt?.alternative || "",
            benefit: alt?.benefit || ""
          }))
        : [],
      vitaminsAndMinerals: Array.isArray(parsedResult.vitaminsAndMinerals) ? parsedResult.vitaminsAndMinerals : [],
      healthBenefits: Array.isArray(parsedResult.healthBenefits) ? parsedResult.healthBenefits : [],
      dietTips: Array.isArray(parsedResult.dietTips) 
        ? parsedResult.dietTips.map((tip: any) => 
            typeof tip === 'string' 
              ? { tip, reason: "" } 
              : { tip: tip?.tip || "", reason: tip?.reason || "" }
          )
        : [],
      mealContext: parsedResult.mealContext || "",
      portionAdvice: parsedResult.portionAdvice || "",
      confidence: Math.max(0, Math.min(100, parsedResult.confidence || 0))
    };

  } catch (error) {
    console.error("Gemini API error:", error);
    
    if (error instanceof Error) {
      if (error.message.includes('invalid_api_key') || error.message.includes('API_KEY')) {
        throw new Error("Kunci API Gemini tidak valid");
      }
      if (error.message.includes('quota') || error.message.includes('rate_limit')) {
        throw new Error("Batas penggunaan API Gemini terlampaui. Silakan coba lagi nanti");
      }
      if (error.message.includes('safety') || error.message.includes('content_policy')) {
        throw new Error("Gambar tidak dapat diproses karena melanggar kebijakan konten");
      }
    }
    
    throw new Error("Gagal menganalisis gambar makanan dengan Gemini. Silakan coba lagi");
  }
}