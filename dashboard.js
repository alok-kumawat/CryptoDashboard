const overviewDiv = document.getElementById('overview-data');
const cardsContainer = document.getElementById('crypto-cards');
const tableBody = document.getElementById('crypto-table-body');
const coinSelect = document.getElementById('coin-select');
const ctx = document.getElementById('priceChart').getContext('2d');

let chart;

// Fetch market overview
async function loadOverview() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/global');
    if (!res.ok) throw new Error('Failed to fetch overview data');
    const data = await res.json();

    const marketCap = data.data.total_market_cap.usd.toLocaleString();
    const volume = data.data.total_volume.usd.toLocaleString();

    overviewDiv.innerHTML = `
      <p>Total Market Cap: $${marketCap}</p>
      <p>24h Volume: $${volume}</p>
    `;
  } catch (error) {
    console.error('Overview Error:', error);
    overviewDiv.innerHTML = `<p style="color:red;">Error loading market overview.</p>`;
  }
}

// Load coins and update UI
async function loadCoins() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1');
    if (!res.ok) throw new Error('Failed to fetch coin data');
    const coins = await res.json();

    // Clear containers
    cardsContainer.innerHTML = '';
    tableBody.innerHTML = '';
    coinSelect.innerHTML = '';

    // Populate UI with data
    coins.forEach(coin => {
      // Card
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h3>${coin.name}</h3>
        <p>Price: $${coin.current_price}</p>
        <p>Change: ${coin.price_change_percentage_24h.toFixed(2)}%</p>
      `;
      cardsContainer.appendChild(card);

      // Table
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${coin.name}</td>
        <td>$${coin.current_price}</td>
        <td>$${coin.market_cap.toLocaleString()}</td>
        <td>${coin.price_change_percentage_24h.toFixed(2)}%</td>
      `;
      tableBody.appendChild(row);

      // Dropdown
      const option = document.createElement('option');
      option.value = coin.id;
      option.textContent = coin.name;
      coinSelect.appendChild(option);
    });

    // Load chart for first coin
    drawChart(coinSelect.value);
  } catch (error) {
    console.error('Coins Error:', error);
    cardsContainer.innerHTML = `<p style="color:red;">Unable to load cryptocurrencies.</p>`;
    tableBody.innerHTML = '';
    coinSelect.innerHTML = '';
  }
}

// Draw chart for selected coin
// async function drawChart(coinId) {
//     try {
//       // Fetch chart data from CoinGecko API
//       const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=1&interval=hourly`);
//       if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
  
//       const data = await res.json();
//       console.log('Chart API response:', data); // Debug: log raw data
  
//       // Validate price data
//       if (!data.prices || data.prices.length === 0) {
//         throw new Error('No price data returned from API.');
//       }
  
//       // Process data
//       const labels = data.prices.map(entry => new Date(entry[0]).toLocaleTimeString());
//       const prices = data.prices.map(entry => entry[1]);
  
//       // Destroy existing chart if any
//       if (chart) chart.destroy();
  
//       // Create a new chart
//       chart = new Chart(ctx, {
//         type: 'line',
//         data: {
//           labels,
//           datasets: [{
//             label: `${coinId} Price (USD)`,
//             data: prices,
//             borderColor: '#007bff',
//             backgroundColor: 'rgba(0, 123, 255, 0.1)',
//             fill: true,
//             tension: 0.2
//           }]
//         },
//         options: {
//           responsive: true,
//           animation: false,
//           plugins: {
//             legend: {
//               display: true,
//               labels: {
//                 color: '#000'
//               }
//             }
//           },
//           scales: {
//             y: {
//               beginAtZero: false,
//               ticks: {
//                 color: '#000'
//               }
//             },
//             x: {
//               ticks: {
//                 color: '#000'
//               }
//             }
//           }
//         }
//       });
//     } catch (error) {
//       console.error('Chart Error:', error);
  
//       // Destroy existing chart if there's an error
//       if (chart) chart.destroy();
  
//       // Display error in the chart section
//       const chartContainer = document.getElementById('chart-section');
//       chartContainer.innerHTML += `<p style="color:red;">Unable to load chart data for ${coinId}. Error: ${error.message}</p>`;
//     }
//   }
async function drawChart(coinId) {
    try {
      const res = await fetch('./chart-data.json'); // Use local file
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
  
      const data = await res.json();
  
      const labels = data.prices.map(p => new Date(p[0]).toLocaleTimeString());
      const prices = data.prices.map(p => p[1]);
  
      if (chart) chart.destroy();
  
      chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: `${coinId} Price (USD)`,
            data: prices,
            borderColor: '#007bff',
            fill: false,
            tension: 0.2
          }]
        },
        options: {
          responsive: true,
          animation: false,
          scales: {
            y: {
              beginAtZero: false
            }
          }
        }
      });
    } catch (error) {
      console.error('Chart Error:', error);
      const chartContainer = document.getElementById('chart-section');
      chartContainer.innerHTML += `<p style="color:red;">Unable to load local chart data.</p>`;
    }
  }
  
  

// Event listener for dropdown change
coinSelect.addEventListener('change', () => drawChart(coinSelect.value));

// Initial load
loadOverview();
loadCoins();

// Auto-refresh every 60 seconds
setInterval(() => {
  loadOverview();
  loadCoins();
}, 60000);
