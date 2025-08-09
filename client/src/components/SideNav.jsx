import React from 'react';

export default function SideNav() {
  return (
    <aside className="sidebar">
      <div className="container" style={{ padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ width: 10, height: 10, borderRadius: 99, background: 'var(--accent)' }} />
          <strong>Web3 Market</strong>
        </div>
        <nav className="list">
          <a href="/marketplace" className="btn secondary">Available for Sale</a>
          <a href="/my-items" className="btn secondary">My Items</a>
          <a href="/sell" className="btn secondary">Sell</a>
          <a href="/trace" className="btn secondary">Trace</a>
          <a href="/help" className="btn secondary">Help</a>
          <a href="/login" className="btn secondary">Login</a>
          <a href="/signup" className="btn secondary">Signup</a>
        </nav>
      </div>
    </aside>
  );
}


