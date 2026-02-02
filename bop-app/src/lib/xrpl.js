import { Client } from 'xrpl';

const XRPSCAN_DEX = 'https://xrpscan.com/trade';
const XRPSCAN_ACCOUNT = 'https://xrpscan.com/account';

export async function verifyToken(currency, issuer) {
  try {
    const client = new Client('wss://xrplcluster.com');
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
