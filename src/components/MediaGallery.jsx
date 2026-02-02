import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function MediaGallery({ mediaUrls = [], videoUrl }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const items = videoUrl ? [{ type: 'video', url: videoUrl }, ...mediaUrls.map((u) => ({ type: 'image', url: u }))] : mediaUrls.map((u) => ({ type: 'image', url: u }));

  if (items.length === 0) {
    return null;
  }

  const current = items[currentIndex];
  const isVideo = current?.type === 'video';

  return (
    <div className="mb-10">
      <h2 className="font-display text-2xl font-bold text-white mb-4">Media Gallery</h2>
      <div className="relative bg-black/40 border border-neutral-800 rounded-2xl overflow-hidden">
        <div className="aspect-video flex items-center justify-center bg-neutral-900">
          {isVideo ? (
            <div className="w-full aspect-video">
              {current.url.includes('youtube.com') || current.url.includes('youtu.be') ? (
                <iframe
                  src={current.url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                  title="Video"
                  className="w-full h-full"
                  allowFullScreen
                />
              ) : (
                <video
                  src={current.url}
                  controls
                  className="w-full h-full max-h-[400px]"
                  muted
                  playsInline
                />
              )}
            </div>
          ) : (
            <img
              src={current?.url}
              alt="Gallery"
              className="w-full h-full object-contain max-h-[400px]"
            />
          )}
        </div>
        {items.length > 1 && (
          <>
            <button
              onClick={() => setCurrentIndex((i) => (i - 1 + items.length) % items.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-black/80 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={() => setCurrentIndex((i) => (i + 1) % items.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-black/80 rounded-full transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${i === currentIndex ? 'bg-amber-500' : 'bg-neutral-600'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
