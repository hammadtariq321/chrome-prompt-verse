
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, Clock } from 'lucide-react';

interface HistoryItem {
  id: string;
  prompt: string;
  style: string;
  aspect_ratio: string;
  imageUrl: string;
  timestamp: Date;
}

interface PromptHistoryProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

const PromptHistory: React.FC<PromptHistoryProps> = ({ history, onSelect }) => {
  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  return (
    <Card className="cyber-glow bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-orbitron text-cyber-primary flex items-center gap-2">
          <History className="w-6 h-6" />
          Generation History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="group cursor-pointer"
              onClick={() => onSelect(item)}
            >
              <div className="relative overflow-hidden rounded-lg cyber-glow bg-background/30 hover:bg-cyber-primary/10 transition-all duration-300">
                <img
                  src={item.imageUrl}
                  alt={item.prompt}
                  className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-xs font-semibold truncate mb-1">
                    {item.prompt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-cyber-primary">
                    <span className="capitalize">{item.style}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTimestamp(item.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-2 p-2">
                <p className="text-sm text-foreground font-medium truncate mb-1">
                  {item.prompt}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="capitalize bg-cyber-primary/20 px-2 py-1 rounded">
                    {item.style}
                  </span>
                  <span className="bg-cyber-secondary/20 px-2 py-1 rounded">
                    {item.aspect_ratio}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PromptHistory;
