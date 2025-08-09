// App.jsx (React frontend component)
import React from "react";
import Web3 from "web3";
import axios from "axios";

const CONTRACT_ADDRESS = "0xcbfbc9e2266e108ebfb423feed6e676684df4a63"; // your deployed contract
const ETH_AMOUNT = "0.008"; // ETH to send

const App = () => {
  const handlePayment = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask");
        return;
      }

      const web3 = new Web3(window.ethereum);

      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const accounts = await web3.eth.getAccounts();
      const userAddress = accounts[0];
      const value = web3.utils.toWei(ETH_AMOUNT, "ether");

      // Check if the user is connected to the Sepolia test network
      const networkId = await web3.eth.net.getId();
      console.log("Connected Network ID:", networkId);

      if (networkId !== 11155111n) { // Sepolia test network ID
        alert("Please connect to the Sepolia test network");
        return;
      }

      // Prepare the transaction details
      const tx = {
        from: userAddress,
        to: CONTRACT_ADDRESS,
        value,
        gas: 3000000, // Explicitly set high enough gas limit
      };

      // Send the transaction and wait for the receipt
      const receipt = await web3.eth.sendTransaction(tx);

      // Check if the transaction was successful
      if (receipt.status) {
        console.log("✅ Payment successful, transaction receipt:", receipt);
        alert("✅ Payment successful");

        // ✅ CORRECT: Only save the order to the backend AFTER successful payment
        try {
          await axios.post("http://localhost:5000/api/orders", {
            product: "Sample Product",
            amount: ETH_AMOUNT,
            userAddress,
            transactionHash: receipt.transactionHash // Good practice to save the hash
          });
          console.log("Order saved to backend.");
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
      <h1>🛒 E-commerce Payment Gateway</h1>
      <p>Send {ETH_AMOUNT} ETH via MetaMask</p>
      <button 
        onClick={handlePayment} 
        style={{ 
          fontSize: 18, 
          padding: '12px 24px', 
          cursor: 'pointer', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '8px' 
        }}
      >
        Pay with MetaMask
      </button>
    </div>
  );
};

export default App;