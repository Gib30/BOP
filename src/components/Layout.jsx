import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { LOGO_PATH } from '../lib/constants';
import ConnectWalletButton from './ConnectWalletButton';
import NotificationBell from './NotificationBell';

export default function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden">
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md border-b border-neutral-800">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4 min-w-0">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink">
            <img src={LOGO_PATH} alt="Board of Peace" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border border-amber-600/50 flex-shrink-0" />
            <span className="font-display text-base sm:text-xl font-bold text-white truncate">Board of Peace</span>
          </Link>
          <div className="hidden md:flex items-center gap-4 lg:gap-8 flex-shrink-0">
            <Link to="/submit" className="text-neutral-300 hover:text-amber-400 transition-colors">Submit Project</Link>
            <Link to="/dashboard" className="text-neutral-300 hover:text-amber-400 transition-colors">Dashboard</Link>
            <Link to="/admin" className="text-neutral-300 hover:text-amber-400 transition-colors">Admin</Link>
            <NotificationBell />
            <ConnectWalletButton />
          </div>
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
        {mobileMenuOpen && (
          <div className="md:hidden px-6 py-4 border-t border-neutral-800 flex flex-col gap-4">
            <Link to="/submit" className="text-neutral-300 hover:text-amber-400" onClick={() => setMobileMenuOpen(false)}>Submit Project</Link>
            <Link to="/dashboard" className="text-neutral-300 hover:text-amber-400" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
            <Link to="/admin" className="text-neutral-300 hover:text-amber-400" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
            <div className="flex items-center gap-2">
              <NotificationBell />
              <ConnectWalletButton className="w-fit" />
            </div>
          </div>
        )}
      </header>
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}
