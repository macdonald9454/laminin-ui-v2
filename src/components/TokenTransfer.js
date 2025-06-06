import React, { useState } from "react";
import { ethers } from "ethers";
import LamininToken from "../abi/LamininTokenV3.json";

const CONTRACT_ADDRESS =
  process.env.REACT_APP_NETWORK === "mainnet"
    ? process.env.REACT_APP_MAINNET_CONTRACT
    : process.env.REACT_APP_SEPOLIA_CONTRACT;

const TokenTransfer = () => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  const handleTransfer = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask is required to send tokens.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, LamininToken.abi, signer);

      const decimals = await contract.decimals();
      const parsedAmount = ethers.parseUnits(amount, decimals);

      const tx = await contract.transfer(recipient, parsedAmount);
      setStatus("Transaction sent. Waiting for confirmation...");
      await tx.wait();

      setStatus(`Transfer successful: ${amount} tokens sent to ${recipient}`);
    } catch (error) {
      console.error("Transfer failed:", error);
      setStatus("Transfer failed. See console for details.");
    }
  };

  return (
    <div className="transfer-box" style={{ marginTop: "2rem" }}>
      <h3>Transfer Tokens</h3>
      <input
        type="text"
        placeholder="Recipient address"
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
      <button onClick={handleTransfer}>Transfer</button>
      <p>{status}</p>
    </div>
  );
};

export default TokenTransfer;