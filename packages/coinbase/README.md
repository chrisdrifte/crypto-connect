# Coinbase

## Install

| Exchange | NPM                             | Yarn                               |
| -------- | ------------------------------- | ---------------------------------- |
| Coinbase | `npm i @crypto-connect/coinbase | yarn add @crypto-connect/coinbase` |

## Usage

```ts
import { Coinbase } from "@crypto-connect/coinbase";

async function getCoinbaseBalances(apiKey: string, apiSecret: string) {
  // Authorise
  const coinbase = new Coinbase().useApiKeys({
    apiKey: "XXX",
    apiSecret: "YYY",
  });

  // Check credentials
  coinbase.throwErrorOnBadCredentials();

  // Get balances
  const balances = coinbase.getBalances();

  return balances;
}
```
