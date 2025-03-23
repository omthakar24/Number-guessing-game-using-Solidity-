# Deploying the Smart Contract

To deploy the NumberGuessingGame smart contract to the Sepolia testnet, follow these steps:

## Prerequisites

1. Install [MetaMask](https://metamask.io/) browser extension
2. Get some Sepolia ETH from a faucet like [sepoliafaucet.com](https://sepoliafaucet.com/)
3. Create an account on [Remix IDE](https://remix.ethereum.org/)

## Deployment Steps

1. Open [Remix IDE](https://remix.ethereum.org/)
2. Create a new file called `NumberGuessingGame.sol`
3. Copy and paste the contract code from `contracts/NumberGuessingGame.sol`
4. Compile the contract by clicking on the "Compile" tab and then "Compile NumberGuessingGame.sol"
5. Go to the "Deploy & Run Transactions" tab
6. Change the environment to "Injected Provider - MetaMask"
7. Make sure MetaMask is connected to Sepolia testnet
8. Click "Deploy"
9. Confirm the transaction in MetaMask
10. Once deployed, copy the contract address
11. Update the `GAME_CONTRACT_ADDRESS` in `app/page.tsx` with your deployed contract address

## Fund the Contract

After deployment, you need to send some Sepolia ETH to the contract to ensure it can pay out prizes:

1. Send at least 0.1 Sepolia ETH to the deployed contract address
2. This will ensure the contract has enough funds to pay winners

## Verify the Contract (Optional)

You can verify your contract on [Sepolia Etherscan](https://sepolia.etherscan.io/) to make it easier for users to interact with:

1. Go to Sepolia Etherscan
2. Search for your contract address
3. Click on the "Contract" tab
4. Click "Verify and Publish"
5. Follow the instructions to verify your contract

