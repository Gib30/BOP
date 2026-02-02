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
    default: return 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
  }
}

export default function TokenCard({ token, copiedAddress, onCopyAddress, viewMode = 'grid' }) {
  const logoUrl = token.logoUrl || (token.ticker === 'BOP' ? LOGO_PATH : PLACEHOLDER_LOGO);

  if (viewMode === 'list') {
    return (
      <Link
        to={`/project/${token.id}`}
        className="group flex items-center gap-6 p-6 bg-gradient-to-br from-neutral-900/80 to-neutral-950/80 backdrop-blur-sm border border-neutral-800 hover:border-amber-900/50 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-amber-900/10 min-w-0 overflow-hidden"
      >
        <img src={logoUrl} alt={token.name} className="w-14 h-14 rounded-full object-cover border border-neutral-700 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-display text-xl font-bold text-white group-hover:text-amber-400 transition-colors truncate">
              {token.name}
            </h3>
            <span className="text-amber-400 font-mono text-sm font-semibold">${token.ticker}</span>
            <div className="flex gap-1.5">
              {token.badges.slice(0, 2).map((badge, i) => (
                <span key={i} className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getBadgeClass(badge)}`}>
                  {badge}
                </span>
              ))}
            </div>
          </div>
          <p className="text-neutral-400 text-sm truncate">{token.tagline}</p>
        </div>
        <div className="hidden sm:flex items-center gap-8 flex-shrink-0">
          <div className="text-center">
            <div className="text-neutral-500 text-xs">Holders</div>
            <div className="text-white font-bold">{token.holders}</div>
          </div>
          <div className="text-center">
            <div className="text-neutral-500 text-xs">Trust Lines</div>
            <div className="text-white font-bold">{token.trustLines}</div>
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
      className="group relative bg-gradient-to-br from-neutral-900/80 to-neutral-950/80 backdrop-blur-sm border border-neutral-800 hover:border-amber-900/50 rounded-3xl p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-900/20 block min-w-0 overflow-hidden"
    >
      {token.badges.includes('Featured') && (
        <div className="absolute -top-3 -right-3 bg-gradient-to-br from-amber-500 to-amber-700 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
          <Award className="w-3 h-3" />
          FEATURED
        </div>
      )}

      <div className="mb-6 flex items-start gap-4">
        <img src={logoUrl} alt={token.name} className="w-16 h-16 rounded-full object-cover border border-neutral-700 flex-shrink-0" />
        <div className="min-w-0">
          <h3 className="font-display text-3xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors truncate">
            {token.name}
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-amber-400 font-mono text-lg font-semibold">${token.ticker}</span>
            <div className="flex gap-1.5">
              {token.badges.slice(0, 2).map((badge, i) => (
                <span key={i} className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getBadgeClass(badge)}`}>
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="text-neutral-400 text-base mb-6 leading-relaxed line-clamp-2">
        {token.tagline}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-black/40 rounded-xl p-4 border border-neutral-800">
          <div className="text-neutral-500 text-xs mb-1 uppercase tracking-wide">Holders</div>
          <div className="text-white font-bold text-xl">{token.holders}</div>
        </div>
        <div className="bg-black/40 rounded-xl p-4 border border-neutral-800">
          <div className="text-neutral-500 text-xs mb-1 uppercase tracking-wide">Trust Lines</div>
          <div className="text-white font-bold text-xl">{token.trustLines}</div>
        </div>
      </div>

      <div className="bg-black/30 rounded-xl p-4 mb-6 border border-neutral-800/50">
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

      <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
        <div className="flex items-center gap-4 text-sm text-neutral-500">
          <span className="flex items-center gap-1.5">
            <Eye className="w-4 h-4" />
            {token.views.toLocaleString()}
          </span>
          <span className="flex items-center gap-1.5">
            <MessageCircle className="w-4 h-4" />
            {token.comments}
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
