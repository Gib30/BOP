import { Link } from 'react-router-dom';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { LOGO_PATH, BANNER_PATH } from '../lib/constants';

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={BANNER_PATH}
          alt="Board of Peace"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
      </div>

      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 animate-float">
        <img
          src={LOGO_PATH}
          alt="Board of Peace Logo"
          className="w-32 h-32 object-contain drop-shadow-2xl"
        />
      </div>

      <div className="relative z-20 max-w-6xl mx-auto px-6 text-center space-y-8">
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

        <p className="text-xl md:text-2xl text-neutral-300 font-light max-w-3xl mx-auto leading-relaxed">
          Discover verified projects building harmony through art, cryptocurrency, and collective impact on the XRP Ledger
        </p>

        <div className="flex items-center justify-center pt-4">
          <Link
            to="/#directory"
            className="group px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 rounded-full font-semibold text-lg shadow-2xl shadow-amber-900/50 transition-all duration-300 hover:scale-105"
          >
            <span className="flex items-center gap-2">
              Explore Directory
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto pt-12">
          {[
            { label: 'Projects', value: '247' },
            { label: 'Total Holders', value: '12.5K' },
            { label: 'Charity Impact', value: '$47K' },
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

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <a href="#directory" className="flex flex-col items-center gap-2 text-amber-400/60">
          <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
          <ChevronDown className="w-6 h-6" />
        </a>
      </div>
    </section>
  );
}
