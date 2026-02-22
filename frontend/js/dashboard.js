// ---- AUTH CHECK ----
const user = JSON.parse(localStorage.getItem('user'));
if (!user) window.location.href = '../pages/login.html';
document.getElementById('userName').textContent = user?.name || 'Admin';

// ---- LOGOUT ----
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.clear();
  window.location.href = '../pages/login.html';
});

// ---- LOAD STATS ----
const loadStats = async () => {
  const bins = await api.get('/bins');

  document.getElementById('totalBins').textContent = bins.length;
  document.getElementById('greenBins').textContent = bins.filter(b => b.status === 'green').length;
  document.getElementById('yellowBins').textContent = bins.filter(b => b.status === 'yellow').length;
  document.getElementById('redBins').textContent = bins.filter(b => b.status === 'red').length;

  // Render bin list
  const binList = document.getElementById('binList');
  if (bins.length === 0) {
    binList.innerHTML = '<p class="loading">No bins found.</p>';
    return;
  }

  binList.innerHTML = bins.map(bin => `
    <div class="bin-item">
      <div>
        <strong>${bin.binId}</strong>
        <p style="color:var(--text-muted); font-size:0.8rem">${bin.location.name}</p>
      </div>
      <div style="text-align:right">
        <p style="font-size:0.8rem">Fill: ${bin.fillLevel}%</p>
        <span class="bin-status ${bin.status}">${bin.status.toUpperCase()}</span>
      </div>
    </div>
  `).join('');
};

loadStats();

// ---- THREE.JS MINI SCENE ----
const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(canvas.offsetWidth, 300);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / 300, 0.1, 200);
camera.position.set(0, 0, 30);

// Earth
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(6, 48, 48),
  new THREE.MeshPhongMaterial({ color: 0x0a2a4a, emissive: 0x061020, specular: 0x2266ff, shininess: 60 })
);
scene.add(earth);

scene.add(new THREE.Mesh(
  new THREE.SphereGeometry(6.05, 20, 20),
  new THREE.MeshBasicMaterial({ color: 0x004488, wireframe: true, transparent: true, opacity: 0.08 })
));

// Orbiting bins
const binColors = [0x00ff88, 0xffcc00, 0xff4444];
const orbitBins = binColors.map((color, i) => {
  const group = new THREE.Group();
  group.add(new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.35, 0.8, 10),
    new THREE.MeshPhongMaterial({ color, shininess: 80 })
  ));
  const lid = new THREE.Mesh(
    new THREE.CylinderGeometry(0.32, 0.3, 0.1, 10),
    new THREE.MeshBasicMaterial({ color })
  );
  lid.position.y = 0.45;
  group.add(lid);

  const pivot = new THREE.Group();
  pivot.rotation.x = (i * 0.4) - 0.3;
  pivot.add(group);
  scene.add(pivot);

  // Orbit ring
  scene.add(new THREE.Mesh(
    new THREE.TorusGeometry(9 + i * 2, 0.015, 8, 80),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.15 })
  ));

  return { group, pivot, radius: 9 + i * 2, speed: 0.25 - i * 0.05, angle: i * 2.1 };
});

scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(20, 10, 10);
scene.add(light);

const clock = new THREE.Clock();
const animate = () => {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();
  earth.rotation.y = t * 0.05;
  orbitBins.forEach(bin => {
    bin.angle += bin.speed * 0.01;
    bin.group.position.x = Math.cos(bin.angle) * bin.radius;
    bin.group.position.z = Math.sin(bin.angle) * bin.radius;
    bin.group.rotation.y = -bin.angle;
  });
  renderer.render(scene, camera);
};
animate();