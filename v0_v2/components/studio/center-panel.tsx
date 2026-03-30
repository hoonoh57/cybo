'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { X, Plus, FileCode, Copy, ExternalLink, Upload } from 'lucide-react';
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
import Editor from '@monaco-editor/react';

// Tab component
function EditorTab({
  filename,
  isActive,
  onClick,
  onClose,
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
        'flex items-center gap-2 px-3 h-full cursor-pointer border-b-2 transition-all group',
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

// Monaco code editor wrapper
function CodeEditorPanel({
  code,
  onChange,
  filename,
}: {
  code: string;
  onChange?: (code: string) => void;
  filename: string;
}) {
  const language = useMemo(() => {
    if (filename.endsWith('.tsx') || filename.endsWith('.ts')) return 'typescript';
    if (filename.endsWith('.jsx') || filename.endsWith('.js')) return 'javascript';
    if (filename.endsWith('.css')) return 'css';
    if (filename.endsWith('.json')) return 'json';
    if (filename.endsWith('.html')) return 'html';
    return 'typescript';
  }, [filename]);

  const handleChange = useCallback((value: string | undefined) => {
    if (onChange && value !== undefined) {
      onChange(value);
    }
  }, [onChange]);

  return (
    <div className="h-full w-full overflow-hidden">
      <Editor
        height="100%"
        language={language}
        value={code}
        onChange={handleChange}
        theme="cybo-dark"
        beforeMount={(monaco) => {
          monaco.editor.defineTheme('cybo-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
              { token: 'comment', foreground: '546e7a', fontStyle: 'italic' },
              { token: 'keyword', foreground: 'c792ea' },
              { token: 'string', foreground: 'c3e88d' },
              { token: 'number', foreground: 'f78c6c' },
              { token: 'type', foreground: 'ffcb6b' },
              { token: 'function', foreground: '82aaff' },
              { token: 'variable', foreground: 'e0e0f0' },
              { token: 'tag', foreground: 'f07178' },
              { token: 'attribute.name', foreground: '89ddff' },
              { token: 'delimiter.bracket', foreground: '89ddff' },
            ],
            colors: {
              'editor.background': '#0a0a1a',
              'editor.foreground': '#e0e0f0',
              'editor.lineHighlightBackground': '#ffffff05',
              'editor.selectionBackground': '#6c63ff30',
              'editorCursor.foreground': '#ffffff',
              'editorLineNumber.foreground': '#2a2a4a',
              'editorLineNumber.activeForeground': '#ffffff',
              'editor.inactiveSelectionBackground': '#6c63ff15',
              'editorIndentGuide.background': '#1a1a30',
              'editorIndentGuide.activeBackground': '#2a2a4a',
              'editorGutter.background': '#08081a',
              'minimap.background': '#08081a',
              'scrollbar.shadow': '#00000000',
              'scrollbarSlider.background': '#2a2a4a80',
              'scrollbarSlider.hoverBackground': '#3a3a5a80',
              'scrollbarSlider.activeBackground': '#4a4a6a80',
            },
          });

          monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            target: monaco.languages.typescript.ScriptTarget.Latest,
            allowNonTsExtensions: true,
            moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
            module: monaco.languages.typescript.ModuleKind.CommonJS,
            noEmit: true,
            esModuleInterop: true,
            jsx: monaco.languages.typescript.JsxEmit.React,
            reactNamespace: 'React',
            allowJs: true,
          });
        }}
        options={{
          fontSize: 13,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
          fontLigatures: true,
          minimap: { enabled: true, scale: 2 },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          renderLineHighlight: 'all',
          bracketPairColorization: { enabled: true },
          autoIndent: 'full',
          formatOnPaste: true,
          formatOnType: true,
          tabSize: 2,
          wordWrap: 'on',
          padding: { top: 8 },
          lineNumbers: 'on',
          folding: true,
          suggest: { showKeywords: true, showSnippets: true },
        }}
      />
    </div>
  );
}

// Sample code generator
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

export function Timeline({ className, duration = 300 }: { className?: string; duration?: number }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [zoom, setZoom] = useState(1);

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
      setCurrentTime(prev => prev >= duration ? (setIsPlaying(false), 0) : prev + 0.1);
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  return (
    <div className={cn("flex flex-col h-full bg-[#0a0a1a]", className)}>
      <div className="flex items-center gap-4 px-4 h-12 bg-[#111128] border-b border-[#2a2a4a]">
        <button onClick={() => setIsPlaying(!isPlaying)}
          className="w-10 h-10 rounded-full bg-[#e53935] hover:bg-[#f44336] flex items-center justify-center">
          {isPlaying ? <Pause className="w-5 h-5 text-white" fill="white" /> : <Play className="w-5 h-5 text-white ml-0.5" fill="white" />}
        </button>
      </div>
      {tracks.map(track => (
        <div key={track.id} className="flex h-10 border-b border-[#1a1a30]">
          <div className="w-20 px-2 flex items-center text-[11px] text-[#808098] bg-[#0c0c1e]">{track.name}</div>
          <div className="flex-1 relative">
            {track.clips.map((clip, i) => (
              <div key={i} className="absolute top-1 bottom-1 rounded text-[10px] text-white px-2 flex items-center"
                style={{ left: \`\${(clip.start/duration)*100}%\`, width: \`\${(clip.duration/duration)*100}%\`, backgroundColor: track.color }}>
                {clip.label}
              </div>
            ))}
          </div>
        </div>
      ))}
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
}

export function ${name}({ className }: ${name}Props) {
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
      <h2 className="text-lg font-semibold text-white mb-4">${name}</h2>
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
}`;
}

// Empty state setup form
function EmptyStateView() {
  const { updateNodePrompt } = useStudioStore();
  const selectedNode = useSelectedNode();
  const [description, setDescription] = useState('');
  const [screenType, setScreenType] = useState<ScreenType>('Dashboard');

  const handleGeneratePrompt = () => {
    if (!selectedNode || !description) return;
    const prompt = `Create a ${screenType} component:\n\n${description}\n\nDark theme #08081a, accent #6c63ff, Inter font, 150ms transitions, border-radius 8px.`;
    updateNodePrompt(selectedNode.id, prompt);
  };

  return (
    <div className="h-full flex items-center justify-center bg-[#0a0a1a]">
      <div className="w-full max-w-[480px] p-8 rounded-xl bg-[#10102a] border border-[rgba(255,255,255,0.06)]">
        <h3 className="text-[16px] font-semibold text-white mb-1">Set up this screen</h3>
        <p className="text-[13px] text-[#606080] mb-6">Describe what this screen should look like</p>
        <div className="space-y-4">
          <Textarea
            placeholder="What should this screen contain?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full bg-[#0a0a1e] border border-[#1a1a30] rounded-lg text-[13px] text-white placeholder:text-[#303050] resize-none focus:border-[#6c63ff]"
          />
          <Select value={screenType} onValueChange={(v) => setScreenType(v as ScreenType)}>
            <SelectTrigger className="w-full h-10 bg-[#0a0a1e] border border-[#1a1a30] rounded-lg text-[13px] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#12122a] border-[rgba(255,255,255,0.06)]">
              {screenTypes.map((type) => (
                <SelectItem key={type} value={type} className="text-[13px] text-[#b0b0c8]">{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleGeneratePrompt} disabled={!description}
            className="w-full h-10 rounded-lg text-[13px] font-semibold text-white disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #6c63ff 0%, #5b52ee 100%)' }}>
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

  const handleCopy = async () => { await navigator.clipboard.writeText(prompt); };
  const handleOpenV0 = () => { window.open('https://v0.dev', '_blank'); };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && selectedNode) {
      const file = files[0];
      if (file.name.endsWith('.zip')) {
        updateNodeCode(selectedNode.id, `// Imported from ${file.name}\n// TODO: extract and load component code`);
      }
    }
  }, [selectedNode, updateNodeCode]);

  return (
    <div className="h-full flex flex-col p-5 gap-4 bg-[#0a0a1a]">
      <div className="flex-1 flex flex-col rounded-lg bg-[#06061a] border border-[rgba(255,255,255,0.06)] overflow-hidden">
        <div className="flex items-center justify-between px-4 h-11 border-b border-[#1a1a30]">
          <span className="text-[12px] font-medium text-[#606080]">Generated Prompt</span>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={handleCopy}
              className="h-7 px-2 gap-1.5 text-[12px] text-[#606080] hover:text-[#b0b0c8]">
              <Copy className="w-3.5 h-3.5" /> Copy
            </Button>
            <Button size="sm" variant="ghost" onClick={handleOpenV0}
              className="h-7 px-2 gap-1.5 text-[12px] text-[#6c63ff] hover:text-[#8a83ff]">
              <ExternalLink className="w-3.5 h-3.5" /> Open v0.dev
            </Button>
          </div>
        </div>
        <ScrollArea className="flex-1">
          <Textarea value={prompt}
            onChange={(e) => { setPrompt(e.target.value); if (selectedNode) updateNodePrompt(selectedNode.id, e.target.value); }}
            className="h-full min-h-[300px] font-mono text-[12px] bg-transparent border-0 text-[#a0a0c0] resize-none focus-visible:ring-0 p-5" />
        </ScrollArea>
      </div>
      <div onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        className={cn('flex flex-col items-center justify-center gap-2 py-6 rounded-lg border-2 border-dashed transition-all',
          isDragging ? 'border-[#6c63ff] bg-[rgba(108,99,255,0.1)]' : 'border-[#1a1a30] hover:border-[#2a2a4a]')}>
        <Upload className={cn('w-6 h-6', isDragging ? 'text-[#6c63ff]' : 'text-[#505070]')} />
        <p className="text-[12px] text-[#505070]">Drop v0 ZIP here</p>
      </div>
    </div>
  );
}

// Main Center Panel
export function CenterPanel() {
  const selectedNode = useSelectedNode();
  const { updateNodeCode } = useStudioStore();
  const [openTabs, setOpenTabs] = useState<Map<string, { code: string; filePath: string }>>(new Map());
  const [activeTab, setActiveTab] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  // Get current tab data
  const currentTab = openTabs.get(activeTab);
  const currentCode = currentTab?.code || '';
  const currentFilePath = currentTab?.filePath || '';

  // Load file into a tab
  const loadFileToTab = useCallback(async (tabName: string, nodePath: string, fallbackCode: string) => {
    try {
      const res = await fetch(`/api/files?path=${encodeURIComponent(nodePath)}`);
      const data = await res.json();
      if (data.content) {
        setOpenTabs(prev => new Map(prev).set(tabName, { code: data.content, filePath: nodePath }));
      } else {
        setOpenTabs(prev => new Map(prev).set(tabName, { code: fallbackCode, filePath: nodePath }));
      }
    } catch {
      setOpenTabs(prev => new Map(prev).set(tabName, { code: fallbackCode, filePath: nodePath }));
    }
  }, []);

  // When node changes, open its tab
  useEffect(() => {
    if (!selectedNode) return;
    if (selectedNode.status === 'empty' || selectedNode.status === 'prompt') return;

    const tabName = `${selectedNode.name.toLowerCase().replace(/\s+/g, '-')}.tsx`;
    const nodePath = selectedNode.filePath || `components/${selectedNode.name.replace(/\s+/g, '')}.tsx`;
    const fallback = selectedNode.code || getSampleCode(selectedNode.name);

    if (!openTabs.has(tabName)) {
      loadFileToTab(tabName, nodePath, fallback);
    }
    setActiveTab(tabName);
  }, [selectedNode?.id]);

  // Update code for active tab
  const handleCodeChange = (newCode: string) => {
    if (!activeTab) return;
    setOpenTabs(prev => {
      const next = new Map(prev);
      const existing = next.get(activeTab);
      if (existing) {
        next.set(activeTab, { ...existing, code: newCode });
      }
      return next;
    });
  };

  // Ctrl+S to save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        const tab = openTabs.get(activeTab);
        if (!tab) return;
        setIsSaving(true);
        fetch('/api/files', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: tab.filePath, content: tab.code }),
        })
          .then(res => res.json())
          .then(data => {
            if (data.saved && selectedNode) {
              updateNodeCode(selectedNode.id, tab.code);
            }
          })
          .finally(() => setTimeout(() => setIsSaving(false), 1000));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, openTabs, selectedNode]);

  const handleCloseTab = (tabName: string) => {
    setOpenTabs(prev => {
      const next = new Map(prev);
      next.delete(tabName);
      return next;
    });
    if (activeTab === tabName) {
      const remaining = [...openTabs.keys()].filter(k => k !== tabName);
      setActiveTab(remaining.length > 0 ? remaining[remaining.length - 1] : '');
    }
  };

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  if (!selectedNode) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#0a0a1a]">
        <p className="text-[#505070] text-[13px]">Select a screen to edit</p>
      </div>
    );
  }

  if (selectedNode.status === 'empty') {
    return <div className="w-full h-full bg-[#0a0a1a]"><EmptyStateView /></div>;
  }

  if (selectedNode.status === 'prompt') {
    return <div className="w-full h-full bg-[#0a0a1a]"><PromptReadyView /></div>;
  }

  return (
    <div className="w-full h-full flex flex-col bg-[#0a0a1a]">
      <div className="flex items-center h-9 bg-[#08081a] border-b border-[#1a1a30] shrink-0">
        <div className="flex items-center h-full overflow-x-auto">
          {[...openTabs.keys()].map((tab) => (
            <EditorTab key={tab} filename={tab} isActive={activeTab === tab}
              onClick={() => handleTabClick(tab)} onClose={() => handleCloseTab(tab)} />
          ))}
        </div>
        <button onClick={() => {
          const name = `untitled-${Date.now()}.tsx`;
          setOpenTabs(prev => new Map(prev).set(name, { code: '', filePath: `components/${name}` }));
          setActiveTab(name);
        }} className="w-9 h-full flex items-center justify-center text-[#505070] hover:text-[#808098] hover:bg-white/[0.03]">
          <Plus className="w-4 h-4" />
        </button>
        <div className="ml-auto pr-3 flex items-center gap-4 text-[10px] text-[#404060]">
          {isSaving && <span className="text-[#00c853]">Saved!</span>}
          <span className="text-[#505070] truncate max-w-[200px]">{currentFilePath}</span>
          <span>Ctrl+S Save</span>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <CodeEditorPanel code={currentCode} onChange={handleCodeChange} filename={activeTab} />
      </div>
    </div>
  );
}
