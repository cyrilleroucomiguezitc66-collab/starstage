import { useEffect, useState } from 'react';
import type { Lyric } from '../types';

interface LyricsDisplayProps {
  lyrics: Lyric[];
  currentTime: number;
}

export default function LyricsDisplay({ lyrics, currentTime }: LyricsDisplayProps) {
  const [currentLine, setCurrentLine] = useState<Lyric | null>(null);
  const [nextLine, setNextLine] = useState<Lyric | null>(null);

  useEffect(() => {
    const sortedLyrics = [...lyrics].sort((a, b) => a.line_order - b.line_order);
    const currentTimeMs = currentTime * 1000;

    const current = sortedLyrics.find(
      lyric => currentTimeMs >= lyric.start_time && currentTimeMs <= lyric.end_time
    );

    const currentIndex = current ? sortedLyrics.indexOf(current) : -1;
    const next = currentIndex >= 0 && currentIndex < sortedLyrics.length - 1
      ? sortedLyrics[currentIndex + 1]
      : null;

    setCurrentLine(current || null);
    setNextLine(next);
  }, [lyrics, currentTime]);

  if (lyrics.length === 0) {
    return null;
  }

  return (
    <div style={{
      position: 'absolute',
      bottom: '80px',
      left: 0,
      right: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
      padding: '0 16px',
      zIndex: 10
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.75) 100%)',
        backdropFilter: 'blur(12px)',
        borderRadius: '20px',
        padding: '24px 40px',
        width: '100%',
        maxWidth: '1100px',
        border: '2px solid rgba(255, 211, 0, 0.3)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 40px rgba(255, 211, 0, 0.15)'
      }}>
        {currentLine && (
          <div style={{
            textAlign: 'center',
            animation: 'slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}>
            <p style={{
              fontSize: 'clamp(28px, 5.5vw, 64px)',
              fontWeight: '900',
              color: '#FFD300',
              textShadow: '0 4px 12px rgba(0, 0, 0, 0.9), 0 0 30px rgba(255, 211, 0, 0.6), 0 0 60px rgba(255, 211, 0, 0.3)',
              lineHeight: '1.3',
              margin: 0,
              letterSpacing: '1px',
              animation: 'glow 2s ease-in-out infinite',
              WebkitTextStroke: '1px rgba(0, 0, 0, 0.3)'
            }}>
              {currentLine.line_text}
            </p>
          </div>
        )}

        {nextLine && (
          <div style={{
            textAlign: 'center',
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <p style={{
              fontSize: 'clamp(16px, 3vw, 28px)',
              color: 'rgba(255, 255, 255, 0.5)',
              margin: 0,
              fontWeight: '600'
            }}>
              {nextLine.line_text}
            </p>
          </div>
        )}

        {!currentLine && lyrics.length > 0 && (
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontSize: 'clamp(18px, 4vw, 32px)',
              color: 'rgba(255, 255, 255, 0.6)',
              margin: 0,
              fontWeight: '700'
            }}>
              🎤 La chanson va bientôt commencer...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}