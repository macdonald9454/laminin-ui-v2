import React from "react";
import { ethers } from "ethers";
import LamininToken from "../abi/LamininTokenV3.json";

const CONTRACT_ADDRESS =
  process.env.REACT_APP_NETWORK === "mainnet"
    ? process.env.REACT_APP_MAINNET_CONTRACT
    : process.env.REACT_APP_SEPOLIA_CONTRACT;

const PauseControls = () => {
  const pauseContract = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, LamininToken.abi, signer);

      const tx = await contract.pause();
      await tx.wait();
      alert("Contract paused successfully.");
    } catch (error) {
      console.error("Pause failed:", error);
      alert("Pause failed. Check console for details.");
    }
  };

  const unpauseContract = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, LamininToken.abi, signer);

      const tx = await contract.unpause();
      await tx.wait();
      alert("Contract unpaused successfully.");
    } catch (error) {
      console.error("Unpause failed:", error);
      alert("Unpause failed. Check console for details.");
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>Pause / Unpause Controls</h3>
      <button onClick={pauseContract} style={{ marginRight: "1rem" }}>Pause</button>
      <button onClick={unpauseContract}>Unpause</button>
    </div>
  );
};

export default PauseControls;
