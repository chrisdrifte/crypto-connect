import Web3 from "web3";
import { EthereumToken } from "./ethereum-types";
import {
  BaseConnection,
  BaseConnectionInterface,
  CryptoBalance,
} from "@crypto-connect/common";

interface EthereumConnectionInterface extends BaseConnectionInterface {
  walletAddress: string;
  web3: Web3;
}

/**
 * Ethereum API Client
 */
class EthereumConnection
  extends BaseConnection
  implements EthereumConnectionInterface
{
  web3: Web3;

  /**
   * Supply provider and tokens in constructor
   */
  constructor(
    public walletAddress: string,
    protected provider: string,
    public tokens: EthereumToken[],
  ) {
    super();

    const httpProvider = new Web3.providers.HttpProvider(provider);
    this.web3 = new Web3(httpProvider);
  }

  /**
   * Get normalized list of Ethereum balances
   */
  async getBalances(): Promise<CryptoBalance[]> {
    const { walletAddress } = this;
    const { eth, utils } = this.web3;

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
