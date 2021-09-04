# Etheruem

## Install

| Exchange | NPM                              | Yarn                                |
| -------- | -------------------------------- | ----------------------------------- |
| Etheruem | `npm i @crypto-connect/ethereum` | `yarn add @crypto-connect/ethereum` |

## Usage

```ts
import Web3 from "web3";
import ethereumConnect from "@crypto-connect/ethereum";

// Set up Web3
const httpProvider = new Web3.providers.HttpProvider("<ETH_NODE_URL>");
const tokens = [];

// Authorise
const ethereum = ethereumConnect({
  web3: new Web3(httpProvider),
  tokens: [],
}).withWallet("<WALLET_ADDRESS>");

// Get balances
const balances = await ethereum.getBalances();
```
