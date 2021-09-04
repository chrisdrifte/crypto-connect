import Web3 from "web3";

export type EthereumConfig = {
  web3: Web3;
  erc20Tokens: ERC20Token[];
  walletAddress: string;
};

export interface ERC20Token {
  name: string;
  contractAddress: string;
}
