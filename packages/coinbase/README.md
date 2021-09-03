# Coinbase

## Install

| Exchange | NPM                              | Yarn                                |
| -------- | -------------------------------- | ----------------------------------- |
| Coinbase | `npm i @crypto-connect/coinbase` | `yarn add @crypto-connect/coinbase` |

## Usage

```ts
import coinbaseConnect from "@crypto-connect/coinbase";

// Authorise
const coinbase = coinbaseConnect.withApiKeys({
  apiKey: "XXX",
  apiSecret: "YYY",
});

// Get balances
const balances = await coinbase.getBalances();
```

## Links

- [Website](https://coinbase.com)
- [Official API docs](https://developers.coinbase.com/api/v2)
