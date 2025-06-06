import React, { useState } from "react";
import { ethers, Contract } from "ethers";
import LamininToken from "../abi/LamininTokenV3.json";

const CONTRACT_ADDRESS =
  process.env.REACT_APP_NETWORK === "mainnet"
    ? process.env.REACT_APP_MAINNET_CONTRACT
    : process.env.REACT_APP_SEPOLIA_CONTRACT;

const MintTokens = () => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  const handleMint = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask is required to mint tokens.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tokenContract = new Contract(CONTRACT_ADDRESS, LamininToken.abi, signer);

      const decimals = await tokenContract.decimals();
      const parsedAmount = ethers.parseUnits(amount, decimals);

      const tx = await tokenContract.mint(recipient, parsedAmount);
      setStatus("Transaction sent. Waiting for confirmation...");
      await tx.wait();

      setStatus(`Successfully minted ${amount} tokens to ${recipient}`);
    } catch (error) {
      console.error("Minting failed:", error);
      setStatus("Minting failed. See console for details.");
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>Mint Tokens</h3>
      <input
        type="text"
        placeholder="Recipient Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        style={{ marginRight: "1rem" }}
      />
      <input
        type="text"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ marginRight: "1rem" }}
      />
      <button onClick={handleMint}>Mint</button>
      <p>{status}</p>
    </div>
  );
};

export default MintTokens;
