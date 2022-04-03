# How to use the Flow Client Library (FCL) with Next.js

Everything you need to build a Next.js project with the Flow Client Library (FCL).

For a SvelteKit example, see my other repo: https://github.com/muttoni/fcl-sveltekit

## [Live demo](https://fcl-nextjs-quickstart.vercel.app/)

[![image](https://user-images.githubusercontent.com/27052451/146340356-e34f3c47-43bc-4c11-926b-b82b99d561c6.png)](https://fcl-sveltekit.vercel.app/)

## Running on Flow Testnet
This project will run on the Flow testnet simply as:
```bash
npm run build
npm run start
```

## Developing with Flow emulator

**Pre-Requisite**: To develop locally, make sure you have the Flow CLI installed: https://docs.onflow.org/flow-cli/install/

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start the emulator, deploy the contracts, followed by the development server:

```bash
flow emulator start --dev-wallet
flow project deploy --network emulator

npm run dev
# or start the server and open the app in a new browser tab
npm run dev -- --open
```

> NOTE: If you are switching between testnet and the emulator without changing tabs, FCL will keep you logged in with your testnet address (or vice-versa). Remember to logout inbetween environments to avoid runtime errors!

## Building

Before creating a production version of your app, build it!

```bash
npm run build
```

## Testimonials

<img width="343" alt="Screenshot 2022-04-03 at 12 12 20" src="https://user-images.githubusercontent.com/27052451/161422572-007a3740-8272-4e8b-95da-2ec1d5f192d3.png">
