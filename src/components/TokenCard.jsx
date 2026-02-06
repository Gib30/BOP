import { Link } from 'react-router-dom';
import { Eye, MessageCircle, ChevronRight, Copy, Check, Award } from 'lucide-react';
import { useState } from 'react';
import { LOGO_PATH, PLACEHOLDER_LOGO } from '../lib/constants';

function shortenAddress(addr) {
  return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
}

function getBadgeClass(badge) {
  switch (badge) {
    case 'Verified': return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
    case 'OG': return 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
    case 'New': return 'bg-green-500/20 text-green-300 border border-green-500/30';
    case 'Featured': return 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
    case 'Meme': return 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30';
    case 'DeFi': return 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30';
    case 'NFT': return 'bg-violet-500/20 text-violet-300 border border-violet-500/30';
    case 'Gaming': return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
    case 'Charity': return 'bg-orange-500/20 text-orange-300 border border-orange-500/30';
    case 'Utility': return 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30';
    case 'Social': return 'bg-sky-500/20 text-sky-300 border border-sky-500/30';
    default: return 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
  }
}

export default function TokenCard({ token, copiedAddress, onCopyAddress, viewMode = 'grid' }) {
  const logoUrl = token.logoUrl || (token.ticker === 'BOP' ? LOGO_PATH : PLACEHOLDER_LOGO);

  if (viewMode === 'list') {
    return (
      <Link
        to={`/project/${token.id}`}
        className="group flex items-center gap-3 sm:gap-6 p-4 sm:p-6 bg-gradient-to-br from-neutral-900/80 to-neutral-950/80 backdrop-blur-sm border border-neutral-800 hover:border-amber-900/50 rounded-xl sm:rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-amber-900/10 min-w-0 overflow-hidden"
      >
        <img src={logoUrl} alt={token.name} className="w-10 h-10 sm:w-14 sm:h-14 rounded-full object-cover border border-neutral-700 flex-shrink-0" />
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-0.5 sm:mb-1">
            <h3 className="font-display text-base sm:text-xl font-bold text-white group-hover:text-amber-400 transition-colors truncate">
              {token.name}
            </h3>
            <span className="text-amber-400 font-mono text-xs sm:text-sm font-semibold flex-shrink-0">${token.ticker}</span>
            <div className="flex flex-wrap gap-1.5">
              {(token.badges || []).slice(0, 2).map((badge, i) => (
                <span key={i} className={`px-2 py-0.5 text-[10px] sm:text-xs font-semibold rounded-full whitespace-nowrap ${getBadgeClass(badge)}`}>
                  {badge}
                </span>
              ))}
            </div>
          </div>
          <p className="text-neutral-400 text-xs sm:text-sm truncate">{token.tagline}</p>
        </div>
        <div className="hidden md:flex items-center gap-4 lg:gap-8 flex-shrink-0">
          <div className="text-center">
            <div className="text-neutral-500 text-xs">Holders</div>
            <div className="text-white font-bold">{token.holders ?? '0'}</div>
          </div>
          <div className="text-center">
            <div className="text-neutral-500 text-xs">Trust Lines</div>
            <div className="text-white font-bold">{token.trustLines ?? '0'}</div>
          </div>
          <div className="flex items-center gap-2">
            <code className="text-amber-400/80 text-sm font-mono">{shortenAddress(token.issuer)}</code>
            <button
              onClick={(e) => { e.preventDefault(); onCopyAddress(token.issuer, token.id); }}
              className="p-2 hover:bg-neutral-700/50 rounded-lg transition-colors"
            >
              {copiedAddress === token.id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-neutral-400" />}
            </button>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-amber-400 flex-shrink-0" />
      </Link>
    );
  }

  return (
    <Link
      to={`/project/${token.id}`}
      className="group relative bg-gradient-to-br from-neutral-900/80 to-neutral-950/80 backdrop-blur-sm border border-neutral-800 hover:border-amber-900/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 transition-all duration-300 hover:shadow-xl hover:shadow-amber-900/20 block min-w-0 overflow-hidden"
    >
      {(token.badges || []).includes('Featured') && (
        <div className="absolute top-3 right-3 bg-gradient-to-br from-amber-500 to-amber-700 text-white px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold shadow-lg flex items-center gap-1 flex-shrink-0">
          <Award className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          FEATURED
        </div>
      )}

      <div className="mb-4 sm:mb-6 flex items-start gap-3 sm:gap-4">
        <img src={logoUrl} alt={token.name} className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border border-neutral-700 flex-shrink-0" />
        <div className="min-w-0 flex-1 overflow-hidden">
          <h3 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2 group-hover:text-amber-400 transition-colors truncate">
            {token.name}
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-amber-400 font-mono text-sm sm:text-lg font-semibold flex-shrink-0">${token.ticker}</span>
            <div className="flex flex-wrap gap-1.5">
              {(token.badges || []).slice(0, 3).map((badge, i) => (
                <span key={i} className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-full whitespace-nowrap ${getBadgeClass(badge)}`}>
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="text-neutral-400 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed line-clamp-2">
        {token.tagline}
      </p>

      <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-black/40 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-neutral-800">
          <div className="text-neutral-500 text-[10px] sm:text-xs mb-0.5 sm:mb-1 uppercase tracking-wide">Holders</div>
          <div className="text-white font-bold text-base sm:text-xl truncate">{token.holders ?? '0'}</div>
        </div>
        <div className="bg-black/40 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-neutral-800">
          <div className="text-neutral-500 text-[10px] sm:text-xs mb-0.5 sm:mb-1 uppercase tracking-wide">Trust Lines</div>
          <div className="text-white font-bold text-base sm:text-xl truncate">{token.trustLines ?? '0'}</div>
        </div>
      </div>

      <div className="bg-black/30 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-neutral-800/50">
        <div className="text-neutral-500 text-xs mb-2 uppercase tracking-wide">Issuer Address</div>
        <div className="flex items-center justify-between gap-2">
          <code className="text-amber-400/80 text-sm font-mono truncate">{shortenAddress(token.issuer)}</code>
          <button
            onClick={(e) => { e.preventDefault(); onCopyAddress(token.issuer, token.id); }}
            className="p-2 hover:bg-neutral-700/50 rounded-lg transition-colors flex-shrink-0"
          >
            {copiedAddress === token.id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-neutral-400" />}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 sm:pt-4 border-t border-neutral-800">
        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-neutral-500">
          <span className="flex items-center gap-1.5">
            <Eye className="w-4 h-4" />
            {(token.views ?? 0).toLocaleString()}
          </span>
          <span className="flex items-center gap-1.5">
            <MessageCircle className="w-4 h-4" />
            {token.comments ?? 0}
          </span>
        </div>
        <span className="text-amber-400 hover:text-amber-300 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
          View Details
          <ChevronRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}
