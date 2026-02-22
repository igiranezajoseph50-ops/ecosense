// ---- AUTH CHECK ----
const user = JSON.parse(localStorage.getItem('user'));
if (!user) window.location.href = '../pages/login.html';
document.getElementById('userName').textContent = user?.name || 'Admin';

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.clear();
  window.location.href = '../pages/login.html';
});

let allSchedules = [];

// ---- LOAD DROPDOWNS ----
const loadDropdowns = async () => {
  const [bins, users] = await Promise.all([
    api.get('/bins'),
    api.get('/auth/users').catch(() => [])
  ]);

  const binSelect = document.getElementById('selectBin');
  bins.forEach(bin => {
    const opt = document.createElement('option');
    opt.value = bin._id;
    opt.textContent = `${bin.binId} - ${bin.location.name}`;
    binSelect.appendChild(opt);
  });

  const driverSelect = document.getElementById('selectDriver');
  users.filter(u => u.role === 'driver').forEach(driver => {
    const opt = document.createElement('option');
    opt.value = driver._id;
    opt.textContent = driver.name;
    driverSelect.appendChild(opt);
  });
};

// ---- LOAD SCHEDULES ----
const loadSchedules = async () => {
  allSchedules = await api.get('/schedules');
  renderSchedules(allSchedules);

  document.getElementById('totalSchedules').textContent = allSchedules.length;
  document.getElementById('pendingSchedules').textContent = allSchedules.filter(s => s.status === 'pending').length;
  document.getElementById('completedSchedules').textContent = allSchedules.filter(s => s.status === 'completed').length;
  document.getElementById('inProgressSchedules').textContent = allSchedules.filter(s => s.status === 'in-progress').length;
};

const renderSchedules = (schedules) => {
  const list = document.getElementById('scheduleList');

  if (schedules.length === 0) {
    list.innerHTML = '<p class="loading">No schedules found.</p>';
    return;
  }

  list.innerHTML = schedules.map(s => `
    <div class="schedule-item">
      <div class="schedule-top">
        <h4>🗑️ ${s.bin?.binId || 'N/A'} — ${s.bin?.location?.name || ''}</h4>
        <span class="schedule-badge ${s.status}">${s.status.toUpperCase()}</span>
      </div>
      <div class="schedule-info">
        <span>👷 Driver: ${s.driver?.name || 'Unassigned'}</span>
        <span>📅 ${new Date(s.scheduledDate).toLocaleString()}</span>
        ${s.notes ? `<span>📝 ${s.notes}</span>` : ''}
      </div>
      <div class="schedule-actions">
        ${s.status === 'pending' ? `
          <button class="action-btn complete" onclick="updateStatus('${s._id}', 'in-progress')">▶ Start</button>
          <button class="action-btn cancel" onclick="updateStatus('${s._id}', 'cancelled')">✕ Cancel</button>
        ` : ''}
        ${s.status === 'in-progress' ? `
          <button class="action-btn complete" onclick="updateStatus('${s._id}', 'completed')">✅ Complete</button>
        ` : ''}
      </div>
    </div>
  `).join('');
};

// ---- UPDATE STATUS ----
const updateStatus = async (id, status) => {
  await api.put(`/schedules/${id}`, { status });
  loadSchedules();
};

// ---- CREATE SCHEDULE ----
document.getElementById('createScheduleBtn').addEventListener('click', async () => {
  const bin = document.getElementById('selectBin').value;
  const driver = document.getElementById('selectDriver').value;
  const scheduledDate = document.getElementById('scheduleDate').value;
  const notes = document.getElementById('scheduleNotes').value;
  const msg = document.getElementById('formMsg');

  if (!bin || !driver || !scheduledDate) {
    msg.textContent = 'Please fill all required fields.';
    msg.className = 'form-msg error';
    return;
  }

  await api.post('/schedules', { bin, driver, scheduledDate, notes });
  msg.textContent = 'Schedule created successfully!';
  msg.className = 'form-msg';

  document.getElementById('selectBin').value = '';
  document.getElementById('selectDriver').value = '';
  document.getElementById('scheduleDate').value = '';
  document.getElementById('scheduleNotes').value = '';

  setTimeout(() => { msg.textContent = ''; }, 3000);
  loadSchedules();
});

// ---- FILTERS ----
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    renderSchedules(filter === 'all' ? allSchedules : allSchedules.filter(s => s.status === filter));
  });
});

loadDropdowns();
loadSchedules();