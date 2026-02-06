import { Client } from 'xrpl';

const XRPSCAN_DEX = 'https://xrpscan.com/trade';
const XRPSCAN_ACCOUNT = 'https://xrpscan.com/account';
const isTestnet = import.meta.env.VITE_XRPL_NETWORK === 'testnet';
const WS_URL = isTestnet ? 'wss://s.altnet.rippletest.net:51233' : 'wss://xrplcluster.com';

export async function verifyToken(currency, issuer) {
  try {
    const client = new Client(WS_URL);
    await client.connect();

    const response = await client.request({
      command: 'account_lines',
      account: issuer,
      ledger_index: 'validated',
    });

    await client.disconnect();

    const lines = response.result.lines || [];
    const tokenLine = lines.find((l) => l.currency === currency && l.account === issuer);
    return !!tokenLine;
  } catch (e) {
    console.error('XRPL verify error:', e);
    return false;
  }
}

export function getTrustTokenUrl(currency, issuer) {
  return `${XRPSCAN_ACCOUNT}/${issuer}`;
}

export function getDexUrl(currency, issuer) {
  return `${XRPSCAN_DEX}?currency=${encodeURIComponent(currency)}&issuer=${encodeURIComponent(issuer)}`;
}

export function getExplorerUrl(issuer) {
  return `https://xrpscan.com/account/${issuer}`;
}
