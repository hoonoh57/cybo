'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { X, Plus, FileCode } from 'lucide-react';
import { useStudioStore, useSelectedNode } from '@/lib/studio-store';
import { screenTypes, type ScreenType } from '@/lib/studio-types';
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
import { Copy, ExternalLink, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import Editor from '@monaco-editor/react';

/* ─── Tab ─── */
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
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="w-4 h-4 flex items-center justify-center rounded hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

/* ─── Monaco wrapper ─── */
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
    if (filename.endsWith('.css')) return 'css';
    if (filename.endsWith('.json')) return 'json';
    if (filename.endsWith('.html')) return 'html';
    return 'typescript';
  }, [filename]);

  return (
    <div className="h-full w-full overflow-hidden">
      <Editor
        height="100%"
        language={language}
        value={code}
        onChange={(v) => onChange?.(v ?? '')}
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
              'editorIndentGuide.background': '#1a1a30',
              'editorIndentGuide.activeBackground': '#2a2a4a',
              'editorGutter.background': '#08081a',
              'minimap.background': '#08081a',
              'scrollbarSlider.background': '#2a2a4a80',
              'scrollbarSlider.hoverBackground': '#3a3a5a80',
              'scrollbarSlider.activeBackground': '#4a4a6a80',
            },
          });
          monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            target: monaco.languages.typescript.ScriptTarget.Latest,
            allowNonTsExtensions: true,
            jsx: monaco.languages.typescript.JsxEmit.React,
            moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
            module: monaco.languages.typescript.ModuleKind.CommonJS,
            noEmit: true,
            esModuleInterop: true,
            allowJs: true,
          });
        }}
        options={{
          fontSize: 13,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
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

/* ─── Sample code ─── */
function getSampleCode(nodeName: string): string {
  const name = nodeName.replace(/\s+/g, '');
  if (
    nodeName.toLowerCase().includes('timeline') ||
    nodeName.toLowerCase().includes('transport')
  ) {
    return `'use client';\n\nimport { useState, useRef, useEffect } from 'react';\nimport { Play, Pause } from 'lucide-react';\nimport { cn } from '@/lib/utils';\n\nexport interface TimelineProps {\n  className?: string;\n  duration?: number;\n}\n\nexport function Timeline({ className, duration = 300 }: TimelineProps) {\n  const [isPlaying, setIsPlaying] = useState(false);\n  const [currentTime, setCurrentTime] = useState(0);\n\n  useEffect(() => {\n    if (!isPlaying) return;\n    const id = setInterval(() => {\n      setCurrentTime(prev => (prev >= duration ? (setIsPlaying(false), 0) : prev + 0.1));\n    }, 100);\n    return () => clearInterval(id);\n  }, [isPlaying, duration]);\n\n  return (\n    <div className={cn("w-full h-full flex flex-col bg-[#0a0a1a]", className)}>\n      <div className="flex items-center gap-4 px-4 h-12 bg-[#111128] border-b border-[#2a2a4a]">\n        <button\n          onClick={() => setIsPlaying(!isPlaying)}\n          className="w-10 h-10 rounded-full bg-[#6c63ff] flex items-center justify-center"\n        >\n          {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white ml-0.5" />}\n        </button>\n        <span className="font-mono text-white">{currentTime.toFixed(1)}s / {duration}s</span>\n      </div>\n      <div className="flex-1 bg-[#0c0c1e]" />\n    </div>\n  );\n}`;
  }
  return `'use client';\n\nimport { cn } from '@/lib/utils';\n\nexport interface ${name}Props {\n  className?: string;\n}\n\nexport function ${name}({ className }: ${name}Props) {\n  return (\n    <div className={cn("w-full h-full p-6 bg-[#0a0a1a]", className)}>\n      <h2 className="text-lg font-semibold text-white mb-4">${name}</h2>\n      <p className="text-[#808098] text-sm">Component implementation here.</p>\n    </div>\n  );\n}`;
}

/* ─── EmptyStateView ─── */
function EmptyStateView() {
  const { updateNodePrompt } = useStudioStore();
  const selectedNode = useSelectedNode();
  const [description, setDescription] = useState('');
  const [screenType, setScreenType] = useState<ScreenType>('Dashboard');

  const handleGeneratePrompt = () => {
    if (!selectedNode || !description) return;
    const prompt = `Create a ${screenType} component:\n${description}\n\nDesign: dark theme #08081a, accent #6c63ff, card #12122a, responsive.`;
    updateNodePrompt(selectedNode.id, prompt);
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-[#0a0a1a]">
      <div className="w-full max-w-[480px] p-8 rounded-xl bg-[#10102a] border border-[rgba(255,255,255,0.06)]">
        <h3 className="text-[16px] font-semibold text-white mb-1">Set up this screen</h3>
        <p className="text-[13px] text-[#606080] mb-6">Describe what this screen should look like</p>
        <div className="space-y-4">
          <Textarea
            placeholder="Describe layout, components, functionality..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-[120px] bg-[#0a0a1e] border border-[#1a1a30] rounded-lg text-[13px] text-white placeholder:text-[#303050] resize-none"
          />
          <Select value={screenType} onValueChange={(v) => setScreenType(v as ScreenType)}>
            <SelectTrigger className="w-full h-10 bg-[#0a0a1e] border border-[#1a1a30] text-[13px] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#12122a] border-[rgba(255,255,255,0.06)]">
              {screenTypes.map((t) => (
                <SelectItem key={t} value={t} className="text-[13px] text-[#b0b0c8]">
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleGeneratePrompt}
            disabled={!description}
            className="w-full h-10 bg-[#6c63ff] hover:bg-[#5b52ee] text-white text-[13px] font-semibold disabled:opacity-50"
          >
            Generate Prompt
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ─── PromptReadyView ─── */
function PromptReadyView() {
  const { updateNodePrompt, updateNodeCode } = useStudioStore();
  const selectedNode = useSelectedNode();
  const [prompt, setPrompt] = useState(selectedNode?.prompt || '');
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files.length > 0 && selectedNode && files[0].name.endsWith('.zip')) {
        updateNodeCode(selectedNode.id, `// Imported from ${files[0].name}`);
      }
    },
    [selectedNode, updateNodeCode]
  );

  return (
    <div className="w-full h-full flex flex-col p-5 gap-4 bg-[#0a0a1a]">
      <div className="flex-1 flex flex-col rounded-lg bg-[#06061a] border border-[rgba(255,255,255,0.06)] overflow-hidden">
        <div className="flex items-center justify-between px-4 h-11 border-b border-[#1a1a30]">
          <span className="text-[12px] font-medium text-[#606080]">Generated Prompt</span>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => navigator.clipboard.writeText(prompt)} className="h-7 px-2 gap-1.5 text-[12px] text-[#606080]">
              <Copy className="w-3.5 h-3.5" /> Copy
            </Button>
            <Button size="sm" variant="ghost" onClick={() => window.open('https://v0.dev', '_blank')} className="h-7 px-2 gap-1.5 text-[12px] text-[#6c63ff]">
              <ExternalLink className="w-3.5 h-3.5" /> Open v0
            </Button>
          </div>
        </div>
        <ScrollArea className="flex-1">
          <Textarea
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              if (selectedNode) updateNodePrompt(selectedNode.id, e.target.value);
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
          isDragging ? 'border-[#6c63ff] bg-[rgba(108,99,255,0.1)]' : 'border-[#1a1a30]'
        )}
      >
        <Upload className={cn('w-6 h-6', isDragging ? 'text-[#6c63ff]' : 'text-[#505070]')} />
        <p className="text-[12px] text-[#505070]">Drop v0 ZIP here</p>
      </div>
    </div>
  );
}

/* ─── Main CenterPanel ─── */
export function CenterPanel() {
  const selectedNode = useSelectedNode();
  const { updateNodeCode } = useStudioStore();

  // Map<tabName, {code, filePath}>
  const [openTabs, setOpenTabs] = useState<Map<string, { code: string; filePath: string }>>(new Map());
  const [activeTab, setActiveTab] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const currentTab = openTabs.get(activeTab);
  const currentCode = currentTab?.code || '';
  const currentFilePath = currentTab?.filePath || '';

  // Load file content for a tab
  const loadFileToTab = useCallback(
    async (tabName: string, nodePath: string, fallbackCode: string) => {
      try {
        const res = await fetch(`/api/files?path=${encodeURIComponent(nodePath)}`);
        const data = await res.json();
        setOpenTabs((prev) =>
          new Map(prev).set(tabName, {
            code: data.content || fallbackCode,
            filePath: nodePath,
          })
        );
      } catch {
        setOpenTabs((prev) =>
          new Map(prev).set(tabName, { code: fallbackCode, filePath: nodePath })
        );
      }
    },
    []
  );

  // When selected node changes, open/focus tab
  useEffect(() => {
    if (!selectedNode) return;
    if (selectedNode.status === 'empty' || selectedNode.status === 'prompt') return;

    const tabName = `${selectedNode.name.toLowerCase().replace(/\s+/g, '-')}.tsx`;
    const nodePath =
      selectedNode.filePath ||
      `components/${selectedNode.name.replace(/\s+/g, '')}.tsx`;
    const fallback = selectedNode.code || getSampleCode(selectedNode.name);

    if (!openTabs.has(tabName)) {
      loadFileToTab(tabName, nodePath, fallback);
    }
    setActiveTab(tabName);
  }, [selectedNode?.id]);

  // Update code in-memory
  const handleCodeChange = (newCode: string) => {
    if (!activeTab) return;
    setOpenTabs((prev) => {
      const next = new Map(prev);
      const existing = next.get(activeTab);
      if (existing) next.set(activeTab, { ...existing, code: newCode });
      return next;
    });
  };

  // Ctrl+S save
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
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
          .then((r) => r.json())
          .then((d) => {
            if (d.saved && selectedNode) updateNodeCode(selectedNode.id, tab.code);
          })
          .finally(() => setTimeout(() => setIsSaving(false), 1000));
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeTab, openTabs, selectedNode]);

  const handleCloseTab = (tabName: string) => {
    setOpenTabs((prev) => {
      const next = new Map(prev);
      next.delete(tabName);
      return next;
    });
    if (activeTab === tabName) {
      const remaining = [...openTabs.keys()].filter((k) => k !== tabName);
      setActiveTab(remaining.length > 0 ? remaining[remaining.length - 1] : '');
    }
  };

  if (!selectedNode) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#0a0a1a]">
        <p className="text-[#505070] text-[13px]">Select a screen to edit</p>
      </div>
    );
  }
  if (selectedNode.status === 'empty') return <EmptyStateView />;
  if (selectedNode.status === 'prompt') return <PromptReadyView />;

  return (
    <div className="w-full h-full flex flex-col bg-[#0a0a1a]">
      {/* Tab bar */}
      <div className="flex items-center h-9 bg-[#08081a] border-b border-[#1a1a30] shrink-0">
        <div className="flex items-center h-full overflow-x-auto">
          {[...openTabs.keys()].map((tab) => (
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
          onClick={() => {
            const name = `untitled-${Date.now()}.tsx`;
            setOpenTabs((p) => new Map(p).set(name, { code: '', filePath: `components/${name}` }));
            setActiveTab(name);
          }}
          className="w-9 h-full flex items-center justify-center text-[#505070] hover:text-[#808098] hover:bg-white/[0.03]"
        >
          <Plus className="w-4 h-4" />
        </button>
        <div className="ml-auto pr-3 flex items-center gap-4 text-[10px] text-[#404060]">
          {isSaving && <span className="text-[#00c853]">Saved!</span>}
          <span className="text-[#505070] truncate max-w-[200px]">{currentFilePath}</span>
          <span>Ctrl+S Save</span>
        </div>
      </div>
      {/* Monaco */}
      <div className="flex-1 overflow-hidden">
        <CodeEditorPanel code={currentCode} onChange={handleCodeChange} filename={activeTab} />
      </div>
    </div>
  );
}
