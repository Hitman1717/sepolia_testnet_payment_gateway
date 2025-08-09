// App.jsx (React frontend component)
import React, { useEffect, useMemo, useState } from "react";
import Web3 from "web3";
import { MARKETPLACE_ABI, MARKETPLACE_ADDRESS } from './contract';
import ProductForm from './components/ProductForm.jsx';
import TracePanel from './components/TracePanel.jsx';
import TraceViewer from './components/TraceViewer.jsx';
import { ProductsApi, OrdersApi } from './api/index.js';
import { useWeb3 } from './hooks/useWeb3.js';

const CONTRACT_ADDRESS = "0xe19db5a04f59da789cbfd1b81c0fe12135b21b49"; // your deployed contract
const ETH_AMOUNT = "0.008"; // ETH to send

// moved to hooks/useWeb3.js

const App = () => {
  const [products, setProducts] = useState([]);
  const { web3, account, isSepolia, connect } = useWeb3();
  const contract = useMemo(() => {
    if (!web3 || !MARKETPLACE_ADDRESS) return null;
    return new web3.eth.Contract(MARKETPLACE_ABI, MARKETPLACE_ADDRESS);
  }, [web3]);

  useEffect(() => {
    ProductsApi.list().then(setProducts).catch(() => setProducts([]));
  }, []);

  const handlePayment = async (product) => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask");
        return;
      }

      if (!account) await connect();
      const value = product?.priceWei ?? web3.utils.toWei(ETH_AMOUNT, "ether");

      // Check if the user is connected to the Sepolia test network
      if (!isSepolia) { // Sepolia test network ID
        alert("Please connect to the Sepolia test network");
        return;
      }

      let receipt;
      if (contract && product?.onchainProductId) {
        receipt = await contract.methods.buy(product.onchainProductId).send({ from: account, value });
      } else {
        const tx = {
          from: account,
          to: CONTRACT_ADDRESS,
          value,
          gas: 3000000,
        };
        receipt = await web3.eth.sendTransaction(tx);
      }

      // Check if the transaction was successful
      if (receipt.status) {
        console.log("✅ Payment successful, transaction receipt:", receipt);
        alert("✅ Payment successful");

        // ✅ CORRECT: Only save the order to the backend AFTER successful payment
        try {
          await OrdersApi.create({
            productTitle: product?.title ?? 'Sample Product',
            productId: product?._id ?? null,
            amountWei: value,
            buyerAddress: account,
            sellerAddress: product?.sellerAddress ?? CONTRACT_ADDRESS,
            transactionHash: receipt.transactionHash,
            onchainProductId: product?.onchainProductId ?? null,
            status: 'paid'
          });
        } catch (dbError) {
            console.error("Failed to save order to backend:", dbError);
            alert("⚠️ Your payment was successful, but there was an error saving your order. Please contact support.");
        }

      } else {
        console.error("❌ Payment failed: Transaction reverted", receipt);
        alert("❌ Payment failed: Transaction reverted");
      }
    } catch (error) {
      console.error("Payment failed:", error);
      // Avoid showing technical details to the user in a generic alert
      if (error.code === 4001) { // MetaMask user rejected the transaction
        alert("Payment cancelled.");
      } else {
        alert("❌ An error occurred during payment.");
      }
    }
  };

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>🛒 Marketplace</h1>
      <p>Network: {isSepolia ? 'Sepolia' : 'Connect to Sepolia'}</p>
      <p>Account: {account ?? 'Not connected'}</p>
      <ProductForm />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginTop: 24 }}>
        {products.map((p) => (
          <div key={p._id} style={{ border: '1px solid #eaeaea', borderRadius: 8, padding: 16, textAlign: 'left' }}>
            <h3 style={{ marginTop: 0 }}>{p.title}</h3>
            <p style={{ color: '#666' }}>{p.description}</p>
            <p style={{ fontWeight: 'bold' }}>Price: {web3 ? web3.utils.fromWei(p.priceWei, 'ether') : '0'} ETH</p>
            <p style={{ fontSize: 12, color: '#999' }}>Seller: {p.sellerAddress?.slice(0, 6)}...{p.sellerAddress?.slice(-4)}</p>
            <button
              onClick={() => handlePayment(p)}
              style={{ 
                fontSize: 16,
                padding: '10px 16px',
                cursor: 'pointer',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                width: '100%'
              }}
            >
              Buy
            </button>
          </div>
        ))}
      </div>
      <TracePanel />
      <TraceViewer />
    </div>
  );
};

export default App;