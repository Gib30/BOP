import { Link } from 'react-router-dom';
import { Sparkles, MessageCircle } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';

export default function Sidebar() {
  const { projects } = useProjects();

  const categories = [...new Set(projects.map((p) => p.category).filter(Boolean))];
  const featured = projects.filter((p) => p.badges?.includes('Featured')).slice(0, 5);
  const trending = [...projects].sort((a, b) => b.views + b.comments - (a.views + a.comments)).slice(0, 5);

  return (
    <aside className="hidden lg:block w-72 flex-shrink-0">
      <div className="sticky top-24 space-y-8">
        <div>
          <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Categories
          </h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link
                key={c}
                to={`/?category=${c}`}
                className="px-3 py-1.5 bg-neutral-800 hover:bg-amber-600/20 text-neutral-300 hover:text-amber-400 rounded-lg text-sm transition-colors"
              >
                {c}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-display text-lg font-bold text-white mb-4">Featured</h3>
          <div className="space-y-3">
            {featured.map((p) => (
              <Link
                key={p.id}
                to={`/project/${p.id}`}
                className="block p-3 bg-neutral-900/50 border border-neutral-800 rounded-xl hover:border-amber-900/50 transition-colors"
              >
                <div className="font-semibold text-white truncate">{p.name}</div>
                <div className="text-amber-400 font-mono text-sm">${p.ticker}</div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-amber-400" />
            Trending
          </h3>
          <div className="space-y-3">
            {trending.map((p) => (
              <Link
                key={p.id}
                to={`/project/${p.id}`}
                className="block p-3 bg-neutral-900/50 border border-neutral-800 rounded-xl hover:border-amber-900/50 transition-colors"
              >
                <div className="font-semibold text-white truncate">{p.name}</div>
                <div className="text-neutral-500 text-sm">{p.views?.toLocaleString()} views</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
