
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import GeneratedImage from './GeneratedImage';
import PromptHistory from './PromptHistory';
import Header from './Header';
import AuthGuard from './AuthGuard';

interface HistoryItem {
  id: string;
  prompt: string;
  style: string;
  aspect_ratio: string;
  imageUrl: string;
  timestamp: Date;
}

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate image generation for now
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // For demo purposes, using a placeholder image
      const mockImageUrl = `https://picsum.photos/512/512?random=${Date.now()}`;
      setGeneratedImageUrl(mockImageUrl);
      
      // Add to history
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        prompt,
        style,
        aspect_ratio: aspectRatio,
        imageUrl: mockImageUrl,
        timestamp: new Date(),
      };
      
      setHistory(prev => [newHistoryItem, ...prev]);
      
      toast.success('Image generated successfully!');
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setPrompt(item.prompt);
    setStyle(item.style);
    setAspectRatio(item.aspect_ratio);
    setGeneratedImageUrl(item.imageUrl);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
        <Header />
        
        <div className="container mx-auto p-6 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-orbitron font-bold text-cyber-primary cyber-glow">
              AI Image Generator
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transform your imagination into stunning visuals with the power of artificial intelligence
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Controls Panel */}
            <Card className="cyber-glow bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-orbitron text-cyber-primary flex items-center gap-2">
                  <Wand2 className="w-6 h-6" />
                  Create Your Vision
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="prompt" className="text-lg font-semibold text-foreground">
                    Describe your image
                  </Label>
                  <Textarea
                    id="prompt"
                    placeholder="A cyberpunk cityscape at night with neon lights reflecting on wet streets..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[120px] cyber-glow bg-background/50 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="style" className="text-sm font-medium text-foreground">
                      Art Style
                    </Label>
                    <Select value={style} onValueChange={setStyle}>
                      <SelectTrigger className="cyber-glow bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realistic">Realistic</SelectItem>
                        <SelectItem value="artistic">Artistic</SelectItem>
                        <SelectItem value="anime">Anime</SelectItem>
                        <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
                        <SelectItem value="fantasy">Fantasy</SelectItem>
                        <SelectItem value="abstract">Abstract</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aspectRatio" className="text-sm font-medium text-foreground">
                      Aspect Ratio
                    </Label>
                    <Select value={aspectRatio} onValueChange={setAspectRatio}>
                      <SelectTrigger className="cyber-glow bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1:1">Square (1:1)</SelectItem>
                        <SelectItem value="16:9">Landscape (16:9)</SelectItem>
                        <SelectItem value="9:16">Portrait (9:16)</SelectItem>
                        <SelectItem value="4:3">Classic (4:3)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={generateImage}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full bg-gradient-to-r from-cyber-primary to-cyber-secondary hover:from-cyber-primary/90 hover:to-cyber-secondary/90 text-black font-bold text-lg py-6 cyber-glow"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  {isGenerating ? 'Generating...' : 'Generate Image'}
                </Button>
              </CardContent>
            </Card>

            {/* Generated Image */}
            <GeneratedImage 
              imageUrl={generatedImageUrl} 
              isGenerating={isGenerating} 
            />
          </div>

          {/* History */}
          {history.length > 0 && (
            <PromptHistory 
              history={history} 
              onSelect={handleHistorySelect} 
            />
          )}
        </div>
      </div>
    </AuthGuard>
  );
};

export default ImageGenerator;
