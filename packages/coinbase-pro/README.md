# Coinbase Pro

## Install

| Package      | NPM                                  | Yarn                                    |
| ------------ | ------------------------------------ | --------------------------------------- |
| Coinbase Pro | `npm i @crypto-connect/coinbase-pro` | `yarn add @crypto-connect/coinbase-pro` |

## Usage

```ts
import coinbaseProConnect from "@crypto-connect/coinbase-pro";

// Authorise
const coinbasePro = coinbaseProConnect().withApiKeys({
  apiKey: "XXX",
  apiSecret: "YYY",
  passphrase: "ZZZ",
});

// Get balances
const balances = await coinbasePro.getBalances();
```
