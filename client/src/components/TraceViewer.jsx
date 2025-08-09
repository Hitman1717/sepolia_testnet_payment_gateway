import React, { useMemo, useState } from 'react';
import Web3 from 'web3';
import { MARKETPLACE_ABI, MARKETPLACE_ADDRESS } from '../contract';

export default function TraceViewer() {
  const [productId, setProductId] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const web3 = useMemo(() => (window.ethereum ? new Web3(window.ethereum) : null), []);
  const contract = useMemo(() => {
    if (!web3 || !MARKETPLACE_ADDRESS) return null;
    return new web3.eth.Contract(MARKETPLACE_ABI, MARKETPLACE_ADDRESS);
  }, [web3]);

  const load = async (e) => {
    e.preventDefault();
    if (!contract) return alert('Deploy contract and set address first');
    setLoading(true);
    try {
      const fromBlock = 0; // or specify deployment block for efficiency
      const toBlock = 'latest';
      const logs = await contract.getPastEvents('TraceUpdated', {
        filter: { productId: [productId] },
        fromBlock,
        toBlock
      });
      setEvents(logs.map((l) => ({
        status: l.returnValues.status,
        dataURI: l.returnValues.dataURI,
        timestamp: Number(l.returnValues.timestamp) * 1000,
        txHash: l.transactionHash
      })));
    } catch (e) {
      console.error(e);
      alert('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 720 }}>
      <h2 className="title">Trace Viewer</h2>
      <form onSubmit={load} style={{ display: 'flex', gap: 8 }}>
        <input className="input" placeholder="On-chain productId" value={productId} onChange={(e) => setProductId(e.target.value)} required />
        <button className="btn" type="submit" disabled={loading}>{loading ? 'Loading...' : 'Load'}</button>
      </form>
      <div className="list" style={{ marginTop: 16 }}>
        {events.length === 0 && <p className="muted">No trace events.</p>}
        {events.map((ev, idx) => (
          <div key={idx} className="card">
            <div style={{ fontWeight: 'bold' }}>{ev.status}</div>
            {ev.dataURI && <div className="muted" style={{ fontSize: 12 }}>Data: {ev.dataURI}</div>}
            <div className="muted" style={{ fontSize: 12 }}>At: {new Date(ev.timestamp).toLocaleString()}</div>
            <div className="muted" style={{ fontSize: 12 }}>Tx: {ev.txHash}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


