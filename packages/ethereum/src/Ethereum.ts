import { EthereumConfig } from "./ethereum-types";
import {
  BaseConnection,
  BaseConnectionInterface,
  CryptoBalance,
} from "@crypto-connect/common";

interface EthereumConnectionInterface extends BaseConnectionInterface {
  config: EthereumConfig;
}

/**
 * Ethereum API Client
 */
class EthereumConnection
  extends BaseConnection
  implements EthereumConnectionInterface
{
  /**
   * Supply config in constructor
   */
  constructor(public config: EthereumConfig) {
    super();
  }

  /**
   * Get normalized list of Ethereum balances
   */
  async getBalances(): Promise<CryptoBalance[]> {
    const {
      web3: { eth, utils },
      walletAddress,
    } = this.config;

    const wei = await eth.getBalance(walletAddress);
    const ethBalance = utils.fromWei(wei);

    const balances = [
      {
        id: "eth-eth",
        asset: "ETH",
        amount: ethBalance,
      },
    ];
    return balances;
  }

  /**
   * Make request via web3
   */
  async request(abi: Record<string, any>): Promise<any> {
    abi;
    return "result";
  }
}

export { EthereumConnection as Ethereum };
