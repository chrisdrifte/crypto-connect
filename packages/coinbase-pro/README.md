# Coinbase Pro

## Install

| Exchange     | NPM                                  | Yarn                                    |
| ------------ | ------------------------------------ | --------------------------------------- |
| Coinbase Pro | `npm i @crypto-connect/coinbase-pro` | `yarn add @crypto-connect/coinbase-pro` |

## Usage

```ts
import { CoinbasePro } from "@crypto-connect/coinbase-pro";

async function getCoinbaseProBalances(
  apiKey: string,
  apiSecret: string,
  passphrase: string,
) {
  // Authorise
  const coinbasePro = new CoinbasePro().withApiKeys({
    apiKey: "XXX",
    apiSecret: "YYY",
    passphrase: "ZZZ",
  });

  // Get balances
  const balances = coinbasePro.getBalances();

  return balances;
}
```
