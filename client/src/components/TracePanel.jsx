import React, { useMemo, useState } from 'react';
import Web3 from 'web3';
import { MARKETPLACE_ABI, MARKETPLACE_ADDRESS } from '../contract';

export default function TracePanel() {
  const [productId, setProductId] = useState('');
  const [status, setStatus] = useState('manufactured');
  const [dataURI, setDataURI] = useState('');
  const [txHash, setTxHash] = useState('');
  const web3 = useMemo(() => (window.ethereum ? new Web3(window.ethereum) : null), []);
  const contract = useMemo(() => {
    if (!web3 || !MARKETPLACE_ADDRESS) return null;
    return new web3.eth.Contract(MARKETPLACE_ABI, MARKETPLACE_ADDRESS);
  }, [web3]);

  const submit = async (e) => {
    e.preventDefault();
    if (!contract) return alert('Deploy contract and set address first');
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const from = accounts[0];
    const receipt = await contract.methods.trace(productId, status, dataURI).send({ from });
    setTxHash(receipt?.transactionHash || '');
  };

  return (
    <form onSubmit={submit} className="container" style={{ maxWidth: 640 }}>
      <h2 className="title">Update Trace</h2>
      <div className="card" style={{ display: 'grid', gap: 12 }}>
        <input className="input" placeholder="On-chain productId" value={productId} onChange={(e) => setProductId(e.target.value)} required />
        <input className="input" placeholder="Status (e.g., shipped)" value={status} onChange={(e) => setStatus(e.target.value)} required />
        <input className="input" placeholder="Data URI (optional)" value={dataURI} onChange={(e) => setDataURI(e.target.value)} />
        <button className="btn" type="submit">Append Trace</button>
        {txHash && <p className="muted" style={{ fontSize: 12 }}>Tx: {txHash}</p>}
      </div>
    </form>
  );
}


