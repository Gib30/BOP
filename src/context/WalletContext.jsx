import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [xumm, setXumm] = useState(null);

  const apiKey = import.meta.env.VITE_XUMM_API_KEY;

  useEffect(() => {
    if (!apiKey) return;

    const XummClass = window.Xumm;
    if (!XummClass) {
      const check = setInterval(() => {
        if (window.Xumm) {
          clearInterval(check);
          initXumm();
        }
      }, 100);
      return () => clearInterval(check);
    }

    initXumm();

    function initXumm() {
      try {
        const instance = new window.Xumm(apiKey);
        setXumm(instance);

        instance.on('ready', () => setXumm(instance));
        instance.on('success', async () => {
          const addr = await instance.user.account;
          setAccount(addr || null);
        });
        instance.on('logout', () => setAccount(null));

        instance.user.account.then((addr) => {
          if (addr) setAccount(addr);
        });
      } catch (e) {
        setError(e?.message || 'Failed to load XUMM');
      }
    }
  }, [apiKey]);

  const connect = useCallback(async () => {
    if (!xumm) {
      setError('XUMM not ready. Add VITE_XUMM_API_KEY to .env and ensure script loaded.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await xumm.authorize();
    } catch (e) {
      setError(e?.message || 'Connection failed');
    } finally {
      setLoading(false);
    }
  }, [xumm]);

  const disconnect = useCallback(async () => {
    if (xumm) {
      await xumm.logout();
      setAccount(null);
    }
  }, [xumm]);

  const isTestnet = import.meta.env.VITE_XRPL_NETWORK === 'testnet';

  const requestPayment = useCallback(async (destination, amountDrops = '1000000', memo = '') => {
    if (!xumm) return { ok: false, error: 'XUMM not ready', qrUrl: null };
    try {
      const txjson = {
        TransactionType: 'Payment',
        Destination: destination,
        Amount: String(amountDrops),
      };
      if (memo) {
        const hex = Array.from(new TextEncoder().encode(memo))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');
        txjson.Memos = [{ Memo: { MemoData: hex } }];
      }
      const payload = { txjson, options: { submit: true } };
      if (isTestnet) payload.NetworkID = 1; // Testnet
      const { created, resolved } = await xumm.payload.createAndSubscribe(
        payload,
        () => {}
      );
      return {
        ok: true,
        qrUrl: created?.next?.always ?? null,
        qrPng: created?.refs?.qr_png ?? null,
        resolved,
      };
    } catch (e) {
      return { ok: false, error: e?.message || 'Payment failed', qrUrl: null };
    }
  }, [xumm, isTestnet]);

  const value = {
    account,
    loading,
    error,
    connect,
    disconnect,
    isConnected: !!account,
    hasXumm: !!apiKey,
    sdkReady: !!xumm,
    requestPayment,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
}
