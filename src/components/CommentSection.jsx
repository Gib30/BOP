import { useState } from 'react';
import { MessageCircle, ThumbsUp, ThumbsDown, Reply } from 'lucide-react';
import { useComments, postComment, voteComment } from '../hooks/useComments';
import { useWallet } from '../context/WalletContext';
import ConnectWalletButton from './ConnectWalletButton';

export default function CommentSection({ projectId, commentCount }) {
  const [sortBy, setSortBy] = useState('newest');
  const [content, setContent] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const { account, isConnected } = useWallet();

  const { comments, loading } = useComments(projectId, sortBy);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    const result = await postComment(
      projectId,
      content.trim(),
      replyingTo?.id,
      isConnected ? account : null,
      displayName || (isConnected ? `${account?.slice(0, 8)}...` : 'Anonymous')
    );
    setSubmitting(false);

    if (result.error) {
      alert(result.error);
    } else {
      setContent('');
      setReplyingTo(null);
    }
  };

  const handleVote = async (commentId, vote) => {
    await voteComment(commentId, vote);
  };

  return (
    <div className="border-t border-neutral-800 pt-10">
      <h2 className="font-display text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <MessageCircle className="w-6 h-6" />
        Community Discussion ({commentCount})
      </h2>

      <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 mb-6">
        {!isConnected && (
          <p className="text-neutral-400 text-sm mb-4">
            Connect your wallet to join the conversation, or post as Anonymous.
          </p>
        )}
        <form onSubmit={handleSubmit}>
          {!isConnected && (
            <input
              type="text"
              placeholder="Display name (optional)"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full mb-3 px-4 py-2 bg-black/40 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-amber-700"
            />
          )}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={replyingTo ? `Reply to ${replyingTo.display_name || 'comment'}...` : "Share your thoughts..."}
            className="w-full bg-black/40 border border-neutral-800 rounded-xl p-4 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-700 resize-none"
            rows="4"
          />
          <div className="flex justify-between items-center mt-4">
            <div>
              {replyingTo && (
                <button
                  type="button"
                  onClick={() => setReplyingTo(null)}
                  className="text-sm text-neutral-400 hover:text-white"
                >
                  Cancel reply
                </button>
              )}
            </div>
            <div className="flex gap-2">
              {!isConnected && (
                <ConnectWalletButton variant="outline" className="px-4 py-2" />
              )}
              <button
                type="submit"
                disabled={submitting || !content.trim()}
                className="px-6 py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors"
              >
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setSortBy('newest')}
          className={`px-4 py-2 rounded-lg transition-colors ${sortBy === 'newest' ? 'bg-amber-600/20 text-amber-400' : 'text-neutral-400 hover:text-white'}`}
        >
          Newest
        </button>
        <button
          onClick={() => setSortBy('top')}
          className={`px-4 py-2 rounded-lg transition-colors ${sortBy === 'top' ? 'bg-amber-600/20 text-amber-400' : 'text-neutral-400 hover:text-white'}`}
        >
          Top
        </button>
      </div>

      {loading ? (
        <div className="text-neutral-400 py-8">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-neutral-500 py-8">No comments yet. Be the first to share your thoughts!</div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={() => setReplyingTo({ id: comment.id, display_name: comment.display_name })}
              onVote={handleVote}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CommentItem({ comment, onReply, onVote }) {
  const [voteLoading, setVoteLoading] = useState(false);

  const handleVote = async (vote) => {
    setVoteLoading(true);
    await onVote(comment.id, vote);
    setVoteLoading(false);
  };

  return (
    <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-white">
              {comment.display_name || comment.wallet_address?.slice(0, 8) + '...' || 'Anonymous'}
            </span>
            {comment.wallet_address && (
              <span className="px-2 py-0.5 text-xs font-medium bg-amber-600/20 text-amber-400 rounded-full border border-amber-600/50">
                Verified
              </span>
            )}
            <span className="text-neutral-500 text-sm">
              {new Date(comment.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-neutral-300 whitespace-pre-wrap">{comment.content}</p>
          <div className="flex items-center gap-4 mt-3">
            <button
              onClick={() => handleVote('up')}
              disabled={voteLoading}
              className="flex items-center gap-1 text-neutral-400 hover:text-amber-400 transition-colors"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{comment.upvotes || 0}</span>
            </button>
            <button
              onClick={() => handleVote('down')}
              disabled={voteLoading}
              className="flex items-center gap-1 text-neutral-400 hover:text-neutral-500 transition-colors"
            >
              <ThumbsDown className="w-4 h-4" />
              <span>{comment.downvotes || 0}</span>
            </button>
            <button
              onClick={onReply}
              className="flex items-center gap-1 text-neutral-400 hover:text-amber-400 transition-colors"
            >
              <Reply className="w-4 h-4" />
              Reply
            </button>
          </div>
        </div>
      </div>
      {comment.replies?.length > 0 && (
        <div className="mt-4 pl-6 border-l-2 border-neutral-800 space-y-4">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="bg-black/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-white text-sm">
                  {reply.display_name || reply.wallet_address?.slice(0, 8) + '...' || 'Anonymous'}
                </span>
                {reply.wallet_address && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-amber-600/20 text-amber-400 rounded-full border border-amber-600/50">
                    Verified
                  </span>
                )}
                <span className="text-neutral-500 text-xs">
                  {new Date(reply.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-neutral-300 text-sm whitespace-pre-wrap">{reply.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
