import React from 'react';
import './Tokenomics.css'; // Optional: You can create a CSS file to style it more

const Tokenomics = () => {
  const tokenData = [
    { name: 'Public Sale', percent: '45%', description: 'Liquidity pool, dashboard sales' },
    { name: 'Development Reserve', percent: '20%', description: 'Future builds: NFTs, PhantomLang, SolaceOS' },
    { name: 'Marketing & Airdrops', percent: '10%', description: 'Community growth and outreach' },
    { name: 'Team & Founders', percent: '10%', description: 'Vested long-term' },
    { name: 'Partnerships', percent: '10%', description: 'Exchanges, collaborations' },
    { name: 'DAO Treasury', percent: '5%', description: 'Governance or emergency fund' },
  ];

  return (
    <div className="tokenomics-container" style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Laminin Tokenomics</h1>

      <img 
        src="/tokenomics/chart.png" 
        alt="Tokenomics Chart" 
        style={{ width: '100%', maxWidth: '600px', display: 'block', margin: '0 auto 40px auto' }}
      />

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4' }}>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Allocation</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Percentage</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Description</th>
          </tr>
        </thead>
        <tbody>
          {tokenData.map((item, idx) => (
            <tr key={idx}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.name}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.percent}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.description}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '40px' }}>
        <h3>Key Details</h3>
        <ul>
          <li><strong>Total Supply:</strong> 100,000,000 LAM</li>
          <li><strong>Decimals:</strong> 18</li>
          <li><strong>Network:</strong> Ethereum Mainnet</li>
          <li><strong>Starting Price:</strong> $0.05 per LAM</li>
          <li><strong>Smart Contract:</strong> [Paste your contract address]</li>
        </ul>
      </div>
    </div>
  );
};

export default Tokenomics;