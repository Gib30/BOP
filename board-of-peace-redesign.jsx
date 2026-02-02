import { useState } from 'react';
import { Menu, X, Search, Shield, Eye, MessageCircle, ChevronRight, Copy, Check, ChevronDown, Sparkles, TrendingUp, Award } from 'lucide-react';

const LOGO_PATH = '/mnt/user-data/uploads/BoP.jpg';
const BANNER_PATH = '/mnt/user-data/uploads/Banner__1_.jpg';

const MOCK_TOKENS = [
  {
    id: 1,
    name: "Board of Peace",
    ticker: "BOP",
    tagline: "United Stewards on XRPL – Join the Harmony",
    description: "Born from the Potheads XRP community in 2017, Board of Peace represents a collective of XRPL enthusiasts united by peace through art, cryptocurrency, and meaningful impact.",
    issuer: "rGF1o7dsC776Hov8qKkPCN1wkVh18sz5bf",
    supply: "1,000,000,000",
    holders: "2,847",
    trustLines: "3,124",
    badges: ["Verified", "Featured", "OG"],
    views: 15420,
    comments: 89
  },
  {
    id: 2,
    name: "Peace Ducks",
    ticker: "DUCK",
    tagline: "What the Duck! Meme meets meaning",
    description: "Community meme token with charitable impact.",
    issuer: "rN7n7otQDd6FczFgLdJqcdNCood2aR74h8",
    supply: "500,000,000",
    holders: "1,523",
    trustLines: "1,890",
    badges: ["New", "Meme"],
    views: 8930,
    comments: 45
  },
  {
    id: 3,
    name: "Harmony Arts",
    ticker: "HART",
    tagline: "NFT collective for global peace",
    description: "Artist collective creating NFTs for charity.",
    issuer: "rBTwLga3i2gz3doX6Gva3MgEV8ZCD8jjQH",
    supply: "100,000,000",
    holders: "892",
    trustLines: "1,234",
    badges: ["Verified"],
    views: 6780,
    comments: 34
  }
];

export default function BoardOfPeace() {
  const [selectedToken, setSelectedToken] = useState(null);
  const [copiedAddress, setCopiedAddress] = useState(null);

  const copyAddress = (address, id) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(id);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const shortenAddress = (addr) => `${addr.slice(0, 8)}...${addr.slice(-6)}`;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap');
        
        .font-display { font-family: 'Cormorant Garamond', serif; }
        .font-sans { font-family: 'Montserrat', sans-serif; }
        
        * { font-family: 'Montserrat', sans-serif; }
        h1, h2, h3, h4, h5, h6 { font-family: 'Cormorant Garamond', serif; }
        
        .text-shadow-gold {
          text-shadow: 0 2px 20px rgba(212, 175, 55, 0.3);
        }
        
        .glow-border {
          box-shadow: 0 0 40px rgba(212, 175, 55, 0.2), inset 0 0 20px rgba(212, 175, 55, 0.05);
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      {/* Hero Section - Full Banner */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={BANNER_PATH}
            alt="Board of Peace"
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
        </div>

        {/* Floating Logo */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 animate-float">
          <img 
            src={LOGO_PATH}
            alt="Board of Peace Logo"
            className="w-32 h-32 object-contain drop-shadow-2xl"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-6xl mx-auto px-6 text-center space-y-8">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="font-display text-7xl md:text-8xl font-bold tracking-tight text-shadow-gold">
              Board <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">of</span> Peace
            </h1>
            <div className="flex items-center justify-center space-x-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-600" />
              <p className="font-display text-2xl md:text-3xl text-amber-200/90 italic tracking-wider">
                United Stewards on XRPL
              </p>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-600" />
            </div>
          </div>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-neutral-300 font-light max-w-3xl mx-auto leading-relaxed">
            Discover verified projects building harmony through art, cryptocurrency, and collective impact on the XRP Ledger
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button className="group px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 rounded-full font-semibold text-lg shadow-2xl shadow-amber-900/50 transition-all duration-300 hover:scale-105">
              <span className="flex items-center gap-2">
                Explore Directory
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 hover:border-amber-400/50 rounded-full font-semibold text-lg transition-all duration-300">
              Connect Wallet
            </button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto pt-12">
            {[
              { label: 'Projects', value: '247' },
              { label: 'Total Holders', value: '12.5K' },
              { label: 'Charity Impact', value: '$47K' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-display font-bold text-amber-400 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-neutral-400 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <div className="flex flex-col items-center gap-2 text-amber-400/60">
            <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
            <ChevronDown className="w-6 h-6" />
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="relative py-20 px-6 bg-gradient-to-b from-black to-neutral-950">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Sparkles className="w-6 h-6 text-amber-400" />
              <span className="text-amber-400 uppercase tracking-widest text-sm font-semibold">Featured Projects</span>
              <Sparkles className="w-6 h-6 text-amber-400" />
            </div>
            <h2 className="font-display text-5xl md:text-6xl font-bold text-white">
              Verified <span className="text-amber-400">XRPL</span> Tokens
            </h2>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
              Curated collection of community-driven projects committed to peace and prosperity
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input
                type="text"
                placeholder="Search by name, ticker, or issuer address..."
                className="w-full pl-14 pr-6 py-5 bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 hover:border-amber-900/50 focus:border-amber-700 rounded-2xl text-white placeholder-neutral-500 focus:outline-none transition-colors text-lg"
              />
            </div>
          </div>

          {/* Token Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_TOKENS.map((token, idx) => (
              <div
                key={token.id}
                onClick={() => setSelectedToken(token)}
                className="group relative bg-gradient-to-br from-neutral-900/80 to-neutral-950/80 backdrop-blur-sm border border-neutral-800 hover:border-amber-900/50 rounded-3xl p-8 cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-900/20"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Badge Corner */}
                {token.badges[0] === 'Featured' && (
                  <div className="absolute -top-3 -right-3 bg-gradient-to-br from-amber-500 to-amber-700 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    FEATURED
                  </div>
                )}

                {/* Token Header */}
                <div className="mb-6">
                  <h3 className="font-display text-3xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                    {token.name}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-amber-400 font-mono text-lg font-semibold">${token.ticker}</span>
                    <div className="flex gap-1.5">
                      {token.badges.slice(0, 2).map((badge, i) => (
                        <span
                          key={i}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                            badge === 'Verified' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                            badge === 'OG' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                            badge === 'New' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                            'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tagline */}
                <p className="text-neutral-400 text-base mb-6 leading-relaxed line-clamp-2">
                  {token.tagline}
                </p>

                {/* Stats Grid */}
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

                {/* Issuer */}
                <div className="bg-black/30 rounded-xl p-4 mb-6 border border-neutral-800/50">
                  <div className="text-neutral-500 text-xs mb-2 uppercase tracking-wide">Issuer Address</div>
                  <div className="flex items-center justify-between gap-2">
                    <code className="text-amber-400/80 text-sm font-mono truncate">{shortenAddress(token.issuer)}</code>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyAddress(token.issuer, token.id);
                      }}
                      className="p-2 hover:bg-neutral-700/50 rounded-lg transition-colors flex-shrink-0"
                    >
                      {copiedAddress === token.id ? 
                        <Check className="w-4 h-4 text-green-400" /> : 
                        <Copy className="w-4 h-4 text-neutral-400" />
                      }
                    </button>
                  </div>
                </div>

                {/* Footer */}
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
                  <button className="text-amber-400 hover:text-amber-300 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    View Details
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      {selectedToken && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setSelectedToken(null)}
        >
          <div
            className="bg-gradient-to-br from-neutral-900 to-black border border-neutral-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header with Banner */}
            <div className="relative h-48 overflow-hidden rounded-t-3xl border-b border-neutral-800">
              <img 
                src={BANNER_PATH}
                alt={selectedToken.name}
                className="w-full h-full object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-900" />
              <button
                onClick={() => setSelectedToken(null)}
                className="absolute top-4 right-4 p-3 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full transition-colors z-10"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="p-10 space-y-8">
              {/* Title Section */}
              <div>
                <h2 className="font-display text-5xl font-bold text-white mb-3">{selectedToken.name}</h2>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-amber-400 font-mono text-2xl font-semibold">${selectedToken.ticker}</span>
                  <div className="flex gap-2">
                    {selectedToken.badges.map((badge, i) => (
                      <span
                        key={i}
                        className={`px-3 py-1.5 text-sm font-semibold rounded-full ${
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
                <p className="text-xl text-neutral-300 leading-relaxed">{selectedToken.tagline}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button className="px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-full font-semibold shadow-lg shadow-amber-900/50 transition-all hover:scale-105">
                  Trust Token
                </button>
                <button className="px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 text-white rounded-full font-semibold transition-all">
                  Buy on DEX
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Supply', value: selectedToken.supply },
                  { label: 'Holders', value: selectedToken.holders },
                  { label: 'Trust Lines', value: selectedToken.trustLines },
                  { label: 'Views', value: selectedToken.views.toLocaleString() }
                ].map((stat, i) => (
                  <div key={i} className="bg-black/40 border border-neutral-800 rounded-2xl p-5 text-center">
                    <div className="text-neutral-500 text-xs uppercase tracking-wider mb-2">{stat.label}</div>
                    <div className="font-display text-3xl font-bold text-amber-400">{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* About */}
              <div className="space-y-4">
                <h3 className="font-display text-3xl font-bold text-white">About This Project</h3>
                <p className="text-neutral-300 text-lg leading-relaxed">{selectedToken.description}</p>
              </div>

              {/* Token Details */}
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8">
                <h3 className="font-display text-2xl font-bold text-white mb-6">Token Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-neutral-800">
                    <span className="text-neutral-400">Currency Code</span>
                    <span className="text-amber-400 font-mono font-semibold">{selectedToken.ticker}</span>
                  </div>
                  <div>
                    <div className="text-neutral-400 mb-3">Issuer Address</div>
                    <div className="flex items-center justify-between bg-black/40 rounded-xl p-4 border border-neutral-800">
                      <code className="text-amber-400 font-mono text-sm">{selectedToken.issuer}</code>
                      <button
                        onClick={() => copyAddress(selectedToken.issuer, `${selectedToken.id}-modal`)}
                        className="p-2 hover:bg-neutral-700/50 rounded-lg transition-colors"
                      >
                        {copiedAddress === `${selectedToken.id}-modal` ? 
                          <Check className="w-5 h-5 text-green-400" /> : 
                          <Copy className="w-5 h-5 text-neutral-400" />
                        }
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments */}
              <div className="border-t border-neutral-800 pt-8">
                <h3 className="font-display text-2xl font-bold text-white mb-4">
                  Community Discussion ({selectedToken.comments})
                </h3>
                <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
                  <textarea
                    placeholder="Connect your wallet to join the conversation..."
                    className="w-full bg-black/40 border border-neutral-800 rounded-xl p-4 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-700 resize-none"
                    rows="4"
                  />
                  <div className="flex justify-end mt-4">
                    <button className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-semibold transition-colors">
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
