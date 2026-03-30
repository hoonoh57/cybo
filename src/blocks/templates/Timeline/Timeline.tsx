import React, { useState, useRef } from 'react';
import styles from './Timeline.module.css';
import { TransportBar } from '../../organisms/TransportBar/TransportBar';
import { TimelineToolbar } from '../../organisms/TimelineToolbar/TimelineToolbar';
import { TimelineRuler } from '../../molecules/TimelineRuler/TimelineRuler';
import { TrackLane } from '../../molecules/TrackLane/TrackLane';
import { VideoClip } from '../../molecules/VideoClip/VideoClip';
import { SubtitleClip } from '../../molecules/SubtitleClip/SubtitleClip';
import { AudioClip } from '../../molecules/AudioClip/AudioClip';
import { Playhead } from '../../atoms/Playhead/Playhead';
import { ZoomSlider } from '../../atoms/ZoomSlider/ZoomSlider';

interface ClipData { id: string; name: string; start: number; duration: number; }
interface TrackData { id: string; name: string; icon: string; type: 'main'|'subtitle'|'bgm'|'effect'|'overlay'; muted: boolean; locked: boolean; visible: boolean; clips: ClipData[]; }

const initialTracks: TrackData[] = [
  { id: 'main', name: 'Main', icon: 'M', type: 'main', muted: false, locked: false, visible: true, clips: [
    { id: 'c1', name: 'Intro', start: 0, duration: 30 },
    { id: 'c2', name: 'Part A', start: 35, duration: 90 },
    { id: 'c3', name: 'Part B', start: 130, duration: 120 },
  ]},
  { id: 'sub', name: 'Subtitle', icon: 'S', type: 'subtitle', muted: false, locked: false, visible: true, clips: [
    { id: 's1', name: 'Hello', start: 5, duration: 25 },
    { id: 's2', name: 'Next scene...', start: 100, duration: 40 },
  ]},
  { id: 'bgm', name: 'BGM', icon: 'B', type: 'bgm', muted: false, locked: false, visible: true, clips: [
    { id: 'b1', name: 'bgm-track.mp3', start: 0, duration: 250 },
  ]},
  { id: 'fx', name: 'SFX', icon: 'F', type: 'effect', muted: false, locked: false, visible: true, clips: [
    { id: 'f1', name: 'Effect 1', start: 30, duration: 5 },
    { id: 'f2', name: 'Effect 2', start: 125, duration: 8 },
  ]},
  { id: 'ov', name: 'Overlay', icon: 'O', type: 'overlay', muted: false, locked: false, visible: true, clips: [
    { id: 'o1', name: 'Logo', start: 0, duration: 60 },
  ]},
];

export const Timeline: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(84.5);
  const [speed, setSpeed] = useState('1.0x');
  const [tracks] = useState<TrackData[]>(initialTracks);
  const [selectedClip, setSelectedClip] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const totalDuration = 330;
  const pps = (zoom / 100) * 3;
  const totalWidthPx = totalDuration * pps;
  const trackCount = tracks.length;

  const toggleMute = (id: string) => {};
  const toggleLock = (id: string) => {};
  const toggleVisible = (id: string) => {};

  const renderClip = (track: TrackData, clip: ClipData) => {
    const startPx = clip.start * pps;
    const widthPx = clip.duration * pps;
    const sel = selectedClip === clip.id;
    const click = () => setSelectedClip(clip.id);

    switch (track.type) {
      case 'main':
        return <VideoClip key={clip.id} name={clip.name} startPx={startPx} widthPx={widthPx} duration={clip.duration} selected={sel} onClick={click} />;
      case 'subtitle':
        return <SubtitleClip key={clip.id} name={clip.name} startPx={startPx} widthPx={widthPx} selected={sel} onClick={click} />;
      default:
        return <AudioClip key={clip.id} name={clip.name} startPx={startPx} widthPx={widthPx} clipType={track.type as any} selected={sel} onClick={click} />;
    }
  };

  return (
    <div className={styles.root}>
      <TransportBar currentTime={currentTime} totalDuration={totalDuration} isPlaying={isPlaying} speed={speed}
        onTogglePlay={() => setIsPlaying(!isPlaying)} onSpeedChange={setSpeed} />
      <TimelineToolbar />
      <div className={styles.body}>
        <div className={styles.headers}>
          <div className={styles.rulerSpacer} />
          {tracks.map((t) => (
            <div key={t.id} className={`${styles.header} ${t.type === 'main' ? styles.headerMain : ''}`}>
              <span className={styles.headerIcon}>{t.icon}</span>
              <span className={styles.headerName}>{t.name}</span>
              <div className={styles.headerToggles}>
                <button className={styles.toggleBtn} onClick={() => toggleMute(t.id)}>{t.muted ? 'X' : 'V'}</button>
                <button className={styles.toggleBtn} onClick={() => toggleLock(t.id)}>{t.locked ? 'L' : 'U'}</button>
                <button className={styles.toggleBtn} onClick={() => toggleVisible(t.id)}>{t.visible ? 'O' : '-'}</button>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.lanes} ref={scrollRef} onScroll={(e) => setScrollLeft(e.currentTarget.scrollLeft)}>
          <div style={{ width: `${totalWidthPx}px` }}>
            <TimelineRuler totalDuration={totalDuration} pixelsPerSecond={pps} onClick={setCurrentTime} />
            <div className={styles.tracksWrap}>
              {tracks.map((t) => (
                <TrackLane key={t.id} trackType={t.type} widthPx={totalWidthPx}>
                  {t.clips.map((c) => renderClip(t, c))}
                </TrackLane>
              ))}
              <Playhead positionPx={currentTime * pps} heightPx={trackCount * 64} />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.scrollIndicator}>
          <div className={styles.scrollThumb}
            style={{ width: `${(100 / zoom) * 100}%`, marginLeft: `${(scrollLeft / totalWidthPx) * 100}%` }} />
        </div>
        <ZoomSlider zoom={zoom} onChange={setZoom} />
      </div>
    </div>
  );
};
