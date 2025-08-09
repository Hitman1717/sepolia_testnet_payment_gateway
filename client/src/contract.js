// Placeholder ABI and address. After deploying with Hardhat, paste the ABI and address here.
export const MARKETPLACE_ABI = [
  // state getters
  {
    "inputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "name": "products",
    "outputs": [
      { "internalType": "address", "name": "seller", "type": "address" },
      { "internalType": "address", "name": "owner", "type": "address" },
      { "internalType": "string", "name": "title", "type": "string" },
      { "internalType": "string", "name": "metadataURI", "type": "string" },
      { "internalType": "uint256", "name": "priceWei", "type": "uint256" },
      { "internalType": "bool", "name": "isDigital", "type": "bool" },
      { "internalType": "bool", "name": "active", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "title", "type": "string" },
      { "internalType": "uint256", "name": "priceWei", "type": "uint256" },
      { "internalType": "bool", "name": "isDigital", "type": "bool" },
      { "internalType": "string", "name": "metadataURI", "type": "string" }
    ],
    "name": "createProduct",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "productId", "type": "uint256" }
    ],
    "name": "buy",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "productId", "type": "uint256" },
      { "internalType": "uint256", "name": "priceWei", "type": "uint256" }
    ],
    "name": "listForSale",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "productId", "type": "uint256" }
    ],
    "name": "unlist",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "productId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "seller", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "title", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "priceWei", "type": "uint256" },
      { "indexed": false, "internalType": "bool", "name": "isDigital", "type": "bool" },
      { "indexed": false, "internalType": "string", "name": "metadataURI", "type": "string" }
    ],
    "name": "ProductCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "productId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "buyer", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "priceWei", "type": "uint256" },
      { "indexed": false, "internalType": "bytes32", "name": "receiptHash", "type": "bytes32" }
    ],
    "name": "ProductPurchased",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "productId", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "priceWei", "type": "uint256" }
    ],
    "name": "ProductListed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "productId", "type": "uint256" }
    ],
    "name": "ProductUnlisted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "productId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "from", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "to", "type": "address" }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "productId", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "status", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "dataURI", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "TraceUpdated",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "productId", "type": "uint256" },
      { "internalType": "string", "name": "status", "type": "string" },
      { "internalType": "string", "name": "dataURI", "type": "string" }
    ],
    "name": "trace",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "productId", "type": "uint256" }
    ],
    "name": "getOwnershipHistory",
    "outputs": [
      { "internalType": "address[]", "name": "", "type": "address[]" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "user", "type": "address" }
    ],
    "name": "getProductsOwnedBy",
    "outputs": [
      { "internalType": "uint256[]", "name": "", "type": "uint256[]" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export const MARKETPLACE_ADDRESS = "0xf3ca2e97152bc5893ee632d7728bae5295300d7a"; // fill after deploy

// Set the version of the deployed contract address you are pointing to.
// 'v1' = original contract (createProduct, buy, trace, setProductActive)
// 'v2' = enhanced contract (owner tracking, listForSale, unlist, ownership queries)
export const CONTRACT_VERSION = 'v2';


