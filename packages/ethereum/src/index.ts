import { Ethereum } from "./Ethereum";
import { EthereumToken } from "./ethereum-types";

const ethereumConnect = {
  /**
   * Use provider url to an ethereum node
   */
  withProvider(
    walletAddress: string,
    provider: string,
    tokens: EthereumToken[],
  ): Ethereum {
    return new Ethereum(walletAddress, provider, tokens);
  },
};

export default ethereumConnect;
