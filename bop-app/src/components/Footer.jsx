import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { LOGO_PATH } from '../lib/constants';

export default function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div className="flex items-center gap-3">
            <img src={LOGO_PATH} alt="Board of Peace" className="w-12 h-12 rounded-full object-cover border border-amber-600/50" />
            <span className="font-display text-2xl font-bold text-white">Board of Peace</span>
          </div>
          <div className="flex gap-8">
            <Link to="/" className="text-neutral-400 hover:text-amber-400 transition-colors">Directory</Link>
            <Link to="/submit" className="text-neutral-400 hover:text-amber-400 transition-colors">Submit Project</Link>
            <Link to="/dashboard" className="text-neutral-400 hover:text-amber-400 transition-colors">Dashboard</Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div>
            <h4 className="font-display text-lg font-bold text-white mb-4">XRPL Resources</h4>
            <div className="space-y-2">
              <a href="https://xrpl.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-neutral-400 hover:text-amber-400 transition-colors">
                XRPL.org <ExternalLink className="w-4 h-4" />
              </a>
              <a href="https://xrpscan.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-neutral-400 hover:text-amber-400 transition-colors">
                XRPSCAN <ExternalLink className="w-4 h-4" />
              </a>
              <a href="https://xumm.app" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-neutral-400 hover:text-amber-400 transition-colors">
                XUMM Wallet <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-display text-lg font-bold text-white mb-4">Legal</h4>
            <p className="text-neutral-500 text-sm">
              This site is for informational purposes only. Not financial advice. Always do your own research before trusting or trading any token.
            </p>
          </div>
          <div>
            <h4 className="font-display text-lg font-bold text-white mb-4">Contact</h4>
            <p className="text-neutral-500 text-sm">
              Built by the Potheads XRP community. For inquiries, reach out via X/Twitter @potheadsXRP.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-800 text-center text-neutral-500 text-sm">
          <p>Board of Peace - United Stewards on XRPL. DISCOVER | BUILD | PROSPER</p>
        </div>
      </div>
    </footer>
  );
}
