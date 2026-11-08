import { useEffect, useRef } from 'react';

interface VideoThumbnailProps {
  src: string;
  className?: string;
  poster?: string;
}

export function VideoThumbnail({ src, className, poster }: VideoThumbnailProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = true;
    el.defaultMuted = true;

    const play = () => {
      el.play().catch(() => {
        // Autoplay policy or low power mode fallback
      });
    };
    play();

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        play();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      className={className}
    />
  );
}

