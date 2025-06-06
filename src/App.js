import React, { useEffect, useState } from "react";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import LamininToken from "./abi/LamininTokenV3.json";

import WalletStatus from "./components/WalletStatus";
import TokenBalance from "./components/TokenBalance";
import TokenTransfer from "./components/TokenTransfer";
import TransferTokens from "./components/TransferTokens";
import MintTokens from "./components/MintTokens";
import PauseControls from "./components/PauseControls";

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      const signerInstance = await provider.getSigner();
      const userAddress = await signerInstance.getAddress();

      const tokenContract = new Contract(
        CONTRACT_ADDRESS,
        LamininToken,
        signerInstance
      );

      const rawBalance = await tokenContract.balanceOf(userAddress);
      const decimals = await tokenContract.decimals();
      const formatted = formatUnits(rawBalance, decimals);

      setWalletAddress(userAddress);
      setBalance(formatted);
      setSigner(signerInstance);
      setContract(tokenContract);

      console.log("✅ Wallet connected:", userAddress);
    } catch (err) {
      console.error("❌ Wallet connection failed:", err);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <div
      className="App"
      style={{
        backgroundImage: 'url("/laminin_logo.jpg")',
        backgroundSize: "85%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-start", // << LEFT SIDE DASHBOARD
        padding: "1.5rem",
        color: "#ffffff"
      }}
    >
      <div
        style={{
          width: "500px",
          padding: "1rem",
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          borderRadius: "12px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          overflowY: "auto",
          maxHeight: "95vh"
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "0.5rem", color: "#f9d342" }}>
          Laminin Dashboard
        </h2>

        <WalletStatus />
        <TokenBalance balance={balance} />
        <TokenTransfer contract={contract} signer={signer} />
        <TransferTokens contract={contract} signer={signer} />
        <MintTokens contract={contract} signer={signer} />
        <PauseControls contract={contract} signer={signer} />
      </div>
    </div>
  );
}

export default App;
