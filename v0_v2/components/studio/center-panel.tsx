'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { X, Plus, FileCode, ChevronDown, Copy, ExternalLink, Upload } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStudioStore, useSelectedNode, useNodePath } from '@/lib/studio-store';
import { screenTypes, type ScreenType } from '@/lib/studio-types';
import { cn } from '@/lib/utils';

// Tab component
function EditorTab({ 
  filename, 
  isActive, 
  onClick, 
  onClose 
}: { 
  filename: string; 
  isActive: boolean; 
  onClick: () => void;
  onClose: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-3 h-full cursor-pointer border-b-2 transition-all',
        isActive 
          ? 'bg-[#12122a] border-[#6c63ff] text-[#e0e0f0]' 
          : 'bg-transparent border-transparent text-[#505070] hover:text-[#808098]'
      )}
    >
      <FileCode className="w-3.5 h-3.5" />
      <span className="text-[12px]">{filename}</span>
      <button 
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="w-4 h-4 flex items-center justify-center rounded hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

// Minimap component
function Minimap({ code, scrollPercent }: { code: string; scrollPercent: number }) {
  const lines = code.split('\n');
  const visibleLines = 30;
  const totalHeight = 200;
  const viewportHeight = Math.min((visibleLines / lines.length) * totalHeight, totalHeight);
  const viewportTop = scrollPercent * (totalHeight - viewportHeight);
  
  return (
    <div className="w-[60px] h-full bg-[#08081a] border-l border-[#1a1a30] relative overflow-hidden">
      {/* Minimap content */}
      <div className="p-1 text-[2px] leading-[3px] opacity-50 select-none">
        {lines.slice(0, 100).map((line, i) => (
          <div key={i} className="text-[#606080] truncate whitespace-pre">
            {line.slice(0, 80)}
          </div>
        ))}
      </div>
      
      {/* Viewport indicator */}
      <div 
        className="absolute left-0 right-0 bg-white/10 border-l-2 border-[#6c63ff]"
        style={{
          top: `${viewportTop}px`,
          height: `${viewportHeight}px`,
        }}
      />
    </div>
  );
}

// Syntax highlighting function
function highlightSyntax(code: string): string {
  let highlighted = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  // Comments
  highlighted = highlighted.replace(/(\/\/.*$)/gm, '<span style="color:#546e7a">$1</span>');
  highlighted = highlighted.replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color:#546e7a">$1</span>');
  
  // Strings
  highlighted = highlighted.replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`[^`]*`)/g, '<span style="color:#c3e88d">$1</span>');
  
  // Keywords
  highlighted = highlighted.replace(
    /\b(import|export|from|default|const|let|var|function|return|if|else|for|while|async|await|try|catch|throw|new|class|extends|implements|interface|type|typeof|this)\b/g, 
    '<span style="color:#c792ea">$1</span>'
  );
  
  // Types (after colon or angle brackets)
  highlighted = highlighted.replace(/:\s*([A-Z][a-zA-Z0-9]*)/g, ': <span style="color:#ffcb6b">$1</span>');
  highlighted = highlighted.replace(/&lt;([A-Z][a-zA-Z0-9]*)&gt;/g, '&lt;<span style="color:#ffcb6b">$1</span>&gt;');
  
  // Function calls
  highlighted = highlighted.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g, '<span style="color:#82aaff">$1</span>(');
  
  // JSX tags
  highlighted = highlighted.replace(/(&lt;\/?)([\w]+)/g, '$1<span style="color:#f07178">$2</span>');
  
  // Props/attributes
  highlighted = highlighted.replace(/\b(className|onClick|onChange|onSubmit|href|src|alt|type|value|placeholder|disabled|key|ref|style)\b=/g, '<span style="color:#89ddff">$1</span>=');
  
  // Booleans and null
  highlighted = highlighted.replace(/\b(true|false|null|undefined)\b/g, '<span style="color:#f78c6c">$1</span>');
  
  // Numbers
  highlighted = highlighted.replace(/\b(\d+\.?\d*)\b/g, '<span style="color:#f78c6c">$1</span>');
  
  return highlighted;
}

// Code Editor component
function CodeEditor({ 
  code, 
  onChange, 
  filename,
  readOnly = false 
}: { 
  code: string; 
  onChange?: (code: string) => void;
  filename: string;
  readOnly?: boolean;
}) {
  const [cursorLine, setCursorLine] = useState(24);
  const [cursorCol, setCursorCol] = useState(18);
  const [scrollPercent, setScrollPercent] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const lines = code.split('\n');
  
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      setScrollPercent(scrollTop / (scrollHeight - clientHeight));
    }
  };
  
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
    
    // Update cursor position
    const pos = e.target.selectionStart;
    const textBeforeCursor = e.target.value.slice(0, pos);
    const linesBeforeCursor = textBeforeCursor.split('\n');
    setCursorLine(linesBeforeCursor.length);
    setCursorCol(linesBeforeCursor[linesBeforeCursor.length - 1].length + 1);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (textarea && onChange) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newCode = code.slice(0, start) + '  ' + code.slice(end);
        onChange(newCode);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2;
        }, 0);
      }
    }
  };
  
  return (
    <div className="h-full flex flex-col bg-[#0a0a1a] overflow-hidden">
      {/* Editor area with line numbers */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main editor */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-auto relative"
        >
          <div className="min-w-max">
            {/* Line numbers + code container */}
            <div className="flex">
              {/* Line numbers gutter */}
              <div className="w-12 flex-shrink-0 bg-[#08081a] text-right pr-3 select-none border-r border-[#1a1a30]">
                {lines.map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      'h-6 text-[12px] font-mono leading-6',
                      i + 1 === cursorLine ? 'text-white' : 'text-[#2a2a4a]'
                    )}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              
              {/* Code content */}
              <div className="flex-1 relative">
                {/* Highlighted code layer */}
                <div className="absolute inset-0 p-0 pointer-events-none">
                  {lines.map((line, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        'h-6 px-4 font-mono text-[12px] leading-6 whitespace-pre',
                        i + 1 === cursorLine && 'bg-white/[0.02]'
                      )}
                      dangerouslySetInnerHTML={{ __html: highlightSyntax(line) || '&nbsp;' }}
                    />
                  ))}
                </div>
                
                {/* Textarea for editing */}
                {!readOnly && (
                  <textarea
                    ref={textareaRef}
                    value={code}
                    onChange={handleTextareaChange}
                    onKeyDown={handleKeyDown}
                    spellCheck={false}
                    className="absolute inset-0 w-full h-full p-0 px-4 font-mono text-[12px] leading-6 bg-transparent text-transparent caret-white resize-none outline-none selection:bg-[#6c63ff]/30"
                    style={{ 
                      lineHeight: '24px',
                      caretColor: 'white'
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Minimap */}
        <Minimap code={code} scrollPercent={scrollPercent} />
      </div>
      
      {/* Status bar */}
      <div className="h-6 flex items-center justify-between px-3 bg-[#0a0a1a] border-t border-[#1a1a30] text-[11px]">
        <span className="text-[#606080]">TypeScript React</span>
        <span className="text-[#606080]">Ln {cursorLine}, Col {cursorCol}</span>
        <div className="flex items-center gap-3">
          <span className="text-[#606080]">UTF-8</span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00c853]" />
            <span className="text-[#606080]">Saved</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Empty state setup form
function EmptyStateView() {
  const { updateNodePrompt } = useStudioStore();
  const selectedNode = useSelectedNode();
  const [description, setDescription] = useState('');
  const [screenType, setScreenType] = useState<ScreenType>('Dashboard');
  
  const handleGeneratePrompt = () => {
    if (!selectedNode || !description) return;
    
    const prompt = `Create a ${screenType} component with the following requirements:

${description}

Design specifications:
- Dark theme with background #08081a
- Primary accent color #6c63ff
- Card background #12122a with border rgba(255,255,255,0.06)
- Use Inter font for text, JetBrains Mono for code
- Smooth transitions 150ms cubic-bezier(0.4, 0, 0.2, 1)
- Border radius 8px for cards
- Accessible and responsive`;
    
    updateNodePrompt(selectedNode.id, prompt);
  };
  
  return (
    <div className="h-full flex items-center justify-center relative bg-[#0a0a1a]">
      <div 
        className="absolute w-[400px] h-[400px] rounded-full opacity-[0.06] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #6c63ff 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      />
      
      <div className="w-full max-w-[480px] p-8 rounded-xl bg-[#10102a] border border-[rgba(255,255,255,0.06)] relative z-10">
        <h3 className="text-[16px] font-semibold text-white mb-1">Set up this screen</h3>
        <p className="text-[13px] text-[#606080] mb-6">Describe what this screen should look like</p>
        
        <div className="space-y-4">
          <Textarea
            placeholder="What should this screen contain? Describe the layout, components, and functionality..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full h-[120px] bg-[#0a0a1e] border border-[#1a1a30] rounded-lg text-[13px] text-white placeholder:text-[#303050] resize-none focus:border-[#6c63ff] focus:ring-1 focus:ring-[#6c63ff]/20"
          />
          
          <Select value={screenType} onValueChange={(v) => setScreenType(v as ScreenType)}>
            <SelectTrigger className="w-full h-10 bg-[#0a0a1e] border border-[#1a1a30] rounded-lg text-[13px] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#12122a] border-[rgba(255,255,255,0.06)]">
              {screenTypes.map((type) => (
                <SelectItem 
                  key={type} 
                  value={type}
                  className="text-[13px] text-[#b0b0c8] hover:bg-white/[0.05] focus:bg-white/[0.05]"
                >
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            onClick={handleGeneratePrompt}
            disabled={!description}
            className="w-full h-10 rounded-lg text-[13px] font-semibold text-white disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #6c63ff 0%, #5b52ee 100%)',
              boxShadow: description ? '0 4px 16px rgba(108,99,255,0.3)' : 'none'
            }}
          >
            Generate Prompt
          </Button>
        </div>
      </div>
    </div>
  );
}

// Prompt Ready View
function PromptReadyView() {
  const { updateNodePrompt, updateNodeCode } = useStudioStore();
  const selectedNode = useSelectedNode();
  const [prompt, setPrompt] = useState(selectedNode?.prompt || '');
  const [isDragging, setIsDragging] = useState(false);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
  };
  
  const handleOpenV0 = () => {
    window.open('https://v0.dev', '_blank');
  };
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && selectedNode) {
      const file = files[0];
      if (file.name.endsWith('.zip')) {
        updateNodeCode(selectedNode.id, `// Code imported from ${file.name}\n// Component implementation here...`);
      }
    }
  }, [selectedNode, updateNodeCode]);
  
  return (
    <div className="h-full flex flex-col p-5 gap-4 bg-[#0a0a1a]">
      <div className="flex-1 flex flex-col rounded-lg bg-[#06061a] border border-[rgba(255,255,255,0.06)] overflow-hidden">
        <div className="flex items-center justify-between px-4 h-11 border-b border-[#1a1a30]">
          <span className="text-[12px] font-medium text-[#606080]">Generated Prompt</span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopy}
              className="h-7 px-2 gap-1.5 text-[12px] text-[#606080] hover:text-[#b0b0c8] hover:bg-white/[0.05]"
            >
              <Copy className="w-3.5 h-3.5" />
              Copy
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleOpenV0}
              className="h-7 px-2 gap-1.5 text-[12px] text-[#6c63ff] hover:text-[#8a83ff] hover:bg-white/[0.05]"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open v0.dev
            </Button>
          </div>
        </div>
        <ScrollArea className="flex-1">
          <Textarea
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              if (selectedNode) {
                updateNodePrompt(selectedNode.id, e.target.value);
              }
            }}
            className="h-full min-h-[300px] font-mono text-[12px] bg-transparent border-0 text-[#a0a0c0] resize-none focus-visible:ring-0 p-5"
          />
        </ScrollArea>
      </div>
      
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        className={cn(
          'flex flex-col items-center justify-center gap-2 py-6 rounded-lg border-2 border-dashed transition-all',
          isDragging 
            ? 'border-[#6c63ff] bg-[rgba(108,99,255,0.1)]' 
            : 'border-[#1a1a30] hover:border-[#2a2a4a]'
        )}
      >
        <Upload className={cn('w-6 h-6', isDragging ? 'text-[#6c63ff]' : 'text-[#505070]')} />
        <p className="text-[12px] text-[#505070]">After getting v0 result, drop ZIP here</p>
      </div>
    </div>
  );
}

// Sample code for different components
function getSampleCode(nodeName: string): string {
  const name = nodeName.replace(/\s+/g, '');
  
  if (nodeName.toLowerCase().includes('timeline') || nodeName.toLowerCase().includes('transport')) {
    return `'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Track {
  id: string;
  name: string;
  color: string;
  clips: { start: number; duration: number; label: string }[];
}

interface TimelineProps {
  className?: string;
  duration?: number;
}

export function Timeline({ className, duration = 300 }: TimelineProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [zoom, setZoom] = useState(1);
  const timelineRef = useRef<HTMLDivElement>(null);

  const tracks: Track[] = [
    { id: '1', name: 'Main', color: '#6c63ff', clips: [{ start: 0, duration: 45, label: 'Intro' }] },
    { id: '2', name: 'Subs', color: '#00c853', clips: [{ start: 10, duration: 20, label: 'Caption' }] },
    { id: '3', name: 'BGM', color: '#ffd600', clips: [{ start: 0, duration: 120, label: 'Background Music' }] },
    { id: '4', name: 'SFX', color: '#ff5722', clips: [{ start: 30, duration: 5, label: 'Whoosh' }] },
    { id: '5', name: 'Overlay', color: '#e91e63', clips: [{ start: 50, duration: 30, label: 'Logo' }] },
  ];

  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= duration) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 0.1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const formatTimecode = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const frames = Math.floor((seconds % 1) * 30);
    return \`\${hrs.toString().padStart(2,'0')}:\${mins.toString().padStart(2,'0')}:\${secs.toString().padStart(2,'0')}:\${frames.toString().padStart(2,'0')}\`;
  };

  return (
    <div className={cn("flex flex-col h-full bg-[#0a0a1a]", className)}>
      {/* Transport Bar */}
      <div className="flex items-center gap-4 px-4 h-12 bg-[#111128] border-b border-[#2a2a4a]">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-10 h-10 rounded-full bg-[#e53935] hover:bg-[#f44336] flex items-center justify-center transition-colors"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-white" fill="white" />
          ) : (
            <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
          )}
        </button>
        
        <div className="font-mono text-lg text-white tracking-wider">
          {formatTimecode(currentTime)}
        </div>
        
        <select className="bg-[#1e1e3a] border border-[#2a2a4a] rounded px-2 py-1 text-white text-sm">
          <option>1.0x</option>
          <option>0.5x</option>
          <option>2.0x</option>
        </select>
      </div>

      {/* Track Area */}
      <div ref={timelineRef} className="flex-1 relative overflow-auto">
        {/* Time ruler */}
        <div className="sticky top-0 h-6 bg-[#111128] border-b border-[#1a1a30] flex">
          {Array.from({ length: Math.ceil(duration / 10) }).map((_, i) => (
            <div key={i} className="relative" style={{ width: \`\${100 * zoom}px\` }}>
              <span className="absolute left-0 text-[10px] text-[#606080]">{i * 10}s</span>
            </div>
          ))}
        </div>

        {/* Tracks */}
        {tracks.map((track) => (
          <div key={track.id} className="flex h-10 border-b border-[#1a1a30]">
            <div className="w-20 px-2 flex items-center text-[11px] text-[#808098] bg-[#0c0c1e]">
              {track.name}
            </div>
            <div className="flex-1 relative">
              {track.clips.map((clip, i) => (
                <div
                  key={i}
                  className="absolute top-1 bottom-1 rounded text-[10px] text-white px-2 flex items-center truncate"
                  style={{
                    left: \`\${(clip.start / duration) * 100}%\`,
                    width: \`\${(clip.duration / duration) * 100}%\`,
                    backgroundColor: track.color,
                  }}
                >
                  {clip.label}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Playhead */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-[#e53935] z-10 pointer-events-none"
          style={{ left: \`calc(80px + \${(currentTime / duration) * 100}%)\` }}
        >
          <div className="absolute -top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#e53935]" />
        </div>
      </div>
    </div>
  );
}`;
  }
  
  return `'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ${name}Props {
  className?: string;
  autoPlay?: boolean;
}

export function ${name}({ className, autoPlay = false }: ${name}Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Simulate data loading
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

  const handleAction = useCallback((id: number) => {
    setData(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, status: 'completed' } 
          : item
      )
    );
  }, []);

  if (isLoading) {
    return (
      <div className={cn(
        "flex items-center justify-center p-8",
        "bg-[#12122a] rounded-xl border border-[rgba(255,255,255,0.06)]",
        className
      )}>
        <div className="w-8 h-8 border-2 border-[#6c63ff] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={cn(
      "p-6 rounded-xl bg-[#12122a] border border-[rgba(255,255,255,0.06)]",
      className
    )}>
      <h2 className="text-lg font-semibold text-white mb-4">${name}</h2>
      
      <div className="space-y-3">
        {data.map((item) => (
          <div 
            key={item.id}
            className="flex items-center justify-between p-4 rounded-lg bg-[#0a0a1e] border border-[#1a1a30]"
          >
            <div>
              <h3 className="text-sm font-medium text-white">{item.title}</h3>
              <span className={cn(
                "text-xs",
                item.status === 'active' && "text-[#6c63ff]",
                item.status === 'pending' && "text-[#ffd600]",
                item.status === 'completed' && "text-[#00c853]"
              )}>
                {item.status}
              </span>
            </div>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleAction(item.id)}
              disabled={item.status === 'completed'}
              className="text-[#6c63ff] hover:bg-[#6c63ff]/10"
            >
              {item.status === 'completed' ? 'Done' : 'Complete'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}`;
}

// Main Center Panel component
export function CenterPanel() {
  const selectedNode = useSelectedNode();
  const { updateNodeCode } = useStudioStore();
  const [openTabs, setOpenTabs] = useState<string[]>(['video-timeline.tsx', 'globals.css']);
  const [activeTab, setActiveTab] = useState('video-timeline.tsx');
  
  // Get the code for the selected node
  const code = useMemo(() => {
    if (!selectedNode) return '';
    if (selectedNode.code) return selectedNode.code;
    if (selectedNode.status === 'done' || selectedNode.status === 'progress') {
      return getSampleCode(selectedNode.name);
    }
    return '';
  }, [selectedNode]);
  
  const handleCodeChange = (newCode: string) => {
    if (selectedNode) {
      updateNodeCode(selectedNode.id, newCode);
    }
  };
  
  const handleCloseTab = (filename: string) => {
    setOpenTabs(tabs => tabs.filter(t => t !== filename));
    if (activeTab === filename && openTabs.length > 1) {
      setActiveTab(openTabs.find(t => t !== filename) || openTabs[0]);
    }
  };
  
  const handleAddTab = () => {
    const newTab = 'new-file.tsx';
    if (!openTabs.includes(newTab)) {
      setOpenTabs([...openTabs, newTab]);
      setActiveTab(newTab);
    }
  };
  
  // Update tabs when node changes
  useEffect(() => {
    if (selectedNode) {
      const filename = `${selectedNode.name.toLowerCase().replace(/\s+/g, '-')}.tsx`;
      if (!openTabs.includes(filename)) {
        setOpenTabs(prev => [...prev.filter(t => t !== 'video-timeline.tsx'), filename]);
      }
      setActiveTab(filename);
    }
  }, [selectedNode?.id]);
  
  if (!selectedNode) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0a0a1a] border-x border-[#1a1a30]">
        <p className="text-[#505070] text-[13px]">Select a screen to edit</p>
      </div>
    );
  }
  
  // Show empty state for empty nodes
  if (selectedNode.status === 'empty') {
    return (
      <div className="flex-1 flex flex-col bg-[#0a0a1a] border-x border-[#1a1a30]">
        <EmptyStateView />
      </div>
    );
  }
  
  // Show prompt editor for prompt-ready nodes
  if (selectedNode.status === 'prompt') {
    return (
      <div className="flex-1 flex flex-col bg-[#0a0a1a] border-x border-[#1a1a30]">
        <PromptReadyView />
      </div>
    );
  }
  
  // Show code editor for done/progress nodes
  return (
    <div className="flex-1 flex flex-col bg-[#0a0a1a] border-x border-[#1a1a30]">
      {/* Tab bar */}
      <div className="flex items-center h-9 bg-[#08081a] border-b border-[#1a1a30]">
        <div className="flex items-center h-full">
          {openTabs.map((tab) => (
            <EditorTab
              key={tab}
              filename={tab}
              isActive={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              onClose={() => handleCloseTab(tab)}
            />
          ))}
        </div>
        <button
          onClick={handleAddTab}
          className="w-9 h-full flex items-center justify-center text-[#505070] hover:text-[#808098] hover:bg-white/[0.03]"
        >
          <Plus className="w-4 h-4" />
        </button>
        
        {/* Keyboard shortcuts hint */}
        <div className="ml-auto pr-3 flex items-center gap-4 text-[10px] text-[#404060]">
          <span>Ctrl+S Save</span>
          <span>Ctrl+P Command</span>
        </div>
      </div>
      
      {/* Code editor */}
      <div className="flex-1 overflow-hidden">
        <CodeEditor
          code={code}
          onChange={handleCodeChange}
          filename={activeTab}
        />
      </div>
    </div>
  );
}
