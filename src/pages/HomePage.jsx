import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, LayoutGrid, List, Award } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import TokenCard from '../components/TokenCard';
import SearchBar from '../components/SearchBar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useProjects } from '../hooks/useProjects';
import { parseCount } from '../lib/utils';

const ITEMS_PER_PAGE = 9;

export default function HomePage() {
  const { projects: rawProjects, loading } = useProjects();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('trending');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [copiedAddress, setCopiedAddress] = useState(null);
  const [page, setPage] = useState(1);

  const copyAddress = (address, id) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(id);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const featuredProjects = useMemo(
    () => rawProjects.filter((p) => (p.badges || []).includes('Featured')),
    [rawProjects]
  );

  const filteredAndSorted = useMemo(() => {
    let tokens = [...rawProjects];

    if (search) {
      const q = search.toLowerCase();
      tokens = tokens.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.ticker.toLowerCase().includes(q) ||
          t.issuer.toLowerCase().includes(q) ||
          t.tagline.toLowerCase().includes(q) ||
          (t.category && t.category.toLowerCase().includes(q))
      );
    }

    if (category) {
      tokens = tokens.filter((t) => t.category === category);
    }

    if (verifiedOnly) {
      tokens = tokens.filter((t) => t.badges.includes('Verified'));
    }

    switch (sortBy) {
      case 'views':
        tokens.sort((a, b) => b.views - a.views);
        break;
      case 'comments':
        tokens.sort((a, b) => b.comments - a.comments);
        break;
      case 'newest':
        tokens.sort((a, b) => {
          const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return db - da;
        });
        break;
      case 'holders':
        tokens.sort((a, b) => parseCount(b.holders) - parseCount(a.holders));
        break;
      case 'rising': {
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        tokens = tokens.filter((t) => t.createdAt && new Date(t.createdAt).getTime() > thirtyDaysAgo);
        tokens.sort((a, b) => b.views + b.comments - (a.views + a.comments));
        break;
      }
      case 'verified_first':
        tokens.sort((a, b) => {
          const aV = a.badges?.includes('Verified') ? 1 : 0;
          const bV = b.badges?.includes('Verified') ? 1 : 0;
          if (bV !== aV) return bV - aV;
          return b.views + b.comments - (a.views + a.comments);
        });
        break;
      default:
        tokens.sort((a, b) => b.views + b.comments - (a.views + a.comments));
    }

    return tokens;
  }, [rawProjects, search, sortBy, category, verifiedOnly]);

  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredAndSorted.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSorted, page]);

  const totalPages = Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setCategory(cat);
  }, [searchParams]);

  return (
    <>
      <HeroSection />

      {featuredProjects.length > 0 && (
        <section className="py-8 sm:py-12 px-4 sm:px-6 bg-neutral-950 border-b border-neutral-800 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <Award className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 flex-shrink-0" />
              <h2 className="font-display text-xl sm:text-2xl font-bold text-white">Featured Projects</h2>
            </div>
            <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0">
              {featuredProjects.map((token) => (
                <div key={token.id} className="flex-shrink-0 w-[280px] sm:w-72 lg:w-80 snap-center">
                  <TokenCard
                    token={token}
                    copiedAddress={copiedAddress}
                    onCopyAddress={copyAddress}
                    viewMode="grid"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="directory" className="relative py-12 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-black to-neutral-950 scroll-mt-20 overflow-x-hidden">
        <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-6 xl:gap-8 overflow-hidden">
          <div className="flex-1 min-w-0 overflow-hidden w-full">
        {loading && (
          <div className="py-12">
            <LoadingSkeleton count={6} viewMode={viewMode} />
          </div>
        )}
        {!loading && <div>
          <div className="text-center mb-8 sm:mb-12 space-y-3 sm:space-y-4">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 flex-shrink-0" />
              <span className="text-amber-400 uppercase tracking-widest text-xs sm:text-sm font-semibold">Directory</span>
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 flex-shrink-0" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white px-2">
              Verified <span className="text-amber-400">XRPL</span> Tokens
            </h2>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
              Curated collection of community-driven projects committed to peace and prosperity
            </p>
          </div>

          <SearchBar
            value={search}
            onChange={setSearch}
            sortBy={sortBy}
            onSortChange={setSortBy}
            category={category}
            onCategoryChange={setCategory}
            verifiedOnly={verifiedOnly}
            onVerifiedOnlyChange={setVerifiedOnly}
          />

          <div className="flex items-center justify-between mb-8">
            <span className="text-neutral-400">
              {filteredAndSorted.length} project{filteredAndSorted.length !== 1 ? 's' : ''}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-amber-600/20 text-amber-400' : 'text-neutral-500 hover:text-white'}`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-amber-600/20 text-amber-400' : 'text-neutral-500 hover:text-white'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 min-w-0">
              {paginated.map((token) => (
                <TokenCard
                  key={token.id}
                  token={token}
                  copiedAddress={copiedAddress}
                  onCopyAddress={copyAddress}
                  viewMode="grid"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4 min-w-0">
              {paginated.map((token) => (
                <TokenCard
                  key={token.id}
                  token={token}
                  copiedAddress={copiedAddress}
                  onCopyAddress={copyAddress}
                  viewMode="list"
                />
              ))}
            </div>
          )}

          {filteredAndSorted.length === 0 && (
            <div className="text-center py-16 text-neutral-400">
              No projects match your filters. Try adjusting your search.
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-neutral-800 disabled:opacity-50 rounded-lg text-white hover:bg-neutral-700 transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-neutral-400">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-neutral-800 disabled:opacity-50 rounded-lg text-white hover:bg-neutral-700 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>}
        </div>
        <Sidebar />
        </div>
      </section>

      <Footer />
    </>
  );
}
