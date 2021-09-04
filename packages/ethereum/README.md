# Ethereum

## Install

| Exchange | NPM                              | Yarn                                |
| -------- | -------------------------------- | ----------------------------------- |
| Ethereum | `npm i @crypto-connect/ethereum` | `yarn add @crypto-connect/ethereum` |

## Usage

```ts
import Web3 from "web3";
import ethereumConnect from "@crypto-connect/ethereum";

// Set up Web3
const httpProvider = new Web3.providers.HttpProvider("<ETH_NODE_URL>");
const web3 = new Web3(httpProvider);

// List of tokens to find balances for
const erc20Tokens = [
  {
    name: "BAT",
    contractAddress: "0x0d8775f648430679a709e98d2b0cb6250d2887ef",
  },
];

// Authorise
const ethereum = ethereumConnect({ web3, erc20Tokens }).withWallet(
  "<WALLET_ADDRESS>",
);

// Get balances
const balances = await ethereum.getBalances();
```
