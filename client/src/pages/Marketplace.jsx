import React, { useEffect, useMemo, useState } from 'react';
import { useWeb3 } from '../hooks/useWeb3.js';
import { ProductsApi, OrdersApi } from '../api/index.js';
import { MARKETPLACE_ABI, MARKETPLACE_ADDRESS } from '../contract';
import AuthInstructions from '../components/AuthInstructions.jsx';

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const { web3, account, isSepolia, connect } = useWeb3();
  const contract = useMemo(() => {
    if (!web3 || !MARKETPLACE_ADDRESS) return null;
    return new web3.eth.Contract(MARKETPLACE_ABI, MARKETPLACE_ADDRESS);
  }, [web3]);

  useEffect(() => {
    const fetchProducts = () => ProductsApi.list().then((items) => {
      // Show only active listings in marketplace
      setProducts((items || []).filter((p) => p.active === true));
    }).catch(() => setProducts([]));
    fetchProducts();
    const onChanged = () => fetchProducts();
    window.addEventListener('products:changed', onChanged);
    return () => window.removeEventListener('products:changed', onChanged);
  }, []);

  const handleBuy = async (product) => {
    try {
      if (!window.ethereum) return alert('Please install MetaMask');
      if (!account) await connect();
      if (!isSepolia) return alert('Please connect to the Sepolia test network');
      if (!contract || !product?.onchainProductId) return alert('This product is not on-chain yet');
      const value = product.priceWei;
      const receipt = await contract.methods.buy(product.onchainProductId).send({ from: account, value });
      if (receipt.status) {
        await OrdersApi.create({
          productTitle: product.title,
          productId: product._id,
          amountWei: value,
          buyerAddress: account,
          sellerAddress: product.sellerAddress,
          transactionHash: receipt.transactionHash,
          onchainProductId: product.onchainProductId,
          status: 'paid'
        });
        // Inform UI to refresh product availability (off-chain state)
        window.dispatchEvent(new CustomEvent('products:changed'));
        // Optimistically remove purchased item from current list
        setProducts((prev) => prev.filter((p) => p._id !== product._id));
        alert('Payment successful');
      }
    } catch (e) {
      console.error(e);
      alert('Purchase failed');
    }
  };

  return (
    <div className="container">
      <h2 className="title">Marketplace</h2>
      <p className="subtitle">Account: {account ?? 'Not connected'} · Network: {isSepolia ? 'Sepolia' : 'Not Sepolia'}</p>
      <AuthInstructions />
      <div className="grid grid-cols-3">
        {products.map((p) => (
          <div key={p._id} className="card">
            <h3 style={{ margin: 0 }}>{p.title}</h3>
            <p className="muted">{p.description}</p>
            <p style={{ fontWeight: 'bold' }}>Price: {web3 ? web3.utils.fromWei(p.priceWei, 'ether') : '0'} ETH</p>
            <button className="btn" onClick={() => handleBuy(p)}>Buy</button>
          </div>
        ))}
      </div>
    </div>
  );
}


