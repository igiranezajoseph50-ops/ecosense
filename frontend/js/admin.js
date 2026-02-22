// ---- AUTH CHECK ----
const user = JSON.parse(localStorage.getItem('user'));
if (!user) window.location.href = '../pages/login.html';
document.getElementById('userName').textContent = user?.name || 'Admin';

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.clear();
  window.location.href = '../pages/login.html';
});

// ---- TABS ----
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
  });
});

// ---- LOAD BINS TABLE ----
const loadBins = async () => {
  const bins = await api.get('/bins');

  // Populate sensor bin dropdown
  const sensorBin = document.getElementById('sensorBin');
  sensorBin.innerHTML = '<option value="">-- Select Bin --</option>';
  bins.forEach(bin => {
    const opt = document.createElement('option');
    opt.value = bin._id;
    opt.textContent = `${bin.binId} - ${bin.location.name}`;
    sensorBin.appendChild(opt);
  });

  const tbody = document.getElementById('binsTable');
  if (bins.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="loading">No bins found.</td></tr>';
    return;
  }

  tbody.innerHTML = bins.map(bin => `
    <tr>
      <td style="color:var(--primary); font-weight:700">${bin.binId}</td>
      <td>${bin.location.name}</td>
      <td>${bin.fillLevel}%</td>
      <td><span class="bin-status ${bin.status}">${bin.status.toUpperCase()}</span></td>
      <td>
        <button class="delete-btn" onclick="deleteBin('${bin._id}')">🗑 Delete</button>
      </td>
    </tr>
  `).join('');
};

// ---- ADD BIN ----
document.getElementById('addBinBtn').addEventListener('click', async () => {
  const binId = document.getElementById('binId').value.trim();
  const name = document.getElementById('binLocationName').value.trim();
  const lat = parseFloat(document.getElementById('binLat').value);
  const lng = parseFloat(document.getElementById('binLng').value);
  const status = document.getElementById('binStatus').value;
  const msg = document.getElementById('binMsg');

  if (!binId || !name || !lat || !lng) {
    msg.textContent = 'Please fill all fields.';
    msg.className = 'form-msg error';
    return;
  }

  const res = await api.post('/bins', {
    binId, location: { name, lat, lng },
    fillLevel: 0, weight: 0, gasLevel: 0, status
  });

  if (res._id) {
    msg.textContent = 'Bin added successfully!';
    msg.className = 'form-msg';
    document.getElementById('binId').value = '';
    document.getElementById('binLocationName').value = '';
    document.getElementById('binLat').value = '';
    document.getElementById('binLng').value = '';
    loadBins();
  } else {
    msg.textContent = res.message || 'Failed to add bin.';
    msg.className = 'form-msg error';
  }

  setTimeout(() => { msg.textContent = ''; }, 3000);
});

// ---- DELETE BIN ----
const deleteBin = async (id) => {
  if (!confirm('Are you sure you want to delete this bin?')) return;
  await api.delete(`/bins/${id}`);
  loadBins();
};

// ---- LOAD USERS TABLE ----
const loadUsers = async () => {
  const users = await api.get('/auth/users').catch(() => []);
  const tbody = document.getElementById('usersTable');

  if (!users.length) {
    tbody.innerHTML = '<tr><td colspan="5" class="loading">No users found.</td></tr>';
    return;
  }

  tbody.innerHTML = users.map(u => `
    <tr>
      <td style="font-weight:700">${u.name}</td>
      <td style="color:var(--text-muted)">${u.email}</td>
      <td><span class="role-badge ${u.role}">${u.role.toUpperCase()}</span></td>
      <td style="color:var(--text-muted)">${new Date(u.createdAt).toLocaleDateString()}</td>
      <td>
        <button class="delete-btn" onclick="deleteUser('${u._id}')">🗑 Delete</button>
      </td>
    </tr>
  `).join('');
};

// ---- ADD USER ----
document.getElementById('addUserBtn').addEventListener('click', async () => {
  const name = document.getElementById('userName2').value.trim();
  const email = document.getElementById('userEmail').value.trim();
  const password = document.getElementById('userPassword').value.trim();
  const role = document.getElementById('userRole').value;
  const msg = document.getElementById('userMsg');

  if (!name || !email || !password) {
    msg.textContent = 'Please fill all fields.';
    msg.className = 'form-msg error';
    return;
  }

  const res = await api.post('/auth/register', { name, email, password, role });

  if (res._id) {
    msg.textContent = 'User added successfully!';
    msg.className = 'form-msg';
    document.getElementById('userName2').value = '';
    document.getElementById('userEmail').value = '';
    document.getElementById('userPassword').value = '';
    loadUsers();
  } else {
    msg.textContent = res.message || 'Failed to add user.';
    msg.className = 'form-msg error';
  }

  setTimeout(() => { msg.textContent = ''; }, 3000);
});

// ---- DELETE USER ----
const deleteUser = async (id) => {
  if (!confirm('Are you sure you want to delete this user?')) return;
  await api.delete(`/auth/users/${id}`);
  loadUsers();
};

// ---- ADD SENSOR DATA ----
document.getElementById('addSensorBtn').addEventListener('click', async () => {
  const bin = document.getElementById('sensorBin').value;
  const fillLevel = parseFloat(document.getElementById('sensorFill').value);
  const weight = parseFloat(document.getElementById('sensorWeight').value);
  const gasLevel = parseFloat(document.getElementById('sensorGas').value);
  const temperature = parseFloat(document.getElementById('sensorTemp').value);
  const msg = document.getElementById('sensorMsg');

  if (!bin || isNaN(fillLevel) || isNaN(weight) || isNaN(gasLevel)) {
    msg.textContent = 'Please fill all required fields.';
    msg.className = 'form-msg error';
    return;
  }

  const res = await api.post('/sensors', { bin, fillLevel, weight, gasLevel, temperature });

  if (res._id) {
    msg.textContent = 'Sensor data submitted successfully!';
    msg.className = 'form-msg';
    document.getElementById('sensorBin').value = '';
    document.getElementById('sensorFill').value = '';
    document.getElementById('sensorWeight').value = '';
    document.getElementById('sensorGas').value = '';
    document.getElementById('sensorTemp').value = '';
  } else {
    msg.textContent = res.message || 'Failed to submit sensor data.';
    msg.className = 'form-msg error';
  }

  setTimeout(() => { msg.textContent = ''; }, 3000);
});

loadBins();
loadUsers();