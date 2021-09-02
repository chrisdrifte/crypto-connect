# Kraken

## Install

| Exchange | NPM                            | Yarn                              |
| -------- | ------------------------------ | --------------------------------- |
| Kraken   | `npm i @crypto-connect/kraken` | `yarn add @crypto-connect/kraken` |

## Usage

```ts
import { Kraken } from "@crypto-connect/kraken";

async function getKrakenBalances(
  apiKey: string,
  apiSecret: string,
  passphrase: string,
) {
  // Authorise
  const kraken = new Kraken().withApiKeys({
    apiKey: "XXX",
    apiSecret: "YYY",
  });

  // Get balances
  const balances = await kraken.getBalances();

  return balances;
}
```
