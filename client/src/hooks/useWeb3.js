import { useEffect, useMemo, useState } from 'react';
import Web3 from 'web3';

export function useWeb3() {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const w3 = new Web3(window.ethereum);
      setWeb3(w3);
      window.ethereum.request({ method: 'eth_accounts' }).then((accounts) => {
        if (accounts && accounts.length > 0) setAccount(accounts[0]);
      });
      window.ethereum.request({ method: 'eth_chainId' }).then(setChainId);
      const onAccountsChanged = (accs) => setAccount(accs?.[0] ?? null);
      const onChainChanged = (id) => setChainId(id);
      window.ethereum.on('accountsChanged', onAccountsChanged);
      window.ethereum.on('chainChanged', onChainChanged);
      return () => {
        window.ethereum.removeListener('accountsChanged', onAccountsChanged);
        window.ethereum.removeListener('chainChanged', onChainChanged);
      };
    }
  }, []);

  const isSepolia = useMemo(() => {
    if (!chainId) return false;
    return chainId === '0xaa36a7' || chainId === 11155111n || chainId === 11155111;
  }, [chainId]);

  const connect = async () => {
    if (!window.ethereum) throw new Error('MetaMask required');
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0]);
  };

  return { web3, account, chainId, isSepolia, connect };
}


