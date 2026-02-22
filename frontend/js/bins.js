// ---- AUTH CHECK ----
const user = JSON.parse(localStorage.getItem('user'));
if (!user) window.location.href = '../pages/login.html';
document.getElementById('userName').textContent = user?.name || 'Admin';

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.clear();
  window.location.href = '../pages/login.html';
});

let allBins = [];

// ---- LOAD BINS ----
const loadBins = async () => {
  allBins = await api.get('/bins');
  renderBins(allBins);
};

const renderBins = (bins) => {
  const grid = document.getElementById('binsGrid');

  if (bins.length === 0) {
    grid.innerHTML = '<p class="loading">No bins found.</p>';
    return;
  }

  grid.innerHTML = bins.map(bin => `
    <div class="bin-card" onclick="openModal('${bin._id}')">
      <div class="bin-card-top">
        <h3>${bin.binId}</h3>
        <span class="bin-badge ${bin.status}">${bin.status.toUpperCase()}</span>
      </div>
      <p class="bin-location">📍 ${bin.location.name}</p>
      <div class="bin-fill-bar">
        <div class="bin-fill-progress ${bin.status}" style="width:${bin.fillLevel}%"></div>
      </div>
      <div class="bin-info">
        <span>Fill: ${bin.fillLevel}%</span>
        <span>Weight: ${bin.weight}kg</span>
        <span>Gas: ${bin.gasLevel}</span>
      </div>
    </div>
  `).join('');
};

// ---- FILTERS ----
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    renderBins(filter === 'all' ? allBins : allBins.filter(b => b.status === filter));
  });
});

// ---- MODAL ----
const openModal = (id) => {
  const bin = allBins.find(b => b._id === id);
  if (!bin) return;

  document.getElementById('modalBinId').textContent = bin.binId;
  document.getElementById('modalLocation').textContent = `📍 ${bin.location.name}`;
  document.getElementById('modalFill').textContent = `${bin.fillLevel}%`;
  document.getElementById('modalWeight').textContent = `${bin.weight} kg`;
  document.getElementById('modalGas').textContent = bin.gasLevel;
  document.getElementById('modalStatus').textContent = bin.status.toUpperCase();
  document.getElementById('modalStatus').style.color =
    bin.status === 'green' ? '#00ff88' : bin.status === 'yellow' ? '#ffcc00' : '#ff4444';
  document.getElementById('modalProgress').style.width = `${bin.fillLevel}%`;
  document.getElementById('modalProgress').style.background =
    bin.status === 'green' ? '#00ff88' : bin.status === 'yellow' ? '#ffcc00' : '#ff4444';

  document.getElementById('modalOverlay').classList.add('open');
  initModalScene(bin);
};

document.getElementById('modalClose').addEventListener('click', () => {
  document.getElementById('modalOverlay').classList.remove('open');
});

// ---- MODAL THREE.JS (3D bin) ----
let modalRenderer, modalAnimId;

const initModalScene = (bin) => {
  if (modalRenderer) { modalRenderer.dispose(); cancelAnimationFrame(modalAnimId); }

  const canvas = document.getElementById('modal-canvas');
  modalRenderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  modalRenderer.setSize(canvas.offsetWidth || 440, 180);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, (canvas.offsetWidth || 440) / 180, 0.1, 100);
  camera.position.set(0, 1, 5);

  const color = bin.status === 'green' ? 0x00aa55 : bin.status === 'yellow' ? 0xcc8800 : 0xcc2200;
  const glow = bin.status === 'green' ? 0x00ff88 : bin.status === 'yellow' ? 0xffcc00 : 0xff4444;

  const group = new THREE.Group();

  // Body
  group.add(new THREE.Mesh(
    new THREE.CylinderGeometry(0.7, 0.8, 2, 12),
    new THREE.MeshPhongMaterial({ color, shininess: 80 })
  ));

  // Lid
  const lid = new THREE.Mesh(
    new THREE.CylinderGeometry(0.73, 0.7, 0.25, 12),
    new THREE.MeshPhongMaterial({ color: glow, shininess: 120 })
  );
  lid.position.y = 1.12;
  group.add(lid);

  // Antenna
  const ant = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 0.5, 8),
    new THREE.MeshBasicMaterial({ color: glow })
  );
  ant.position.y = 1.62;
  group.add(ant);

  // Tip
  const tip = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 8, 8),
    new THREE.MeshBasicMaterial({ color: glow })
  );
  tip.position.y = 1.9;
  group.add(tip);

  scene.add(group);
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 5, 5);
  scene.add(light);

  const clock = new THREE.Clock();
  const animate = () => {
    modalAnimId = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    group.rotation.y = t * 0.8;
    group.position.y = Math.sin(t) * 0.15;
    tip.material.opacity = 0.4 + Math.sin(t * 4) * 0.6;
    modalRenderer.render(scene, camera);
  };
  animate();
};

loadBins();