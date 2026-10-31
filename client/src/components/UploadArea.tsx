import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, Camera, X, Sparkles, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import uploadPlaceholder from "@assets/generated_images/Food_camera_upload_illustration_393885db.png";

interface UploadAreaProps {
  onFileUpload: (file: File) => void;
  isLoading?: boolean;
}

export default function UploadArea({ onFileUpload, isLoading = false }: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onFileUpload(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  if (selectedFile && previewUrl) {
    return (
      <Card className="p-6">
        <div className="relative">
          <img 
            src={previewUrl} 
            alt="Uploaded food" 
            className="w-full h-64 object-cover rounded-lg"
          />
          {!isLoading && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={clearFile}
              data-testid="button-clear-image"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          {isLoading && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
              <div className="text-white text-center">
                <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
                <p>Menganalisis makanan...</p>
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
          </p>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-card via-card to-primary/5">
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 md:p-12 text-center transition-all duration-300 ${
            isDragging 
              ? "border-primary bg-primary/10 scale-[0.98]" 
              : "border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5"
          } ${isLoading ? "pointer-events-none opacity-60" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          aria-busy={isLoading}
          data-testid="upload-area"
        >
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 opacity-20">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <div className="absolute bottom-4 left-4 opacity-20">
            <ImagePlus className="w-8 h-8 text-primary" />
          </div>
          
          <motion.div 
            className="mb-6"
            animate={isDragging ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
              <img 
                src={uploadPlaceholder} 
                alt="Upload illustration" 
                className="w-40 h-24 mx-auto relative z-10"
              />
            </div>
          </motion.div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
                Upload Foto Makanan Anda
              </h3>
              <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
                {isDragging ? "Lepaskan foto di sini!" : "Seret dan lepas foto, atau pilih dari perangkat Anda"}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button 
                className="relative group"
                size="lg"
                data-testid="button-upload-file"
              >
                <Upload className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Pilih File
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  data-testid="input-file"
                />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="group"
                data-testid="button-take-photo"
              >
                <Camera className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Ambil Foto
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-4 pt-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Analisis AI
              </span>
              <span>•</span>
              <span>JPG, PNG, WebP</span>
              <span>•</span>
              <span>Maks. 10MB</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}