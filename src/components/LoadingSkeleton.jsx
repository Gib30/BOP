export default function LoadingSkeleton({ count = 6, viewMode = 'grid' }) {
  const items = Array.from({ length: count }, (_, i) => i);

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {items.map((i) => (
          <div key={i} className="animate-pulse flex items-center gap-6 p-6 bg-neutral-900/50 border border-neutral-800 rounded-2xl">
            <div className="w-14 h-14 rounded-full bg-neutral-800" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-48 bg-neutral-800 rounded" />
              <div className="h-4 w-64 bg-neutral-800/80 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((i) => (
        <div key={i} className="animate-pulse bg-neutral-900/50 border border-neutral-800 rounded-3xl p-8">
          <div className="flex gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-neutral-800" />
            <div className="flex-1 space-y-2">
              <div className="h-7 w-32 bg-neutral-800 rounded" />
              <div className="h-5 w-20 bg-neutral-800/80 rounded" />
            </div>
          </div>
          <div className="h-4 w-full bg-neutral-800/80 rounded mb-6" />
          <div className="h-4 w-3/4 bg-neutral-800/60 rounded mb-6" />
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="h-16 bg-neutral-800 rounded-xl" />
            <div className="h-16 bg-neutral-800 rounded-xl" />
          </div>
          <div className="h-12 bg-neutral-800 rounded-xl" />
        </div>
      ))}
    </div>
  );
}
