# Binance

## Install

| Exchange | NPM                             | Yarn                               |
| -------- | ------------------------------- | ---------------------------------- |
| Binance  | `npm i @crypto-connect/binance` | `yarn add @crypto-connect/binance` |

## Usage

```ts
import binanceConnect from "@crypto-connect/binance";

// Authorise
const binance = binanceConnect.withApiKeys({
  apiKey: "XXX",
  apiSecret: "YYY",
});

// Get balances
const balances = await binance.getBalances();
```
