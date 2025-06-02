
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Download, Sparkles } from 'lucide-react';
import GeneratedImage from './GeneratedImage';
import PromptHistory from './PromptHistory';

interface GenerationParams {
  prompt: string;
  style: string;
  aspect_ratio: string;
}

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
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const styles = [
    { value: 'realistic', label: 'Realistic' },
    { value: 'anime', label: 'Anime' },
    { value: 'cyberpunk', label: 'Cyberpunk' },
    { value: 'fantasy', label: 'Fantasy' },
    { value: 'abstract', label: 'Abstract' },
    { value: 'oil_painting', label: 'Oil Painting' },
    { value: 'watercolor', label: 'Watercolor' },
    { value: 'sketch', label: 'Sketch' },
  ];

  const aspectRatios = [
    { value: '1:1', label: 'Square (1:1)' },
    { value: '16:9', label: 'Landscape (16:9)' },
    { value: '9:16', label: 'Portrait (9:16)' },
    { value: '4:3', label: 'Classic (4:3)' },
    { value: '3:2', label: 'Photo (3:2)' },
  ];

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt!');
      return;
    }

    setIsGenerating(true);
    
    try {
      const formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('style', style);
      formData.append('aspect_ratio', aspectRatio);

      console.log('Generating image with params:', { prompt, style, aspect_ratio: aspectRatio });

      const response = await fetch('https://api.vyro.ai/v2/image/generations', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer vk-0D9s1vv2gWQHM2ln3D0jpuIzYUtVb3rI81L98F2Gm2S7xc',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (data.url) {
        setGeneratedImage(data.url);
        
        // Add to history
        const historyItem: HistoryItem = {
          id: Date.now().toString(),
          prompt,
          style,
          aspect_ratio: aspectRatio,
          imageUrl: data.url,
          timestamp: new Date(),
        };
        
        setHistory(prev => [historyItem, ...prev.slice(0, 9)]); // Keep last 10 items
        
        toast.success('Image generated successfully!');
      } else {
        throw new Error('No image URL in response');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setPrompt(item.prompt);
    setStyle(item.style);
    setAspectRatio(item.aspect_ratio);
    setGeneratedImage(item.imageUrl);
  };

  return (
    <div className="min-h-screen bg-cyber-darker p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-orbitron font-bold bg-gradient-to-r from-cyber-primary via-cyber-secondary to-cyber-accent bg-clip-text text-transparent mb-4">
            AI IMAGE FORGE
          </h1>
          <p className="text-xl text-cyber-primary/80 font-rajdhani">
            Generate stunning visuals with futuristic AI technology
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-cyber-primary to-cyber-secondary mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Generation Form */}
          <div className="lg:col-span-1">
            <Card className="cyber-glow bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-orbitron text-cyber-primary flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  Create Image
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="prompt" className="text-cyber-primary font-semibold">
                    Prompt
                  </Label>
                  <Input
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your vision..."
                    className="cyber-glow bg-background/50 border-cyber-primary/30 text-foreground placeholder:text-muted-foreground"
                    disabled={isGenerating}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="style" className="text-cyber-primary font-semibold">
                    Style
                  </Label>
                  <Select value={style} onValueChange={setStyle} disabled={isGenerating}>
                    <SelectTrigger className="cyber-glow bg-background/50 border-cyber-primary/30">
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-cyber-primary/30">
                      {styles.map((s) => (
                        <SelectItem 
                          key={s.value} 
                          value={s.value}
                          className="text-foreground hover:bg-cyber-primary/20"
                        >
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aspect-ratio" className="text-cyber-primary font-semibold">
                    Aspect Ratio
                  </Label>
                  <Select value={aspectRatio} onValueChange={setAspectRatio} disabled={isGenerating}>
                    <SelectTrigger className="cyber-glow bg-background/50 border-cyber-primary/30">
                      <SelectValue placeholder="Select aspect ratio" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-cyber-primary/30">
                      {aspectRatios.map((ar) => (
                        <SelectItem 
                          key={ar.value} 
                          value={ar.value}
                          className="text-foreground hover:bg-cyber-primary/20"
                        >
                          {ar.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={generateImage}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full cyber-button bg-gradient-to-r from-cyber-primary/20 to-cyber-secondary/20 hover:from-cyber-primary/30 hover:to-cyber-secondary/30 text-white font-bold py-3 text-lg font-orbitron"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      GENERATING...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      GENERATE IMAGE
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Generated Image */}
          <div className="lg:col-span-2">
            <GeneratedImage imageUrl={generatedImage} isGenerating={isGenerating} />
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="mt-12">
            <PromptHistory history={history} onSelect={handleHistorySelect} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;
