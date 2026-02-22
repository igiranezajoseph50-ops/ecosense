// ---- BACKGROUND THREE.JS ----
const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.z = 30;

// Floating particles
const geo = new THREE.BufferGeometry();
const pos = new Float32Array(600 * 3);
for (let i = 0; i < 600 * 3; i++) pos[i] = (Math.random() - 0.5) * 80;
geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
scene.add(new THREE.Points(geo, new THREE.PointsMaterial({
  color: 0x00ff88, size: 0.15, transparent: true, opacity: 0.5
})));

// Floating wireframe sphere
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(8, 24, 24),
  new THREE.MeshBasicMaterial({ color: 0x00ff88, wireframe: true, transparent: true, opacity: 0.06 })
);
scene.add(sphere);

const clock = new THREE.Clock();
const animate = () => {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();
  sphere.rotation.y = t * 0.1;
  sphere.rotation.x = t * 0.05;
  renderer.render(scene, camera);
};
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ---- LOGIN LOGIC ----
document.getElementById('loginBtn').addEventListener('click', async () => {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const errorMsg = document.getElementById('errorMsg');

  if (!email || !password) {
    errorMsg.textContent = 'Please fill in all fields.';
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      errorMsg.textContent = data.message || 'Login failed.';
      return;
    }

    // Save token and user info
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));

    // Redirect to dashboard
    window.location.href = '../pages/dashboard.html';

  } catch (err) {
    errorMsg.textContent = 'Server error. Make sure backend is running.';
  }
});