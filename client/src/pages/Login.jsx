import React from 'react';
import { useAuth } from '../hooks/useAuth.js';

export default function Login() {
  const { login } = useAuth();
  const onLogin = async () => {
    try {
      await login();
      window.location.href = '/marketplace';
    } catch (e) {
      alert('Login failed');
    }
  };
  return (
    <div className="container" style={{ maxWidth: 520 }}>
      <h1 className="title">Welcome back</h1>
      <p className="subtitle">Authenticate with your wallet to continue.</p>
      <button className="btn" onClick={onLogin}>Sign In with MetaMask</button>
    </div>
  );
}


