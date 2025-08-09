import React from 'react';

export default function NavBar() {
  return (
    <div className="navbar">
      <div className="navbar-inner container">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 10, height: 10, borderRadius: 99, background: 'var(--accent)' }} />
          <strong>Web3 Market</strong>
        </div>
        <div className="spacer" />
        <div style={{ display: 'flex', gap: 16 }}>
          <a href="/marketplace">Marketplace</a>
          <a href="/sell">Sell</a>
          <a href="/my-items">My Items</a>
          <a href="/trace">Trace</a>
          <a href="/login" className="btn secondary" style={{ padding: '6px 10px' }}>Login</a>
        </div>
      </div>
    </div>
  );
}


