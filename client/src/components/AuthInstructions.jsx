import React from 'react';
import { useAuth } from '../hooks/useAuth.js';

export default function AuthInstructions() {
  const { token } = useAuth();
  if (token) return null;
  return (
    <div className="container" style={{ maxWidth: 820 }}>
      <div className="card" style={{ display: 'grid', gap: 8 }}>
        <h3 style={{ margin: 0 }}>How to log in</h3>
        <ol className="muted" style={{ margin: 0, paddingLeft: 18 }}>
          <li>Install MetaMask (or open it if installed).</li>
          <li>Connect your wallet in the browser.</li>
          <li>Switch network to Sepolia (chainId 11155111).</li>
          <li>Click Login and sign the message to authenticate.</li>
        </ol>
        <div>
          <a className="btn" href="/login">Go to Login</a>
        </div>
      </div>
    </div>
  );
}


