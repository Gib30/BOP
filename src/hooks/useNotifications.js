import { useState, useEffect } from 'react';
import { supabase, hasSupabase } from '../lib/supabase';

export function useNotifications(walletAddress) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!hasSupabase || !walletAddress) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    async function fetchNotifications() {
      setLoading(true);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('recipient', walletAddress)
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error) {
        setNotifications(data || []);
        setUnreadCount((data || []).filter((n) => !n.read).length);
      }
      setLoading(false);
    }

    fetchNotifications();

    const channel = supabase
      .channel(`notifications:${walletAddress}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `recipient=eq.${walletAddress}` }, () => {
        fetchNotifications();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [walletAddress]);

  const markAsRead = async (id) => {
    if (!hasSupabase) return;
    await supabase.from('notifications').update({ read: true }).eq('id', id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const markAllRead = async () => {
    if (!hasSupabase || !walletAddress) return;
    await supabase.from('notifications').update({ read: true }).eq('recipient', walletAddress).eq('read', false);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return { notifications, loading, unreadCount, markAsRead, markAllRead };
}
