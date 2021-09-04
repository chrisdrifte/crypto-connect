import Web3 from "web3";

export type EthereumConfig = {
  web3: Web3;
  tokens: EthereumToken[];
  walletAddress: string;
};

export interface EthereumToken {
  token: string;
  contractAddress: string;
  precision: number;
}
