#!/usr/bin/env node
/**
 * Fund treasury wallet on XRPL Testnet using xrpl package.
 * Run: node scripts/fund-treasury-testnet.js
 * Requires: VITE_TREASURY_WALLET and TREASURY_SECRET in .env, or pass address as arg
 */
import { Client, Wallet } from 'xrpl';
import { readFileSync, existsSync } from 'fs';

const envPath = '.env';
let env = {};
if (existsSync(envPath)) {
  readFileSync(envPath, 'utf8').split('\n').forEach((line) => {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) env[m[1].trim()] = m[2].trim();
  });
}

const address = process.argv[2] || env.VITE_TREASURY_WALLET || 'rBtytxMDHmbbUbWE4RL77UBaPUdTSs4pkg';
const secret = env.TREASURY_SECRET || 'sEdS8wNTgLG41D97cV9iTF32Wb4Cg5n';

async function main() {
  const client = new Client('wss://s.altnet.rippletest.net:51233');
  await client.connect();

  const wallet = Wallet.fromSeed(secret);
  if (wallet.address !== address) {
    console.warn('Warning: wallet address', wallet.address, '!= expected', address);
  }

  console.log('Funding', address, 'on Testnet...');
  const result = await client.fundWallet(wallet, { faucetHost: 'faucet.altnet.rippletest.net', faucetPath: '/accounts' });
  console.log('Funded! Balance:', result.balance, 'XRP');
  await client.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
