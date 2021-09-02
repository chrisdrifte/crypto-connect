# Binance

## Install

| Exchange | NPM                             | Yarn                               |
| -------- | ------------------------------- | ---------------------------------- |
| Binance  | `npm i @crypto-connect/binance` | `yarn add @crypto-connect/binance` |

## Usage

```ts
import { Binance } from "@crypto-connect/binance";

async function getBinanceBalances(
  apiKey: string,
  apiSecret: string,
  passphrase: string,
) {
  // Authorise
  const binance = new Binance().withApiKeys({
    apiKey: "XXX",
    apiSecret: "YYY",
  });

  // Get balances
  const balances = await binance.getBalances();

  return balances;
}
```
