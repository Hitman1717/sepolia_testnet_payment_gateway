import React, { useMemo, useState } from 'react';
import Web3 from 'web3';
import { ProductsApi } from '../api';
import { MARKETPLACE_ABI, MARKETPLACE_ADDRESS } from '../contract';

export default function ProductForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priceEth, setPriceEth] = useState('0.01');
  const [isDigital, setIsDigital] = useState(false);
  const [metadataURI, setMetadataURI] = useState('');
  const [sellerAddress, setSellerAddress] = useState('');
  const [saving, setSaving] = useState(false);

  const web3 = useMemo(() => (window.ethereum ? new Web3(window.ethereum) : null), []);
  const contract = useMemo(() => {
    if (!web3 || !MARKETPLACE_ADDRESS) return null;
    return new web3.eth.Contract(MARKETPLACE_ABI, MARKETPLACE_ADDRESS);
  }, [web3]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let onchainProductId = null;
      let effectiveSeller = sellerAddress;
      const toWeiString = (ethStr) => {
        if (web3) return web3.utils.toWei(String(ethStr), 'ether');
        const [intPart, fracRaw = ''] = String(ethStr).split('.');
        const frac = (fracRaw + '0'.repeat(18)).slice(0, 18);
        const weiStr = (BigInt(intPart || '0') * 10n ** 18n + BigInt(frac || '0')).toString();
        return weiStr;
      };
      const priceWei = toWeiString(priceEth);
      // Try to resolve seller from wallet regardless of contract
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          if (accounts && accounts[0]) effectiveSeller = accounts[0];
        } catch (_) {}
      }

      // If contract is available, try on-chain creation, but don't fail the whole flow if user rejects
      if (contract && effectiveSeller) {
        try {
          const result = await contract.methods
            .createProduct(title, priceWei, isDigital, metadataURI)
            .send({ from: effectiveSeller });
          const event = result?.events?.ProductCreated;
          if (event && event.returnValues && event.returnValues.productId) {
            onchainProductId = String(event.returnValues.productId);
          }
        } catch (err) {
          // user rejected or tx failed; continue with off-chain save
        }
      }

      if (!effectiveSeller) {
        alert('Please connect your wallet or enter a seller address.');
        return;
      }
      const created = await ProductsApi.create({
        title,
        description,
        priceWei,
        isDigital,
        sellerAddress: effectiveSeller,
        metadataURI,
        onchainProductId
      });
      if (created && created._id) alert('Product created');
      // notify marketplace to refetch
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('products:changed'));
      }
      setTitle('');
      setDescription('');
      setPriceEth('0.01');
      setIsDigital(false);
      setMetadataURI('');
    } catch (e) {
      console.error(e);
      alert('Failed to create product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="container" style={{ maxWidth: 640 }}>
      <h2 className="title">Create Product</h2>
      <div className="card" style={{ display: 'grid', gap: 12 }}>
        <input className="input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea className="textarea" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input className="input" placeholder="Price (ETH)" value={priceEth} onChange={(e) => setPriceEth(e.target.value)} />
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" checked={isDigital} onChange={(e) => setIsDigital(e.target.checked)} />
          Digital Item
        </label>
        <input className="input" placeholder="Metadata URI (optional)" value={metadataURI} onChange={(e) => setMetadataURI(e.target.value)} />
        {!MARKETPLACE_ADDRESS && (
          <input className="input" placeholder="Seller Address (when no contract)" value={sellerAddress} onChange={(e) => setSellerAddress(e.target.value)} />
        )}
        <button className="btn" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Create'}</button>
      </div>
    </form>
  );
}


