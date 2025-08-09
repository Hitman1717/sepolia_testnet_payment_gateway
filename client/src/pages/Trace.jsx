import React, { useEffect, useMemo, useState } from 'react';
// Update/append trace UI removed per request; keeping viewer-like features below.
import Web3 from 'web3';
import { MARKETPLACE_ABI, MARKETPLACE_ADDRESS, CONTRACT_VERSION } from '../contract';
import { ProductsApi } from '../api/index.js';

export default function Trace() {
  const [address, setAddress] = useState('');
  const [ownedIds, setOwnedIds] = useState([]);
  const [myOffchainItems, setMyOffchainItems] = useState([]);
  const [ownerHistory, setOwnerHistory] = useState({}); // productId -> owners[]
  const [expanded, setExpanded] = useState({}); // productId -> boolean
  const shorten = (addr) => (addr && addr.length > 12 ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : addr);
  const web3 = useMemo(() => (window.ethereum ? new Web3(window.ethereum) : null), []);
  const contract = useMemo(() => {
    if (!web3 || !MARKETPLACE_ADDRESS) return null;
    return new web3.eth.Contract(MARKETPLACE_ABI, MARKETPLACE_ADDRESS);
  }, [web3]);

  const loadOwned = async () => {
    try {
      if (CONTRACT_VERSION !== 'v2') return alert('On-chain owned items require v2 contract');
      if (!contract) return alert('Contract not set');
      const ids = await contract.methods.getProductsOwnedBy(address).call();
      setOwnedIds(ids);
    } catch (e) {
      alert('Failed to load owned items');
    }
  };

  useEffect(() => {
    const loadOffchain = async () => {
      try {
        if (!address) return setMyOffchainItems([]);
        const items = await ProductsApi.ownedBy(address);
        setMyOffchainItems(items);
        // fetch owners history for each
        const histories = {};
        await Promise.all(items.map(async (it) => {
          try {
            const data = await ProductsApi.ownersOf(it._id);
            histories[it._id] = data.owners || [];
          } catch (_) {}
        }));
        setOwnerHistory(histories);
      } catch (_) {
        setMyOffchainItems([]);
      }
    };
    loadOffchain();
  }, [address]);

  return (
    <div style={{ padding: 24 }}>
      {CONTRACT_VERSION === 'v2' && (
        <div className="container" style={{ maxWidth: 720 }}>
          <div className="card" style={{ display: 'grid', gap: 10 }}>
            <h3 style={{ margin: 0 }}>My Owned Items (on-chain)</h3>
            <input className="input" placeholder="Wallet address" value={address} onChange={(e) => setAddress(e.target.value)} />
            <button className="btn" onClick={loadOwned}>Load</button>
            {ownedIds && ownedIds.length > 0 && (
              <div className="list">
                {ownedIds.map((id) => (
                  <div key={id} className="card">Product ID: {id}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="container" style={{ maxWidth: 980 }}>
        <div className="card" style={{ display: 'grid', gap: 12 }}>
          <h3 style={{ margin: 0 }}>My Items (off-chain) with Owner History</h3>
          <input className="input" placeholder="Wallet address" value={address} onChange={(e) => setAddress(e.target.value)} />
          <div className="grid grid-cols-3">
            {myOffchainItems.map((it) => {
              const isOpen = !!expanded[it._id];
              return (
                <div key={it._id} className="card" style={{ display: 'grid', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{it.title}</div>
                      <div className="muted" style={{ fontSize: 12 }}>Created: {new Date(it.createdAt || it.created_at || Date.now()).toLocaleString()}</div>
                    </div>
                    <button className="btn secondary" onClick={() => setExpanded((s) => ({ ...s, [it._id]: !isOpen }))}>
                      {isOpen ? 'Hide history' : 'View history'}
                    </button>
                  </div>
                  {isOpen && (
                    <div>
                      <div className="muted">Previous Owners ({Math.max((ownerHistory[it._id] || []).length - 1, 0)}):</div>
                      <div className="list">
                        {(ownerHistory[it._id] || []).map((own, idx) => (
                          <div key={idx} className="card" style={{ padding: 8, overflow: 'hidden' }}>
                            <code title={own} style={{ fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                              {shorten(own)}
                            </code>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}


