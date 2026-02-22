// ---- AUTH CHECK ----
const user = JSON.parse(localStorage.getItem('user'));
if (!user) window.location.href = '../pages/login.html';
document.getElementById('userName').textContent = user?.name || 'Admin';

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.clear();
  window.location.href = '../pages/login.html';
});

// ---- CHART DEFAULTS ----
Chart.defaults.color = '#7a8a9a';
Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';

// ---- LOAD DATA ----
const loadAnalytics = async () => {
  const [bins, sensors] = await Promise.all([
    api.get('/bins'),
    api.get('/sensors')
  ]);

  // Summary cards
  document.getElementById('totalLogs').textContent = sensors.length;
  const avgFill = bins.length
    ? Math.round(bins.reduce((s, b) => s + b.fillLevel, 0) / bins.length)
    : 0;
  document.getElementById('avgFill').textContent = `${avgFill}%`;
  document.getElementById('gasAlerts').textContent =
    sensors.filter(s => s.gasLevel > 50).length;
  document.getElementById('criticalEvents').textContent =
    bins.filter(b => b.status === 'red').length;

  // Fill level chart
  new Chart(document.getElementById('fillChart'), {
    type: 'bar',
    data: {
      labels: bins.map(b => b.binId),
      datasets: [{
        label: 'Fill Level %',
        data: bins.map(b => b.fillLevel),
        backgroundColor: bins.map(b =>
          b.status === 'green' ? 'rgba(0,255,136,0.6)' :
          b.status === 'yellow' ? 'rgba(255,200,0,0.6)' :
          'rgba(255,50,50,0.6)'
        ),
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { max: 100, grid: { color: 'rgba(255,255,255,0.05)' } },
        x: { grid: { display: false } }
      }
    }
  });

  // Status distribution chart
  const green = bins.filter(b => b.status === 'green').length;
  const yellow = bins.filter(b => b.status === 'yellow').length;
  const red = bins.filter(b => b.status === 'red').length;

  new Chart(document.getElementById('statusChart'), {
    type: 'doughnut',
    data: {
      labels: ['Green', 'Yellow', 'Red'],
      datasets: [{
        data: [green, yellow, red],
        backgroundColor: [
          'rgba(0,255,136,0.7)',
          'rgba(255,200,0,0.7)',
          'rgba(255,50,50,0.7)'
        ],
        borderWidth: 0,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      cutout: '70%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { padding: 20, usePointStyle: true }
        }
      }
    }
  });

  // Sensor table
  const tbody = document.getElementById('sensorTable');
  if (sensors.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="loading">No sensor data found.</td></tr>';
    return;
  }

  tbody.innerHTML = sensors.slice(0, 20).map(s => `
    <tr>
      <td>${s.bin?.binId || 'N/A'}</td>
      <td>${s.fillLevel}%</td>
      <td>${s.weight} kg</td>
      <td>${s.gasLevel}</td>
      <td>${s.temperature}°C</td>
      <td>${new Date(s.recordedAt).toLocaleString()}</td>
    </tr>
  `).join('');
};

loadAnalytics();