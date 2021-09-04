import { CryptoConnect } from "@crypto-connect/common";
import { Ethereum } from "./Ethereum";
import { EthereumConfig } from "./ethereum-types";

type EthereumBaseConfig = Omit<EthereumConfig, "walletAddress">;

const ethereumConnect: CryptoConnect<EthereumBaseConfig, Ethereum> = (
  config,
) => ({
  /**
   * Use provider url to an ethereum node
   */
  withWallet(walletAddress: EthereumConfig["walletAddress"]): Ethereum {
    return new Ethereum({ ...config, walletAddress });
  },
});

export default ethereumConnect;
