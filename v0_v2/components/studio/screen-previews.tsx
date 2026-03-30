'use client';

import { Play, Volume2, Maximize2, User, Shield, Sparkles, Video, Music, Type, Layers, Image } from 'lucide-react';

// HomeDashboard Preview - Full-scale component that gets scaled down
export function HomeDashboardPreview() {
  return (
    <div className="w-full min-h-[600px] bg-[#0a0a1a] text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#0c0c1e] border-b border-[#1a1a30]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6c63ff] to-[#a855f7] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-[15px] text-white">AI-Studio</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(0,200,83,0.1)] border border-[rgba(0,200,83,0.2)]">
            <Shield className="w-3.5 h-3.5 text-[#00c853]" />
            <span className="text-[12px] text-[#00c853] font-medium">100% Local Processing</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6c63ff] to-[#a855f7] flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Hero Cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Left Card - Gradient */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-[#6c63ff] to-[#a855f7] h-32 flex flex-col justify-between">
            <div>
              <div className="text-[12px] text-white/70 mb-1">Create New Project</div>
              <div className="text-[18px] font-semibold text-white">AI Video Editor</div>
            </div>
            <div className="text-[13px] text-white/60">Powered by local AI</div>
          </div>
          {/* Right Card - Dark Surface */}
          <div className="p-6 rounded-xl bg-[#12122a] border border-[rgba(255,255,255,0.06)] h-32 flex flex-col justify-between">
            <div>
              <div className="text-[12px] text-white/50 mb-1">Quick Start</div>
              <div className="text-[18px] font-semibold text-white">Continue Editing</div>
            </div>
            <div className="text-[13px] text-white/40">3 projects in progress</div>
          </div>
        </div>
        
        {/* Tool Grid - 5 squares */}
        <div className="grid grid-cols-5 gap-3">
          {[
            { icon: Video, label: 'Import' },
            { icon: Layers, label: 'Effects' },
            { icon: Music, label: 'Audio' },
            { icon: Type, label: 'Captions' },
            { icon: Sparkles, label: 'AI Tools' },
          ].map(({ icon: Icon, label }, i) => (
            <div key={i} className="aspect-square rounded-xl bg-[#12122a] border border-[rgba(255,255,255,0.06)] flex flex-col items-center justify-center gap-2 hover:border-[#6c63ff]/50 transition-colors cursor-pointer">
              <Icon className="w-6 h-6 text-[#6c63ff]" />
              <span className="text-[11px] text-[#707090]">{label}</span>
            </div>
          ))}
        </div>
        
        {/* Recent Projects */}
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#505070] mb-3">Recent Projects</div>
          <div className="space-y-2">
            {[
              { name: 'Product Demo Video', progress: 85, color: '#00c853' },
              { name: 'Tutorial Series Ep.3', progress: 45, color: '#ffd600' },
              { name: 'Brand Introduction', progress: 20, color: '#6c63ff' },
            ].map((project, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[#12122a] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.1)] transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-[#1a1a30] flex items-center justify-center">
                  <Video className="w-5 h-5 text-[#505070]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] text-white font-medium truncate">{project.name}</div>
                  <div className="h-1.5 bg-[#1a1a30] rounded-full mt-2 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all" 
                      style={{ width: `${project.progress}%`, backgroundColor: project.color }}
                    />
                  </div>
                </div>
                <span className="text-[12px] text-[#606080]">{project.progress}%</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Templates */}
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#505070] mb-3">Templates</div>
          <div className="grid grid-cols-4 gap-3">
            {['Intro', 'Outro', 'Lower Third', 'Transition'].map((name, i) => (
              <div key={i} className="aspect-video rounded-lg bg-[#12122a] border border-[rgba(255,255,255,0.06)] flex items-center justify-center hover:border-[rgba(255,255,255,0.1)] transition-colors cursor-pointer">
                <span className="text-[11px] text-[#606080]">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Timeline Preview - Full-scale component that gets scaled down
export function TimelinePreview() {
  return (
    <div className="w-full min-h-[600px] bg-[#0a0a1a] text-white">
      {/* Transport Bar */}
      <div className="flex items-center gap-4 px-4 py-3 bg-[#0c0c1e] border-b border-[#1a1a30]">
        <div className="font-mono text-[14px] text-[#707090] w-24">00:01:24:15</div>
        <button className="w-10 h-10 rounded-full bg-[#ff4444] flex items-center justify-center shadow-lg shadow-[#ff4444]/30">
          <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
        </button>
        <div className="font-mono text-[14px] text-[#707090] w-24">00:05:30:00</div>
        <div className="flex-1" />
        <div className="text-[13px] text-[#707090] px-3 py-1.5 bg-[#12122a] border border-[rgba(255,255,255,0.06)] rounded-lg cursor-pointer hover:border-[rgba(255,255,255,0.1)]">
          1.0x
        </div>
      </div>
      
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#0c0c1e] border-b border-[#1a1a30]">
        {['Cut', 'Split', 'Delete', 'Undo', 'Redo', 'Snap', 'Ripple'].map((tool, i) => (
          <div key={i} className="px-3 py-1.5 text-[12px] text-[#606080] bg-[#12122a] border border-[rgba(255,255,255,0.06)] rounded-md hover:border-[rgba(255,255,255,0.1)] cursor-pointer transition-colors">
            {tool}
          </div>
        ))}
      </div>
      
      {/* Ruler */}
      <div className="flex items-end h-8 px-4 bg-[#08081a] border-b border-[#1a1a30]">
        {['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00'].map((time, i) => (
          <div key={i} className="flex-1 text-[10px] text-[#505070] border-l border-[#2a2a4a] pl-1 pb-1">
            {time}
          </div>
        ))}
      </div>
      
      {/* Tracks Container */}
      <div className="relative bg-[#08081a]">
        {/* Red Playhead */}
        <div className="absolute top-0 bottom-0 left-[35%] w-0.5 bg-red-500 z-20">
          <div className="w-3 h-3 bg-red-500 rounded-full -ml-[5px] -mt-1.5" />
        </div>
        
        {/* Track Rows */}
        <div className="space-y-1 p-2">
          {/* Main Video Track */}
          <div className="flex items-center gap-2 h-14 bg-[#12122a] rounded-lg px-3">
            <div className="w-20 flex items-center gap-2 shrink-0">
              <Video className="w-4 h-4 text-[#448aff]" />
              <span className="text-[12px] text-[#707090]">Main</span>
            </div>
            <div className="flex-1 flex gap-1 items-center">
              <div className="w-[18%] h-10 bg-[#448aff] rounded-lg flex items-center justify-center text-[11px] text-white font-medium shadow-lg shadow-[#448aff]/20">
                Intro
              </div>
              <div className="w-[28%] h-10 bg-[#448aff] rounded-lg flex items-center justify-center text-[11px] text-white font-medium shadow-lg shadow-[#448aff]/20">
                Part A - Interview
              </div>
              <div className="w-[22%] h-10 bg-[#448aff] rounded-lg flex items-center justify-center text-[11px] text-white font-medium shadow-lg shadow-[#448aff]/20">
                Part B - Demo
              </div>
            </div>
          </div>
          
          {/* Subtitle Track */}
          <div className="flex items-center gap-2 h-14 bg-[#12122a] rounded-lg px-3">
            <div className="w-20 flex items-center gap-2 shrink-0">
              <Type className="w-4 h-4 text-[#a855f7]" />
              <span className="text-[12px] text-[#707090]">Subs</span>
            </div>
            <div className="flex-1 flex gap-1 items-center">
              <div className="w-[12%] ml-[8%] h-8 bg-[#a855f7] rounded-md flex items-center justify-center text-[10px] text-white">
                Hello everyone
              </div>
              <div className="w-[15%] ml-[18%] h-8 bg-[#a855f7] rounded-md flex items-center justify-center text-[10px] text-white">
                Today we will...
              </div>
            </div>
          </div>
          
          {/* BGM Track */}
          <div className="flex items-center gap-2 h-14 bg-[#12122a] rounded-lg px-3">
            <div className="w-20 flex items-center gap-2 shrink-0">
              <Music className="w-4 h-4 text-[#00c853]" />
              <span className="text-[12px] text-[#707090]">BGM</span>
            </div>
            <div className="flex-1">
              <div className="w-[85%] h-10 bg-[#00c853] rounded-lg flex items-center px-2 gap-0.5 shadow-lg shadow-[#00c853]/20">
                {/* Waveform bars */}
                {Array.from({ length: 80 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="w-0.5 bg-white/50 rounded-full"
                    style={{ height: `${Math.random() * 60 + 30}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* SFX Track */}
          <div className="flex items-center gap-2 h-14 bg-[#12122a] rounded-lg px-3">
            <div className="w-20 flex items-center gap-2 shrink-0">
              <Volume2 className="w-4 h-4 text-[#1e90ff]" />
              <span className="text-[12px] text-[#707090]">SFX</span>
            </div>
            <div className="flex-1 flex gap-1 items-center">
              <div className="w-[6%] ml-[5%] h-8 bg-[#1e3a5f] rounded-md flex items-center justify-center text-[9px] text-white/70">
                Whoosh
              </div>
              <div className="w-[5%] ml-[25%] h-8 bg-[#1e3a5f] rounded-md flex items-center justify-center text-[9px] text-white/70">
                Click
              </div>
              <div className="w-[6%] ml-[15%] h-8 bg-[#1e3a5f] rounded-md flex items-center justify-center text-[9px] text-white/70">
                Pop
              </div>
            </div>
          </div>
          
          {/* Overlay Track */}
          <div className="flex items-center gap-2 h-14 bg-[#12122a] rounded-lg px-3">
            <div className="w-20 flex items-center gap-2 shrink-0">
              <Layers className="w-4 h-4 text-[#cd853f]" />
              <span className="text-[12px] text-[#707090]">Overlay</span>
            </div>
            <div className="flex-1 flex items-center">
              <div className="w-[12%] ml-[70%] h-8 bg-[#8b5a2b] rounded-md flex items-center justify-center text-[10px] text-white">
                Logo
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Zoom Slider */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#0c0c1e] border-t border-[#1a1a30]">
        <span className="text-[11px] text-[#505070]">Zoom</span>
        <div className="flex-1 h-1.5 bg-[#1a1a30] rounded-full">
          <div className="w-[60%] h-full bg-[#6c63ff] rounded-full" />
        </div>
        <span className="text-[11px] text-[#707090]">100%</span>
      </div>
    </div>
  );
}

// Video Preview Preview
export function VideoPreviewPreview() {
  return (
    <div className="w-full min-h-[600px] bg-[#0a0a1a] p-4">
      <div className="flex gap-4 h-full">
        {/* Video Player Area */}
        <div className="flex-1 flex flex-col">
          {/* 16:9 Video Container */}
          <div className="aspect-video bg-[#12122a] rounded-xl flex items-center justify-center relative overflow-hidden border border-[rgba(255,255,255,0.06)]">
            {/* Gradient background for video placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a30] to-[#0a0a1a]" />
            
            {/* Play Button Overlay */}
            <div className="relative w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors">
              <Play className="w-8 h-8 text-white ml-1" fill="white" />
            </div>
            
            {/* Frame indicator */}
            <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/60 rounded-md text-[12px] text-white font-mono">
              1920 x 1080
            </div>
            
            {/* Timecode */}
            <div className="absolute bottom-4 left-4 px-2 py-1 bg-black/60 rounded-md text-[12px] text-white font-mono">
              00:01:24:15
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 h-2 bg-[#1a1a30] rounded-full overflow-hidden">
            <div className="w-[35%] h-full bg-[#6c63ff] rounded-full" />
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4">
              <button className="w-12 h-12 rounded-xl bg-[#6c63ff] flex items-center justify-center hover:bg-[#5b52ee] transition-colors">
                <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
              </button>
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-[#606080]" />
                <div className="w-24 h-1.5 bg-[#1a1a30] rounded-full">
                  <div className="w-[70%] h-full bg-[#6c63ff] rounded-full" />
                </div>
              </div>
              <span className="text-[13px] text-[#707090] font-mono">01:24 / 05:30</span>
            </div>
            <button className="w-10 h-10 rounded-lg bg-[#12122a] border border-[rgba(255,255,255,0.06)] flex items-center justify-center hover:border-[rgba(255,255,255,0.1)] transition-colors">
              <Maximize2 className="w-5 h-5 text-[#606080]" />
            </button>
          </div>
        </div>
        
        {/* Right Property Panel */}
        <div className="w-64 bg-[#12122a] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 space-y-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#505070]">Properties</div>
          {[
            { label: 'Brightness', value: 50 },
            { label: 'Contrast', value: 50 },
            { label: 'Saturation', value: 50 },
            { label: 'Exposure', value: 0 },
            { label: 'Highlights', value: 0 },
            { label: 'Shadows', value: 0 },
          ].map((prop) => (
            <div key={prop.label} className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[12px] text-[#707090]">{prop.label}</span>
                <span className="text-[12px] text-[#909090] font-mono">{prop.value}</span>
              </div>
              <div className="h-1.5 bg-[#1a1a30] rounded-full">
                <div 
                  className="h-full bg-[#6c63ff] rounded-full" 
                  style={{ width: `${prop.value + 50}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Empty State Preview
export function EmptyStatePreview() {
  return (
    <div className="w-full h-[400px] border-2 border-dashed border-[#2a2a4a] rounded-xl flex flex-col items-center justify-center bg-[#0a0a1a]">
      <div className="w-16 h-16 rounded-xl bg-[#12122a] border border-[rgba(255,255,255,0.06)] flex items-center justify-center mb-4">
        <Image className="w-8 h-8 text-[#333350]" />
      </div>
      <p className="text-[14px] text-[#505070] font-medium">No preview available</p>
      <p className="text-[12px] text-[#404060] mt-1">Generate this screen first</p>
    </div>
  );
}
