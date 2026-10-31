import type { Express, NextFunction, Request, Response } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { analyzeFoodImageWithGemini } from "./lib/gemini";

// Configure multer for handling file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Turn upload rejections into user-friendly 400 responses
function uploadImage(req: Request, res: Response, next: NextFunction) {
  upload.single('image')(req, res, (error: unknown) => {
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: "Ukuran file terlalu besar. Maksimal 10MB" });
    }

    if (error instanceof Error && error.message.includes('Only image files')) {
      return res.status(400).json({ error: "File yang diunggah harus berupa gambar" });
    }

    next(error);
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  const hasGeminiKey = !!(process.env.AI_INTEGRATIONS_GEMINI_API_KEY || process.env.GEMINI_API_KEY);

  // Check Gemini API key on startup
  if (!hasGeminiKey) {
    console.error("FATAL: GEMINI_API_KEY environment variable must be set");
    process.exit(1);
  }

  // Nutrition analysis endpoint
  app.post("/api/analyze-food", uploadImage, async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      // Convert buffer to base64
      const base64Image = req.file.buffer.toString('base64');

      // Analyze the image with Gemini AI
      const foodAnalysis = await analyzeFoodImageWithGemini(base64Image);

      // Send detailed response
      res.json(foodAnalysis);

    } catch (error) {
      console.error("Food analysis error:", error);

      res.status(500).json({
        error: "Terjadi kesalahan saat menganalisis makanan. Silakan coba lagi." 
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      ai: hasGeminiKey,
      timestamp: new Date().toISOString() 
    });
  });

  // Get recent analyses (optional endpoint for future features)
  app.get("/api/recent-analyses", async (req, res) => {
    try {
      const analyses = await storage.getRecentNutritionAnalyses(10);
      res.json(analyses);
    } catch (error) {
      console.error("Error fetching recent analyses:", error);
      res.status(500).json({ error: "Failed to fetch recent analyses" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}