import { config } from "@onflow/fcl";

config({
  "accessNode.api": "http://localhost:8080",
  // "accessNode.api": "https://access-testnet.onflow.org",
  "discovery.wallet": "http://localhost:8701/fcl/authn",
  // "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
  "0xProfile": "0xf8d6e0586b0a20c7", // The account address where the smart contract lives
  // "0xProfile": "0xba1132bc08f82fe2" // The account address where the smart contract lives
  "app.detail.icon": "http://localhost:3000/flow-logo.svg",
  "app.detail.title": "Flow Next.js Quick Start"
})