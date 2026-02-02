import { useParams, Link } from 'react-router-dom';
import { Copy, Check, ExternalLink, Globe, Twitter, MessageCircle } from 'lucide-react';
import { getTrustTokenUrl, getDexUrl } from '../lib/xrpl';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import MediaGallery from '../components/MediaGallery';
import CommentSection from '../components/CommentSection';
import { useProjects } from '../hooks/useProjects';
import { BANNER_PATH, LOGO_PATH } from '../lib/constants';

const XRPSCAN_ISSUER = 'https://xrpscan.com/account/';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [copiedAddress, setCopiedAddress] = useState(null);
  const { projects, loading } = useProjects();

  const token = projects.find((t) => t.id === parseInt(id, 10));

  const copyAddress = (address, key) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(key);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-amber-400 font-display text-2xl">Loading...</div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">Project not found</h2>
          <Link to="/" className="text-amber-400 hover:text-amber-300">
            Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  const bannerUrl = token.bannerUrl || (token.ticker === 'BOP' ? BANNER_PATH : 'https://placehold.co/1200x400/1a1a1a/amber?text=' + encodeURIComponent(token.name));
  const logoUrl = token.logoUrl || (token.ticker === 'BOP' ? LOGO_PATH : 'https://placehold.co/128x128/1a1a1a/amber?text=' + token.ticker);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden rounded-3xl border border-neutral-800 mb-10">
        <img src={bannerUrl} alt={token.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 flex items-end gap-4">
          <img src={logoUrl} alt={token.name} className="w-20 h-20 rounded-full object-cover border-2 border-amber-600/50" />
          <div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white">{token.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-amber-400 font-mono text-xl font-semibold">${token.ticker}</span>
              {token.badges.map((badge, i) => (
                <span
                  key={i}
                  className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    badge === 'Verified' ? 'bg-blue-500/20 text-blue-300' :
                    badge === 'Featured' ? 'bg-amber-500/20 text-amber-300' :
                    badge === 'OG' ? 'bg-purple-500/20 text-purple-300' :
                    'bg-green-500/20 text-green-300'
                  }`}
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="text-xl text-neutral-300 mb-8">{token.tagline}</p>

      {/* CTAs */}
      <div className="flex flex-wrap gap-4 mb-10">
        <a
          href={getTrustTokenUrl(token.ticker, token.issuer)}
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-full font-semibold shadow-lg shadow-amber-900/50 transition-all hover:scale-105"
        >
          Trust Token
        </a>
        <a
          href={getDexUrl(token.ticker, token.issuer)}
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 text-white rounded-full font-semibold transition-all"
        >
          Buy on DEX
        </a>
        {token.website && (
          <a
            href={token.website}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 text-white rounded-full font-semibold transition-all flex items-center gap-2"
          >
            <Globe className="w-5 h-5" />
            Visit Website
          </a>
        )}
        {token.whitepaper && (
          <a
            href={token.whitepaper}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 text-white rounded-full font-semibold transition-all flex items-center gap-2"
          >
            <ExternalLink className="w-5 h-5" />
            Whitepaper
          </a>
        )}
      </div>

      {/* Media Gallery */}
      {(token.mediaUrls?.length > 0 || token.videoUrl) && (
        <MediaGallery mediaUrls={token.mediaUrls} videoUrl={token.videoUrl} />
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Supply', value: token.supply },
          { label: 'Holders', value: token.holders },
          { label: 'Trust Lines', value: token.trustLines },
          { label: 'Views', value: token.views.toLocaleString() },
        ].map((stat, i) => (
          <div key={i} className="bg-black/40 border border-neutral-800 rounded-2xl p-5 text-center">
            <div className="text-neutral-500 text-xs uppercase tracking-wider mb-2">{stat.label}</div>
            <div className="font-display text-2xl font-bold text-amber-400">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* About */}
      <div className="mb-10">
        <h2 className="font-display text-3xl font-bold text-white mb-4">About This Project</h2>
        <div className="prose prose-invert prose-amber max-w-none">
          <ReactMarkdown>{token.description}</ReactMarkdown>
        </div>
      </div>

      {/* Token Details */}
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 mb-10">
        <h2 className="font-display text-2xl font-bold text-white mb-6">Token Details</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-neutral-800">
            <span className="text-neutral-400">Currency Code</span>
            <span className="text-amber-400 font-mono font-semibold">{token.ticker}</span>
          </div>
          <div>
            <div className="text-neutral-400 mb-3">Issuer Address</div>
            <div className="flex items-center justify-between bg-black/40 rounded-xl p-4 border border-neutral-800">
              <a
                href={`${XRPSCAN_ISSUER}${token.issuer}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 font-mono text-sm hover:text-amber-300 truncate mr-4"
              >
                {token.issuer}
              </a>
              <button
                onClick={() => copyAddress(token.issuer, 'issuer')}
                className="p-2 hover:bg-neutral-700/50 rounded-lg transition-colors flex-shrink-0"
              >
                {copiedAddress === 'issuer' ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-neutral-400" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Roadmap */}
      {token.roadmap?.length > 0 && (
        <div className="mb-10">
          <h2 className="font-display text-2xl font-bold text-white mb-4">Roadmap</h2>
          <div className="space-y-3">
            {token.roadmap.map((step, i) => (
              <div
                key={i}
                className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6"
              >
                <h3 className="font-display text-xl font-bold text-amber-400 mb-2">{step.title}</h3>
                <p className="text-neutral-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team */}
      {token.team?.length > 0 && (
        <div className="mb-10">
          <h2 className="font-display text-2xl font-bold text-white mb-4">Team</h2>
          <div className="flex flex-wrap gap-6">
            {token.team.map((member, i) => (
              <div
                key={i}
                className="flex items-center gap-4 bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 min-w-[200px]"
              >
                <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center text-amber-400 font-display text-2xl font-bold">
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    member.name.charAt(0)
                  )}
                </div>
                <div>
                  <div className="font-bold text-white">{member.name}</div>
                  <div className="text-neutral-400 text-sm">{member.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Social Links */}
      {(token.website || token.twitter || token.discord || token.telegram || token.github) && (
        <div className="mb-10">
          <h2 className="font-display text-2xl font-bold text-white mb-4">Links</h2>
          <div className="flex flex-wrap gap-4">
            {token.website && (
              <a href={token.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-amber-400 hover:text-amber-300">
                <Globe className="w-5 h-5" /> Website
              </a>
            )}
            {token.twitter && (
              <a href={token.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-amber-400 hover:text-amber-300">
                <Twitter className="w-5 h-5" /> Twitter
              </a>
            )}
            {token.discord && (
              <a href={token.discord} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-amber-400 hover:text-amber-300">
                Discord
              </a>
            )}
            {token.telegram && (
              <a href={token.telegram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-amber-400 hover:text-amber-300">
                Telegram
              </a>
            )}
            {token.github && (
              <a href={token.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-amber-400 hover:text-amber-300">
                GitHub
              </a>
            )}
          </div>
        </div>
      )}

      {/* Comments */}
      <CommentSection projectId={token.id} commentCount={token.comments} />
    </div>
  );
}
