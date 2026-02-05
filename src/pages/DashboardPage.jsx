import { Link } from 'react-router-dom';
import { FileText, MessageCircle, Bell, ExternalLink } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useUserDashboard } from '../hooks/useUserDashboard';
import ConnectWalletButton from '../components/ConnectWalletButton';

function shortenAddress(addr) {
  if (!addr || addr.length < 12) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function DashboardPage() {
  const { account, isConnected } = useWallet();
  const { submissions, comments, loading } = useUserDashboard(account);

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h1 className="font-display text-4xl font-bold text-white mb-4">My Dashboard</h1>
        <p className="text-neutral-400 mb-8">
          Connect your wallet to see your submissions, comments, and activity.
        </p>
        <ConnectWalletButton variant="outline" className="px-8 py-4" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-4xl font-bold text-white">My Dashboard</h1>
        <span className="text-neutral-500 font-mono text-sm">{shortenAddress(account)}</span>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
          <FileText className="w-8 h-8 text-amber-400 mb-4" />
          <h3 className="font-display text-xl font-bold text-white mb-2">My Submissions</h3>
          <p className="text-neutral-400 text-sm mb-2">{submissions.length} project{submissions.length !== 1 ? 's' : ''}</p>
          <Link to="/submit" className="text-amber-400 hover:text-amber-300 text-sm inline-flex items-center gap-1">
            Submit a project <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
          <MessageCircle className="w-8 h-8 text-amber-400 mb-4" />
          <h3 className="font-display text-xl font-bold text-white mb-2">My Comments</h3>
          <p className="text-neutral-400 text-sm">{comments.length} comment{comments.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
          <Bell className="w-8 h-8 text-amber-400 mb-4" />
          <h3 className="font-display text-xl font-bold text-white mb-2">Activity</h3>
          <p className="text-neutral-400 text-sm">Replies and project updates</p>
        </div>
      </div>

      {loading ? (
        <div className="text-amber-400 font-display">Loading...</div>
      ) : (
        <div className="space-y-8">
          {submissions.length > 0 && (
            <div>
              <h2 className="font-display text-2xl font-bold text-white mb-4">My Submissions</h2>
              <div className="space-y-3">
                {submissions.map((p) => (
                  <Link
                    key={p.id}
                    to={`/project/${p.id}`}
                    className="block bg-neutral-900/50 border border-neutral-800 hover:border-amber-900/50 rounded-xl p-4 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white">{p.name}</span>
                        <span className="text-amber-400 font-mono ml-2">${p.ticker}</span>
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${p.status === 'approved' ? 'bg-green-500/20 text-green-400' : p.status === 'pending' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                          {p.status}
                        </span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-neutral-500" />
                    </div>
                    <p className="text-neutral-500 text-sm mt-1 font-mono truncate">{p.issuer}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {comments.length > 0 && (
            <div>
              <h2 className="font-display text-2xl font-bold text-white mb-4">Recent Comments</h2>
              <div className="space-y-3">
                {comments.map((c) => (
                  <Link
                    key={c.id}
                    to={`/project/${c.project_id}`}
                    className="block bg-neutral-900/50 border border-neutral-800 hover:border-amber-900/50 rounded-xl p-4 transition-colors"
                  >
                    <p className="text-neutral-300 text-sm line-clamp-2">{c.content}</p>
                    <p className="text-neutral-500 text-xs mt-2">Project #{c.project_id} · {new Date(c.created_at).toLocaleDateString()}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {!loading && submissions.length === 0 && comments.length === 0 && (
            <div className="text-center py-12 text-neutral-500">
              <p className="mb-4">No submissions or comments yet.</p>
              <Link to="/submit" className="text-amber-400 hover:text-amber-300 font-semibold">
                Submit your first project →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
