import { useWallet } from '../context/WalletContext';
import { Wallet, LogOut } from 'lucide-react';

function shortenAddress(addr) {
  if (!addr || addr.length < 12) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function ConnectWalletButton({ variant = 'default', className = '' }) {
  const { account, loading, error, connect, disconnect, isConnected, hasXumm, sdkReady } = useWallet();

  const baseClass = 'inline-flex items-center gap-2 font-semibold transition-colors rounded-full';
  const variants = {
    default: 'px-4 py-2 bg-amber-600 hover:bg-amber-500',
    outline: 'px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 hover:border-amber-400/50',
  };
  const classes = `${baseClass} ${variants[variant] || variants.default} ${className}`;

  if (!hasXumm) {
    return (
      <a
        href="https://xumm.app"
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        <Wallet className="w-4 h-4" />
        Get XUMM
      </a>
    );
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-neutral-400 font-mono">{shortenAddress(account)}</span>
        <button
          onClick={disconnect}
          className={`${classes} px-3 py-1.5 text-sm bg-neutral-800 hover:bg-neutral-700`}
          title="Disconnect"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const isLoading = loading || (hasXumm && !sdkReady);

  return (
    <button
      onClick={connect}
      disabled={isLoading}
      className={classes}
      title="Connect with XUMM"
    >
      <Wallet className="w-4 h-4" />
      {isLoading ? (sdkReady ? 'Connecting...' : 'Loading...') : 'Connect Wallet'}
      {error && <span className="sr-only">{error}</span>}
    </button>
  );
}
