#!/usr/bin/env node
/**
 * Generate an XRPL wallet for treasury (submission fees).
 * Run: node scripts/generate-treasury-wallet.js
 * Add the address to Vercel env as VITE_TREASURY_WALLET
 * Fund it with XRP (or test XRP from faucet.xrpl.org for Testnet)
 */
import { Wallet } from 'xrpl';

const wallet = Wallet.generate();
console.log('\n--- Treasury Wallet ---');
console.log('Address:', wallet.address);
console.log('Secret:', wallet.seed);
console.log('\nAdd to Vercel: VITE_TREASURY_WALLET=' + wallet.address);
console.log('Fund with XRP: https://faucet.xrpl.org (Testnet) or send real XRP (Mainnet)\n');
