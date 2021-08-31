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
  const coinbase = new Coinbase().withApiKeys({
    apiKey: "XXX",
    apiSecret: "YYY",
  });

  // Optionally check permissions associated with credentials are correct
  await coinbase.throwErrorOnInvalidPermissions();

  // Get balances
  const balances = await coinbase.getBalances();

  return balances;
}
```

## Links

- [Website](https://coinbase.com)
- [Official API docs](https://developers.coinbase.com/api/v2)
