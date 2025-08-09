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
        string title;
        string metadataURI; // optional off-chain metadata or IPFS
        uint256 priceWei;
        bool isDigital;
        bool active;
    }

    uint256 public productCount;
    mapping(uint256 => Product) public products;

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
            title: title,
            metadataURI: metadataURI,
            priceWei: priceWei,
            isDigital: isDigital,
            active: true
        });

        emit ProductCreated(productId, msg.sender, title, priceWei, isDigital, metadataURI);
        return productId;
    }

    function setProductActive(uint256 productId, bool active) external onlySeller(productId) {
        products[productId].active = active;
    }

    function buy(uint256 productId) external payable {
        Product memory product = products[productId];
        require(product.seller != address(0), "invalid product");
        require(product.active, "inactive");
        require(msg.value == product.priceWei, "wrong price");

        // Transfer to seller
        (bool ok, ) = product.seller.call{value: msg.value}("");
        require(ok, "pay fail");

        // A simple receipt hash can be generated client-side; store emitted value here for off-chain pairing
        bytes32 receiptHash = keccak256(abi.encodePacked(blockhash(block.number - 1), msg.sender, productId, msg.value));
        emit ProductPurchased(productId, msg.sender, msg.value, receiptHash);
    }

    // Traceability: append a status step (e.g., "manufactured", "packed", "shipped", "delivered")
    function trace(uint256 productId, string calldata status, string calldata dataURI) external onlySeller(productId) {
        require(products[productId].seller != address(0), "invalid product");
        emit TraceUpdated(productId, status, dataURI, block.timestamp);
    }
}


