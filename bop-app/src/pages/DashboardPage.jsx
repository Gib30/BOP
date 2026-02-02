import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, MessageCircle, Bell } from 'lucide-react';

export default function DashboardPage() {
  const [walletConnected] = useState(false);

  if (!walletConnected) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h1 className="font-display text-4xl font-bold text-white mb-4">My Dashboard</h1>
        <p className="text-neutral-400 mb-8">
          Connect your wallet to see your submissions, comments, and notifications.
        </p>
        <button className="px-8 py-4 bg-amber-600 hover:bg-amber-500 rounded-full font-semibold transition-colors">
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl font-bold text-white mb-8">My Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
          <FileText className="w-8 h-8 text-amber-400 mb-4" />
          <h3 className="font-display text-xl font-bold text-white mb-2">My Submissions</h3>
          <p className="text-neutral-400 text-sm">Projects you've submitted for review</p>
          <Link to="/submit" className="text-amber-400 hover:text-amber-300 text-sm mt-2 inline-block">
            Submit a project →
          </Link>
        </div>
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
          <MessageCircle className="w-8 h-8 text-amber-400 mb-4" />
          <h3 className="font-display text-xl font-bold text-white mb-2">My Comments</h3>
          <p className="text-neutral-400 text-sm">Comments you've posted</p>
        </div>
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
          <Bell className="w-8 h-8 text-amber-400 mb-4" />
          <h3 className="font-display text-xl font-bold text-white mb-2">Notifications</h3>
          <p className="text-neutral-400 text-sm">Replies and project updates</p>
        </div>
      </div>

      <div className="text-neutral-500 text-sm">
        Dashboard content will populate when you connect your wallet and have activity.
      </div>
    </div>
  );
}
