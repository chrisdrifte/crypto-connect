# Kraken

## Install

| Exchange | NPM                            | Yarn                              |
| -------- | ------------------------------ | --------------------------------- |
| Kraken   | `npm i @crypto-connect/kraken` | `yarn add @crypto-connect/kraken` |

## Usage

```ts
import krakenConnect from "@crypto-connect/kraken";

// Authorise
const kraken = krakenConnect().withApiKeys({
  apiKey: "XXX",
  apiSecret: "YYY",
});

// Get balances
const balances = await kraken.getBalances();
```
