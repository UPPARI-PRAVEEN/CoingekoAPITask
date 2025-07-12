import React, { useEffect, useState } from "react";
import axios from "axios";
import LineChart from "./LineChart";
import Modal from "./Modal";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [coinHistory, setCoinHistory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(null);

  const fetchCoinData = async () => {
    try {
      const response = await axios("http://localhost:5000/api/coins");
      
      setData(response.data);
    } catch (error) {
      console.error("Error fetching coins:", error);
    }
  };

  const fetchCoinHistory = async (coinId) => {
    try {
      const response = await axios(`https://coingekoapitask-3.onrender.com/api/history/${coinId}`);
      setCoinHistory(response.data);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  useEffect(() => {
    fetchCoinData();
    const interval = setInterval(fetchCoinData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDetailsClick = (coin) => {
    setSelectedCoin(coin);
    fetchCoinHistory(coin.id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCoinHistory([]);
    setSelectedCoin(null);
  };

  const filteredData = data.filter((coin) =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Crypto Dashboard</h1>
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="🔍 Search for a coin..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={styles.searchInput}
        />
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
         <thead style={styles.thead}>
  <tr>
    <th style={styles.th}>Coin</th>
    <th style={styles.th}>Symbol</th>
    <th style={styles.th}>Price ($)</th>
    <th style={styles.th}>Market Cap</th>
    <th style={styles.th}>24h %</th>
    <th style={styles.th}>Last Updated</th>
    <th style={styles.th}>Action</th>
  </tr>
</thead>
<tbody>
  {filteredData
    .sort((a, b) => b?.price_change_24h - a?.price_change_24h)
    .map((coin) => (
      <tr key={coin.coinId}>
        <td style={styles.td}>{coin.name}</td>
        <td style={styles.td}>{coin.symbol.toUpperCase()}</td>
        <td style={styles.td}>${coin.price_change_24h?.toFixed(2)}</td>
        <td style={styles.td}>${coin.market_cap_change_24h?.toLocaleString()}</td>
        <td
          style={{
            ...styles.td,
            color: coin.market_cap_change_percentage_24h > 0 ? "#43a047" : "#e53935",
            fontWeight: "600",
          }}
        >
          {coin.market_cap_change_percentage_24h?.toFixed(2)}%
        </td>
        <td style={styles.td}>{new Date(coin.last_updated).toLocaleString()}</td>
        <td style={styles.td}>
          <button
            style={styles.detailsButton}
            onMouseOver={(e) => (e.target.style.backgroundColor = styles.detailsButtonHover.backgroundColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = styles.detailsButton.backgroundColor)}
            onClick={() => handleDetailsClick(coin)}
          >
            View Details
          </button>
        </td>
      </tr>
    ))}
</tbody>

        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2 style={styles.modalTitle}>
          {selectedCoin ? `${selectedCoin.name} Price History` : 'Price History'}
        </h2>
        <LineChart bitcoinData={coinHistory} />
      </Modal>
    </div>
  );
};

const styles = {
  page: {
    padding: "2rem",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    color: "#fff",
    minHeight: "100vh",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "700",
    marginBottom: "1.5rem",
    textAlign: "center",
    color: "#00e5ff",
  },
  searchContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "1.5rem",
  },
  searchInput: {
    width: "300px",
    padding: "10px 15px",
    borderRadius: "25px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    outline: "none",
  },
  tableContainer: {
    overflowX: "auto",
    borderRadius: "12px",
    background: "#1e293b",
    boxShadow: "0 0 15px rgba(0,0,0,0.4)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "900px",
  },
  thead: {
    background: "#0f172a",
  },
  th: {
    padding: "12px 16px",
    textAlign: "left",
    fontWeight: "600",
    fontSize: "1rem",
    color: "#38bdf8",
    borderBottom: "2px solid #334155",
  },
  td: {
    padding: "12px 16px",
    fontSize: "0.95rem",
    borderBottom: "1px solid #334155",
    color: "#e2e8f0",
  },
  detailsButton: {
    padding: "6px 12px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  detailsButtonHover: {
    backgroundColor: "#2563eb",
  },
  modalTitle: {
    marginBottom: "1rem",
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#facc15",
    textAlign: "center",
  },
};


export default Dashboard;
