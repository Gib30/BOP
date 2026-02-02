import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, sortBy, onSortChange, category, onCategoryChange, verifiedOnly, onVerifiedOnlyChange }) {
  return (
    <div className="sticky top-16 z-30 py-4 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800 mb-8">
      <div className="w-full max-w-4xl space-y-4">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search by name, ticker, or issuer address..."
            className="w-full pl-14 pr-6 py-5 bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 hover:border-amber-900/50 focus:border-amber-700 rounded-2xl text-white placeholder-neutral-500 focus:outline-none transition-colors text-lg"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-amber-700"
          >
            <option value="trending">Trending</option>
            <option value="views">Most Views</option>
            <option value="comments">Most Comments</option>
            <option value="newest">Newest</option>
            <option value="holders">Most Holders</option>
          </select>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-amber-700"
          >
            <option value="">All Categories</option>
            <option value="DeFi">DeFi</option>
            <option value="NFT">NFT</option>
            <option value="Gaming">Gaming</option>
            <option value="Charity">Charity</option>
            <option value="Utility">Utility</option>
            <option value="Social">Social</option>
            <option value="Meme">Meme</option>
          </select>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => onVerifiedOnlyChange(e.target.checked)}
              className="rounded border-neutral-600 bg-neutral-900 text-amber-600 focus:ring-amber-600"
            />
            <span className="text-neutral-400 text-sm">Verified only</span>
          </label>
        </div>
      </div>
    </div>
  );
}
