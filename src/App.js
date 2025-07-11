import React, { useEffect, useState } from "react";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import lamininTokenABI from "./abi/LamininTokenV3.json";
import WalletStatus from "./components/WalletStatus";
import TokenBalance from "./components/TokenBalance";
import TransferTokens from "./components/TransferTokens";
import MintTokens from "./components/MintTokens";
import PauseControls from "./components/PauseControls";
import { getLamininPrice } from "./utils/getLamininPrice";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Tokenomics from "./Tokenomics";

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [lamPrice, setLamPrice] = useState(null);
  const [isFallbackPrice, setIsFallbackPrice] = useState(false);

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
      console.error("⛔ Wallet connection failed:", err);
    });
  }, []);

  useEffect(() => {
    const fetchPrice = async () => {
      const price = await getLamininPrice();
      setLamPrice(price);
      setIsFallbackPrice(price.isFallback);
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 30000);
    return () => clearInterval(interval);
  }, []);

  const sharedBoxStyle = {
    width: "90%",
    maxWidth: "1000px",
    padding: "30px",
    marginTop: "40px",
    borderRadius: "16px",
    background: "rgba(0, 0, 0, 0.6)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6)",
    color: "#ffffff",
    fontSize: "20px",
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minHeight: "100vh",
                backgroundImage: "url('/laminin_logo.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                fontFamily: "Arial, sans-serif",
              }}
            >
              <div style={sharedBoxStyle}>
                <nav style={{ marginBottom: "20px" }}>
                  <Link to="/" style={{ marginRight: "20px", color: "#ffcc00", fontSize: "20px" }}>
                    Dashboard
                  </Link>
                  <Link to="/tokenomics" style={{ color: "#00ffff", fontSize: "20px" }}>
                    Tokenomics
                  </Link>
                </nav>
                <h2 style={{ textAlign: "center", color: "#ffcc00", fontSize: "28px" }}>Laminin Dashboard</h2>
                <div style={{ textAlign: "center", color: "#00ffff", fontSize: "22px" }}>
                  <h4>
                    $LAM Price:{" "}
                    {typeof lamPrice === "number" ? (
                      <span style={{ color: "blue", fontWeight: "bold", textShadow: "1px 1px 2px black" }}>${lamPrice.toFixed(6)} USD</span>
                    ) : (
                      "Loading..."
                    )}
                    {isFallbackPrice && (
                      <span style={{ color: "orange", marginLeft: "10px" }}>(fallback)</span>
                    )}
                  </h4>
                </div>
                <div style={{ marginTop: "20px" }}>
                  <a
                    href="https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xe005cb81af139d08861ed8ad80e4f87ebd144cb8"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-block",
                      color: "#ff007a",
                      border: "2px solid #ff007a",
                      borderRadius: "8px",
                      padding: "10px 20px",
                      textDecoration: "none",
                      fontWeight: "bold",
                    }}
                  >
                    Buy Laminin on Uniswap
                  </a>
                </div>

                <WalletStatus address={walletAddress} />
                <TokenBalance balance={balance} />
                <TransferTokens signer={signer} contract={contract} />
                <MintTokens signer={signer} contract={contract} />
                <PauseControls signer={signer} contract={contract} />
              </div>
            </div>
          }
        />
        <Route
          path="/tokenomics"
          element={
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minHeight: "100vh",
                backgroundImage: "url('/laminin_logo.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                fontFamily: "Arial, sans-serif",
              }}
            >
              <div style={sharedBoxStyle}>
                <Tokenomics />
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;