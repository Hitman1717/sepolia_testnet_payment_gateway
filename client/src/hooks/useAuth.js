import { useCallback, useEffect, useState } from 'react';
import Web3 from 'web3';
import { api } from '../api/index.js';

export function useAuth() {
  const [address, setAddress] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  const login = useCallback(async () => {
    if (!window.ethereum) throw new Error('MetaMask required');
    const web3 = new Web3(window.ethereum);
    const [acct] = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const lower = acct.toLowerCase();
    const { data } = await api.get(`/auth/nonce`, { params: { address: lower } });
    const message = `Sign this nonce to authenticate: ${data.nonce}`;
    const signature = await web3.eth.personal.sign(message, acct, '');
    const verify = await api.post('/auth/verify', { address: lower, signature });
    setAddress(lower);
    setToken(verify.data.token);
    return lower;
  }, []);

  const logout = useCallback(() => {
    setAddress(null);
    setToken(null);
  }, []);

  return { address, token, login, logout };
}


