// Placeholder ABI and address. After deploying with Hardhat, paste the ABI and address here.
export const MARKETPLACE_ABI = [
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
    "inputs": [{ "internalType": "uint256", "name": "productId", "type": "uint256" }],
    "name": "buy",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "productId", "type": "uint256" },
      { "internalType": "bool", "name": "active", "type": "bool" }
    ],
    "name": "setProductActive",
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
  }
];

export const MARKETPLACE_ADDRESS = "0xe19db5a04f59da789cbfd1b81c0fe12135b21b49"; // fill after deploy


