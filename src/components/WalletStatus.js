import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

const WalletStatus = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [networkName, setNetworkName] = useState("");
  const [connected, setConnected] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

      const network = await provider.getNetwork();
      setWalletAddress(accounts[0]);
      setNetworkName(network.name);
      setConnected(true);
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  };

  useEffect(() => {
    if (!window.ethereum) return;

    const provider = new ethers.BrowserProvider(window.ethereum);

    const handleAccountsChanged = async (accounts) => {
      if (accounts.length > 0) {
        const network = await provider.getNetwork();
        setWalletAddress(accounts[0]);
        setNetworkName(network.name);
        setConnected(true);
      } else {
        setWalletAddress("");
        setConnected(false);
      }
    };

    const handleChainChanged = () => {
      window.location.reload(); // Reload to refresh context if network changes
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>Wallet Status</h3>
      {connected ? (
        <>
          <p><strong>Connected Wallet:</strong> {walletAddress}</p>
          <p><strong>Network:</strong> {networkName}</p>
        </>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
};

export default WalletStatus;
