// src/App.js

import React, { useEffect, useState } from "react";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import lamininTokenABI from "./abi/LamininTokenV3.json";
import WalletStatus from "./components/WalletStatus";
import TokenBalance from "./components/TokenBalance";
import TransferTokens from "./components/TransferTokens";
import MintTokens from "./components/MintTokens";
import PauseControls from "./components/PauseControls";
import { getLamininPrice } from "./utils/getLamininPrice"; // <-- NEW IMPORT

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [lamPrice, setLamPrice] = useState(null); // <-- NEW STATE
  const [isFallbackPrice, setIsFallbackPrice] = useState(false); // <-- NEW STATE

  useEffect(() => {
    const initialize = async () => {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      const signerInstance = await provider.getSigner();
      const userAddress = await signerInstance.getAddress();

      if (!CONTRACT_ADDRESS || !signerInstance) {
        console.error("Missing required contract config.");
        return;
      }

      const tokenContract = new Contract(CONTRACT_ADDRESS, lamininTokenABI, signerInstance);
      const rawBalance = await tokenContract.balanceOf(userAddress);
      const decimals = await tokenContract.decimals();
      const formatted = formatUnits(rawBalance, decimals);

      setWalletAddress(userAddress);
      setBalance(formatted);
      setSigner(signerInstance);
      setContract(tokenContract);

      console.log("✅ Wallet connected:", userAddress);
    };

    initialize().catch((err) => {
      console.error("❌ Wallet connection failed:", err);
    });
  }, []);

  // Fetch LAM price periodically
  useEffect(() => {
    const fetchPrice = async () => {
      const { price, isFallback } = await getLamininPrice();
      setLamPrice(price);
      setIsFallbackPrice(isFallback);
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "50%",
          padding: "2rem",
          color: "#00ffff",
          backgroundColor: "black",
        }}
      >
        <h1 style={{ textAlign: "center", color: "#ffcc00" }}>Laminin Dashboard</h1>
        <h2 style={{ color: "#00ffff" }}>
          LAM Price:{" "}
          {lamPrice == null ? "Loading..." : `$${lamPrice.toFixed(6)} USD`}
          {isFallbackPrice && (
            <span style={{ color: "orange", marginLeft: "10px" }}>(fallback)</span>
          )}
        </h2>

        <WalletStatus address={walletAddress} />

        <TokenBalance balance={balance} />

        <h3 style={{ marginTop: "2rem", color: "#00ffff" }}>Transfer Tokens</h3>
        <TransferTokens signer={signer} contract={contract} />

        <h3 style={{ marginTop: "2rem", color: "#00ffff" }}>Mint Tokens</h3>
        <MintTokens signer={signer} contract={contract} />

        <h3 style={{ marginTop: "2rem", color: "#00ffff" }}>Pause / Unpause Controls</h3>
        <PauseControls signer={signer} contract={contract} />
      </div>

      <div
        style={{
          width: "50%",
          backgroundImage: "url('/laminin_logo.jpg')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      />
    </div>
  );
}

export default App;
