import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: { display: true, text: 'Bitcoin Price Over Time' },
  },
  scales: {
    x: {
      ticks: {
        autoSkip: true,
        maxTicksLimit: 10,
      },
    },
    y: {
      title: {
        display: true,
        text: 'Price (USD)',
      },
    },
  },
};

const LineChart = ({ bitcoinData = [] }) => {
  // Avoid rendering if no data yet
  if (!bitcoinData || bitcoinData.length === 0) {
    return <p>No price data available.</p>;
  }

  // Convert timestamps to readable labels
  const labels = bitcoinData.map(entry => {
    const date = new Date(entry.timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  });

  const prices = bitcoinData.map(entry => entry.price);

  const data = {
    labels,
    datasets: [
      {
        label: 'Bitcoin Price (USD)',
        data: prices,
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.4,
        pointBackgroundColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto' }}>
      <h2>Bitcoin Price Line Chart</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
