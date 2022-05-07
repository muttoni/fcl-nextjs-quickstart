import { config } from "@onflow/fcl";
import {send as grpcSend} from "@onflow/transport-grpc";

config({
  "app.detail.title": "Flow Next.js Quick Start",
  "app.detail.icon": "https://unavatar.io/twitter/muttonia",
  "accessNode.api": process.env.NEXT_PUBLIC_ACCESS_NODE_API,
  "discovery.wallet": process.env.NEXT_PUBLIC_DISCOVERY_WALLET,
  "0xProfile": process.env.NEXT_PUBLIC_CONTRACT_PROFILE, // The account address where the smart contract lives
})

const env = process.env.NODE_ENV
if(env == "development"){
  console.log('development')
  config({"sdk.transport":  grpcSend})
}