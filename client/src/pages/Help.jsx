import React from 'react';

export default function Help() {
  return (
    <div className="container" style={{ maxWidth: 820 }}>
      <div className="card" style={{ display: 'grid', gap: 8 }}>
        <h2 style={{ margin: 0 }}>Help</h2>
        <h3 style={{ margin: '8px 0 0' }}>How to log in</h3>
        <ol className="muted" style={{ margin: 0, paddingLeft: 18 }}>
          <li>Install MetaMask (or open it if installed).</li>
          <li>Connect your wallet in the browser.</li>
          <li>Switch network to Sepolia (chainId 11155111).</li>
          <li>Click Login and sign the message to authenticate.</li>
        </ol>
        <h3 style={{ margin: '8px 0 0' }}>Buying</h3>
        <p className="muted">Select an item in Marketplace and click Buy. Make sure your wallet is on Sepolia and has enough test ETH for price + gas.</p>
        <h3 style={{ margin: '8px 0 0' }}>Selling</h3>
        <p className="muted">Create products in Sell page. See and manage your items in My Items (list/unlist and set price).</p>
        <h3 style={{ margin: '8px 0 0' }}>Traceability</h3>
        <p className="muted">Use the Trace page to append lifecycle events and view an item’s owner history.</p>
      </div>
    </div>
  );
}


