import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import LamininToken from "../abi/LamininTokenV3.json";

const CONTRACT_ADDRESS =
  process.env.REACT_APP_NETWORK === "mainnet"
    ? process.env.REACT_APP_MAINNET_CONTRACT
    : process.env.REACT_APP_SEPOLIA_CONTRACT;

const TokenBalance = () => {
  const [balance, setBalance] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        if (!window.ethereum) {
          console.warn("MetaMask not detected");
          return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);

        const contract = new ethers.Contract(CONTRACT_ADDRESS, LamininToken.abi , provider);
        const balance = await contract.balanceOf(address);
        const decimals = await contract.decimals();
        const formatted = ethers.formatUnits(balance, decimals);

        setBalance(formatted);
      } catch (error) {
        console.error("Error fetching balance:", error);
        setBalance("Error");
      }
    };

    fetchBalance();
  }, []);

  return (
    <div className="balance-container" style={{ marginTop: "2rem" }}>
      <h3>Your Token Balance</h3>
      <p>
        {walletAddress
          ? balance !== null
            ? `${balance} LAM`
            : "Loading..."
          : "Connect wallet to view balance"}
      </p>
    </div>
  );
};

export default TokenBalance;
