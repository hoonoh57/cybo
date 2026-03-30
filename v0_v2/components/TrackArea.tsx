'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TrackAreaProps {
  className?: string;
}

export function TrackArea({ className }: TrackAreaProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData([
        { id: 1, title: 'Item One', status: 'active' },
        { id: 2, title: 'Item Two', status: 'pending' },
        { id: 3, title: 'Item Three', status: 'completed' },
      ]);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn("p-6 rounded-xl bg-[#12122a] border border-[rgba(255,255,255,0.06)]", className)}>
      <h2 className="text-lg font-semibold text-white mb-4">------</h2>
      <div className="space-y-3">
        {data.map(item => (
          <div key={item.id} className="flex items-center justify-between p-4 rounded-lg bg-[#0a0a1e] border border-[#1a1a30]">
            <div>
              <h3 className="text-sm font-medium text-white">{item.title}</h3>
              <span className="text-xs text-[#6c63ff]">{item.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}