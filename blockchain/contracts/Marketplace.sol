// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * Simple Marketplace with traceability events for physical or digital goods.
 * - Sellers can create products with title/price/isDigital/metadataURI
 * - Buyers can purchase by paying the exact price
 * - Emits events for ProductCreated, ProductPurchased, TraceUpdated
 * - Traceability: seller (or authorized) can append trace steps (e.g., manufactured, shipped, delivered)
 */
contract Marketplace {
    struct Product {
        address payable seller;
        address owner;
        string title;
        string metadataURI; // optional off-chain metadata or IPFS
        uint256 priceWei;
        bool isDigital;
        bool active;
    }

    uint256 public productCount;
    mapping(uint256 => Product) public products;
    mapping(uint256 => address[]) private ownershipHistory;
    mapping(address => uint256[]) private ownerToProducts;

    event ProductCreated(
        uint256 indexed productId,
        address indexed seller,
        string title,
        uint256 priceWei,
        bool isDigital,
        string metadataURI
    );

    event ProductPurchased(
        uint256 indexed productId,
        address indexed buyer,
        uint256 priceWei,
        bytes32 receiptHash
    );

    event ProductListed(uint256 indexed productId, uint256 priceWei);
    event ProductUnlisted(uint256 indexed productId);
    event OwnershipTransferred(uint256 indexed productId, address indexed from, address indexed to);

    event TraceUpdated(
        uint256 indexed productId,
        string status,
        string dataURI,
        uint256 timestamp
    );

    modifier onlySeller(uint256 productId) {
        require(products[productId].seller == msg.sender, "not seller");
        _;
    }

    function createProduct(
        string calldata title,
        uint256 priceWei,
        bool isDigital,
        string calldata metadataURI
    ) external returns (uint256) {
        require(bytes(title).length > 0, "title required");
        require(priceWei > 0, "price required");

        productCount += 1;
        uint256 productId = productCount;
        products[productId] = Product({
            seller: payable(msg.sender),
            owner: msg.sender,
            title: title,
            metadataURI: metadataURI,
            priceWei: priceWei,
            isDigital: isDigital,
            active: true
        });

        emit ProductCreated(productId, msg.sender, title, priceWei, isDigital, metadataURI);
        ownershipHistory[productId].push(msg.sender);
        ownerToProducts[msg.sender].push(productId);
        return productId;
    }

    function listForSale(uint256 productId, uint256 priceWei) external {
        require(products[productId].owner == msg.sender, "not owner");
        require(priceWei > 0, "price required");
        products[productId].priceWei = priceWei;
        products[productId].active = true;
        emit ProductListed(productId, priceWei);
    }

    function unlist(uint256 productId) external {
        require(products[productId].owner == msg.sender, "not owner");
        products[productId].active = false;
        emit ProductUnlisted(productId);
    }

    function buy(uint256 productId) external payable {
        Product storage product = products[productId];
        require(product.seller != address(0), "invalid product");
        require(product.active, "inactive");
        require(msg.value == product.priceWei, "wrong price");

        // Transfer to seller
        address previousOwner = product.owner;
        (bool ok, ) = product.seller.call{value: msg.value}("");
        require(ok, "pay fail");

        // Transfer ownership and unlist
        product.owner = msg.sender;
        product.seller = payable(msg.sender);
        product.active = false;

        // Track ownership history and index
        ownershipHistory[productId].push(msg.sender);
        ownerToProducts[msg.sender].push(productId);

        // Emit events
        bytes32 receiptHash = keccak256(abi.encodePacked(blockhash(block.number - 1), msg.sender, productId, msg.value));
        emit OwnershipTransferred(productId, previousOwner, msg.sender);
        emit ProductPurchased(productId, msg.sender, msg.value, receiptHash);
    }

    // Traceability: append a status step (e.g., "manufactured", "packed", "shipped", "delivered")
    function trace(uint256 productId, string calldata status, string calldata dataURI) external onlySeller(productId) {
        require(products[productId].seller != address(0), "invalid product");
        emit TraceUpdated(productId, status, dataURI, block.timestamp);
    }

    // Views
    function getOwnershipHistory(uint256 productId) external view returns (address[] memory) {
        return ownershipHistory[productId];
    }

    function getProductsOwnedBy(address user) external view returns (uint256[] memory) {
        return ownerToProducts[user];
    }
}


