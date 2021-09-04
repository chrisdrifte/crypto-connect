import { CryptoConnectError } from "@crypto-connect/errors/src";
import { ERC20Token, EthereumConfig } from "./ethereum-types";
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
  contracts = {};

  /**
   * Supply config in constructor
   */
  constructor(public config: EthereumConfig) {
    super();

    // Process token contracts
    const {
      config: { web3, erc20Tokens },
      contracts,
    } = this;

    const abi = EthereumConnection.getERC20BalanceABI();

    erc20Tokens.forEach(({ name, contractAddress }) => {
      contracts[name] = new web3.eth.Contract(abi, contractAddress);
    });
  }

  static getERC20BalanceABI(): any[] {
    return [
      {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        type: "function",
      },
    ];
  }

  async getEthBalance(): Promise<string> {
    const {
      web3: { eth, utils },
      walletAddress,
    } = this.config;

    // Get ETH balance
    const wei = await eth.getBalance(walletAddress);
    const ethBalance = utils.fromWei(wei);

    return ethBalance;
  }

  async getERC20TokenBalance(erc20Token: ERC20Token): Promise<string> {
    const {
      config: {
        web3: { utils },
        walletAddress,
      },
      contracts,
    } = this;

    const contract = contracts[erc20Token.name];

    if (typeof contract === "undefined") {
      throw new CryptoConnectError(
        `Can't get balance without contract for ${erc20Token.name}`,
      );
    }

    const wei = await contract.methods.balanceOf(walletAddress).call();
    const tokenBalance = utils.fromWei(wei);

    return tokenBalance;
  }

  /**
   * Get normalized list of Ethereum balances
   */
  async getBalances(): Promise<CryptoBalance[]> {
    const {
      contracts,
      config: { erc20Tokens },
    } = this;

    const ethPromise = this.getEthBalance();
    const erc20Promises = erc20Tokens.map((token) =>
      this.getERC20TokenBalance(token),
    );

    const assets = ["ETH", ...erc20Tokens.map(({ name }) => name)];
    const amounts = await Promise.all([ethPromise, ...erc20Promises]);

    const balances: CryptoBalance[] = assets.map((name, i) => {
      const id = ["ethereum", name, contracts[name]?.options?.address]
        .filter((n) => n)
        .join("-");
      const asset = name;
      const amount = amounts[i];

      return {
        id,
        asset,
        amount,
      };
    });

    return balances;
  }
}

export { EthereumConnection as Ethereum };
