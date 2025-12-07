// This service simulates on-chain interactions
import { db } from './mockBackend';
import { ProjectStatus } from '../types';

export const mockAptos = {
  connectWallet: async (): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`0x${Math.random().toString(16).slice(2, 42)}`);
      }, 1000);
    });
  },

  mintTokens: async (projectId: string, supply: number, symbol: string): Promise<boolean> => {
    console.log(`[Aptos Mock] Minting ${supply} ${symbol} tokens for project ${projectId}...`);
    return new Promise((resolve) => {
      setTimeout(() => {
        db.updateProjectStatus(projectId, ProjectStatus.LIVE, { tokenSupply: supply, tokenSymbol: symbol });
        resolve(true);
      }, 2000);
    });
  },

  invest: async (projectId: string, amount: number, walletAddress: string): Promise<boolean> => {
    console.log(`[Aptos Mock] Wallet ${walletAddress} investing ${amount} USDC into Project ${projectId}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        db.addFunding(projectId, amount);
        resolve(true);
      }, 1500);
    });
  },

  releaseFunds: async (projectId: string, installerWallet: string): Promise<boolean> => {
    console.log(`[Aptos Mock] Releasing funds from Escrow to ${installerWallet} for Project ${projectId}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        db.updateProjectStatus(projectId, ProjectStatus.DISBURSED);
        resolve(true);
      }, 2000);
    });
  }
};