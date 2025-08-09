import React, { useEffect, useMemo, useState } from 'react';
import { useWeb3 } from '../hooks/useWeb3.js';
import { ProductsApi } from '../api/index.js';
import { MARKETPLACE_ABI, MARKETPLACE_ADDRESS, CONTRACT_VERSION } from '../contract';

export default function MyItems() {
  const { account, web3, connect } = useWeb3();
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState({}); // productId -> { priceEth, active }
  const [loading, setLoading] = useState(false);
  const [ownerAddress, setOwnerAddress] = useState('');

  const contract = useMemo(() => {
    if (!web3 || !MARKETPLACE_ADDRESS) return null;
    return new web3.eth.Contract(MARKETPLACE_ABI, MARKETPLACE_ADDRESS);
  }, [web3]);

  const fetchItems = async () => {
    const owner = (account || ownerAddress || '').trim();
    if (!owner) return setItems([]);
    try {
      const data = await ProductsApi.ownedBy(owner);
      setItems(data);
    } catch (_) {
      setItems([]);
    }
  };

  useEffect(() => { fetchItems(); }, [account]);
  useEffect(() => {
    const onChanged = () => fetchItems();
    window.addEventListener('products:changed', onChanged);
    return () => window.removeEventListener('products:changed', onChanged);
  }, [account, ownerAddress]);

  const setEdit = (id, patch) => setEditing((s) => ({ ...s, [id]: { ...s[id], ...patch } }));

  const onList = async (p) => {
    try {
      setLoading(true);
      const priceEth = editing[p._id]?.priceEth ?? (web3 ? web3.utils.fromWei(p.priceWei, 'ether') : '0.01');
      const priceWei = web3 ? web3.utils.toWei(String(priceEth), 'ether') : p.priceWei;
      // Prefer on-chain listing when available and contract is v2
      if (CONTRACT_VERSION === 'v2' && contract && p.onchainProductId) {
        await contract.methods.listForSale(p.onchainProductId, priceWei).send({ from: account });
      }
      // Reflect in backend
      await ProductsApi.update(p._id, { priceWei, active: true });
      await fetchItems();
      alert('Listed for sale');
    } catch (e) {
      alert('Failed to list');
    } finally {
      setLoading(false);
    }
  };

  const onUnlist = async (p) => {
    try {
      setLoading(true);
      if (CONTRACT_VERSION === 'v2' && contract && p.onchainProductId) {
        await contract.methods.unlist(p.onchainProductId).send({ from: account });
      }
      await ProductsApi.update(p._id, { active: false });
      await fetchItems();
      alert('Unlisted');
    } catch (e) {
      alert('Failed to unlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="title">My Items</h2>
      <p className="subtitle">Wallet: {account ?? 'Not connected'}</p>
      {!account && (
        <div className="card" style={{ display: 'grid', gap: 10, marginBottom: 16 }}>
          <div className="muted">Connect your wallet or enter an address to load items owned by that address.</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn" onClick={connect}>Connect Wallet</button>
            <input className="input" placeholder="Owner address" value={ownerAddress} onChange={(e) => setOwnerAddress(e.target.value)} />
            <button className="btn" onClick={fetchItems}>Load</button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-3">
        {items.map((p) => (
          <div key={p._id} className="card" style={{ display: 'grid', gap: 10 }}>
            <h3 style={{ margin: 0 }}>{p.title}</h3>
            <div className="muted">Current status: {p.active ? 'For sale' : 'Not for sale'}</div>
            <div className="muted">Price: {web3 ? web3.utils.fromWei(p.priceWei, 'ether') : '0'} ETH</div>
            <input
              className="input"
              placeholder="Price (ETH)"
              value={editing[p._id]?.priceEth ?? ''}
              onChange={(e) => setEdit(p._id, { priceEth: e.target.value })}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn" disabled={loading} onClick={() => onList(p)}>List</button>
              <button className="btn secondary" disabled={loading} onClick={() => onUnlist(p)}>Unlist</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


