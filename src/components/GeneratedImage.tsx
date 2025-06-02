
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Image, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface GeneratedImageProps {
  imageUrl: string | null;
  isGenerating: boolean;
}

const GeneratedImage: React.FC<GeneratedImageProps> = ({ imageUrl, isGenerating }) => {
  const downloadImage = async () => {
    if (!imageUrl) return;

    try {
      // Handle base64 images
      if (imageUrl.startsWith('data:image')) {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `ai-generated-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Image downloaded successfully!');
      } else {
        // Handle regular URLs
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `ai-generated-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.URL.revokeObjectURL(url);
        toast.success('Image downloaded successfully!');
      }
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Failed to download image');
    }
  };

  return (
    <Card className="cyber-glow bg-card/50 backdrop-blur-sm h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-orbitron text-cyber-primary flex items-center gap-2">
          <Image className="w-6 h-6" />
          Generated Image
        </CardTitle>
        {imageUrl && (
          <Button
            onClick={downloadImage}
            variant="outline"
            size="sm"
            className="cyber-glow border-cyber-accent text-cyber-accent hover:bg-cyber-accent/20"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex items-center justify-center min-h-[500px]">
        {isGenerating ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Loader2 className="w-16 h-16 text-cyber-primary animate-spin" />
              <div className="absolute inset-0 w-16 h-16 border-2 border-cyber-secondary/30 rounded-full animate-pulse-glow"></div>
            </div>
            <p className="text-cyber-primary font-orbitron text-lg">
              Creating your masterpiece...
            </p>
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-cyber-accent rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                ></div>
              ))}
            </div>
          </div>
        ) : imageUrl ? (
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={imageUrl}
              alt="Generated image"
              className="max-w-full max-h-[600px] object-contain rounded-lg cyber-glow shadow-2xl"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(0, 255, 255, 0.3))',
              }}
              onError={(e) => {
                console.error('Image failed to load:', imageUrl);
                toast.error('Failed to load generated image');
              }}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4 text-muted-foreground">
            <div className="w-32 h-32 border-2 border-dashed border-cyber-primary/30 rounded-lg flex items-center justify-center">
              <Image className="w-16 h-16 text-cyber-primary/50" />
            </div>
            <p className="text-lg font-orbitron">
              Your generated image will appear here
            </p>
            <p className="text-sm text-center">
              Enter a prompt and click "Generate Image" to create stunning AI art
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GeneratedImage;
