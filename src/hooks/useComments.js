import { useState, useEffect, useCallback } from 'react';
import { supabase, hasSupabase } from '../lib/supabase';

export function useComments(projectId, sortBy = 'newest') {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = useCallback(
    async (silent = false) => {
      if (!projectId || !hasSupabase) return;
      if (!silent) setLoading(true);
      try {
        let query = supabase
          .from('comments')
          .select('*')
          .eq('project_id', projectId)
          .is('parent_id', null);

        if (sortBy === 'top') {
          query = query.order('upvotes', { ascending: false });
        } else {
          query = query.order('created_at', { ascending: false });
        }

        const { data, error } = await query;

        if (error) throw error;

        const topLevel = data || [];
        const withReplies = await Promise.all(
          topLevel.map(async (c) => {
            const { data: replies } = await supabase
              .from('comments')
              .select('*')
              .eq('parent_id', c.id)
              .order('created_at', { ascending: true });
            return { ...c, replies: replies || [] };
          })
        );

        setComments(withReplies);
      } catch (e) {
        setComments([]);
      } finally {
        setLoading(false);
      }
    },
    [projectId, sortBy]
  );

  useEffect(() => {
    if (!projectId) {
      setComments([]);
      setLoading(false);
      return;
    }

    if (!hasSupabase) {
      setComments([]);
      setLoading(false);
      return;
    }

    fetchComments();

    const channel = supabase
      .channel(`comments:${projectId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments', filter: `project_id=eq.${projectId}` }, () => {
        fetchComments(true);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, sortBy, fetchComments]);

  return { comments, loading, refetch: () => fetchComments(true) };
}

export async function postComment(projectId, content, parentId = null, walletAddress = null, displayName = null) {
  if (!hasSupabase) return { error: 'Supabase not configured' };

  const { data, error } = await supabase.from('comments').insert({
    project_id: projectId,
    parent_id: parentId,
    content,
    wallet_address: walletAddress,
    display_name: displayName,
  }).select().single();

  if (error) return { error: error.message };
  return { data };
}

export async function voteComment(commentId, vote) {
  if (!hasSupabase) return { error: 'Supabase not configured' };

  const { data: comment } = await supabase.from('comments').select('upvotes, downvotes').eq('id', commentId).single();

  if (!comment) return { error: 'Comment not found' };

  const updates = vote === 'up'
    ? { upvotes: (comment.upvotes || 0) + 1 }
    : { downvotes: (comment.downvotes || 0) + 1 };

  const { error } = await supabase.from('comments').update(updates).eq('id', commentId);

  if (error) return { error: error.message };
  return {};
}
