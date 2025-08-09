import React from 'react';
import { useAuth } from '../hooks/useAuth.js';

export default function Signup() {
  const { login } = useAuth();
  const onSignup = async () => {
    try {
      await login();
      window.location.href = '/marketplace';
    } catch (e) {
      alert('Signup failed');
    }
  };
  return (
    <div className="container" style={{ maxWidth: 520 }}>
      <h1 className="title">Create your account</h1>
      <p className="subtitle">Your wallet is your identity. First sign-in creates your account.</p>
      <button className="btn" onClick={onSignup}>Sign Up with MetaMask</button>
    </div>
  );
}


