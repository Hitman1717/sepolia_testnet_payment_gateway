## Web3 Marketplace (Sepolia)

Decentralized marketplace for physical and digital items with on-chain traceability (Sepolia). React (Vite) frontend, Express + MongoDB backend, optional Hardhat workspace.

### Features
- Wallet-based login (nonce + signature)
- Seller-defined pricing; buyers pay exact `priceWei`
- Product lifecycle off-chain and on-chain:
  - Off-chain: list/unlist, ownership tracked for easy queries (current owner + owner history)
  - On-chain (optional enhanced contract): auto-ownership transfer on buy; list/unlist via contract
- Pages: Login, Signup, Marketplace, Sell, Trace, My Items
- Traceability: append and view on-chain `TraceUpdated` events

### Prerequisites
- Node 18+
- MongoDB running
- MetaMask connected to Sepolia

### Install (root)
```bash
npm i
```

If your npm < 7, use:
```bash
npm i -w client -w server -w blockchain
```

### Configure
Server env (create `server/.env`):
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/eth-gateway
JWT_SECRET=replace-me
CORS_ORIGIN=http://localhost:5173
```

Client env (create `client/.env`):
```
VITE_API_BASE_URL=http://localhost:5000/api
```

Contract config:
- Paste your deployed address in `client/src/contract.js` as `MARKETPLACE_ADDRESS`
- Ensure `MARKETPLACE_ABI` matches your deployed contract ABI

### Run
Backend:
```bash
npm run start:server
```

Frontend:
```bash
npm run dev:client
```

Open: `http://localhost:5173`

### Usage
1) Login/Signup: sign a message with MetaMask
2) Sell: create product (sets price in ETH → stored as Wei; on-chain product created if contract set)
3) Marketplace: buy (sends exact priceWei to contract `buy(productId)`) 
4) Trace: append and view trace events for a productId
5) My Items: see items owned by your wallet (off-chain), list/unlist with price; in Trace page, view on-chain items owned by any address

### Deploying the contract (Remix)
- Compile `Marketplace.sol` with 0.8.24
- Deploy on Sepolia via Injected Provider
- Copy address into `client/src/contract.js`

### Production tips
- Use a managed MongoDB (e.g., Atlas) and set `MONGO_URI`
- Set `CORS_ORIGIN` to your deployed frontend URL
- Set `VITE_API_BASE_URL` in frontend to your deployed server URL
- Consider verifying contract on Etherscan


