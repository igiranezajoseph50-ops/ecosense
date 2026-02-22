// ── CURSOR ──
const css = document.createElement('style');
css.innerHTML = `
  * { cursor: none !important; }
  .cur { position:fixed; border-radius:50%; pointer-events:none; z-index:9999; transform:translate(-50%,-50%); }
  .cur-dot { width:5px; height:5px; background:#00ff88; box-shadow:0 0 10px #00ff88; }
  .cur-ring { width:28px; height:28px; border:1px solid rgba(0,255,136,.5); transition:all .1s; }
  .cur-dot.h { background:#00ccff; box-shadow:0 0 15px #00ccff; transform:translate(-50%,-50%) scale(2); }
  .cur-ring.h { width:44px; height:44px; border-color:#00ccff; }
`;
document.head.appendChild(css);

const dot  = Object.assign(document.createElement('div'), {className:'cur cur-dot'});
const ring = Object.assign(document.createElement('div'), {className:'cur cur-ring'});
document.body.append(dot, ring);

let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
document.querySelectorAll('a,button').forEach(el => {
  el.addEventListener('mouseenter', ()=>{ dot.classList.add('h'); ring.classList.add('h'); });
  el.addEventListener('mouseleave', ()=>{ dot.classList.remove('h'); ring.classList.remove('h'); });
});
(function cl(){ dot.style.left=mx+'px'; dot.style.top=my+'px'; rx+=(mx-rx)*.1; ry+=(my-ry)*.1; ring.style.left=rx+'px'; ring.style.top=ry+'px'; requestAnimationFrame(cl); })();

// ── HUD CLOCK ──
setInterval(() => {
  document.getElementById('hudTime').textContent = new Date().toLocaleTimeString();
}, 1000);

// ── COUNTER ANIMATION ──
const countTo = (el, target, duration=2000) => {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    el.textContent = Math.floor(start);
    if (start >= target) { el.textContent = target; clearInterval(timer); }
  }, 16);
};

setTimeout(() => {
  countTo(document.getElementById('countBins'), 128);
  countTo(document.getElementById('countRoutes'), 14);
  countTo(document.getElementById('countAlerts'), 3);
}, 500);

// ── THREE.JS ──
const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, .1, 500);
camera.position.set(0, 8, 45);

// STARS
const sp = new Float32Array(1200*3);
for(let i=0;i<1200*3;i++) sp[i]=(Math.random()-.5)*300;
const sg = new THREE.BufferGeometry();
sg.setAttribute('position', new THREE.BufferAttribute(sp,3));
scene.add(new THREE.Points(sg, new THREE.PointsMaterial({
  color:0xffffff, size:.2, transparent:true, opacity:.7,
  depthWrite:false, blending:THREE.AdditiveBlending
})));

// ── CITY GRID GROUND ──
const gridHelper = new THREE.GridHelper(80, 30, 0x00ff88, 0x003322);
gridHelper.position.y = -6;
gridHelper.material.transparent = true;
gridHelper.material.opacity = 0.4;
scene.add(gridHelper);

// ── CITY BUILDINGS ──
const buildingData = [
  [6,14,6,  8,0,0,  0x0a1f2e],
  [5,10,5, -8,0,4,  0x0d2035],
  [4,18,4,  16,0,-2, 0x091a28],
  [5,8,5,  -16,0,-3, 0x0c1e30],
  [3,12,3,  12,0,8,  0x0a1c2c],
  [4,16,4, -12,0,6,  0x0e2238],
  [3,6,3,   20,0,2,  0x091828],
  [3,9,3,  -20,0,0,  0x0b1e30],
  [6,22,6,  0,0,-10, 0x0d2238],
  [4,14,4,  8,0,-14, 0x0a1c2c],
  [5,11,5, -8,0,-12, 0x0c2035],
  [3,7,3,   4,0,14,  0x091828],
  [3,8,3,  -4,0,16,  0x0b1e2e],
];

buildingData.forEach(([w,h,d, x,y,z, color]) => {
  const geo = new THREE.BoxGeometry(w, h, d);
  const mat = new THREE.MeshPhongMaterial({ color, emissive:0x030d18, shininess:30 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y + h/2 - 6, z);
  scene.add(mesh);

  // building edge glow (wireframe outline)
  const edges = new THREE.EdgesGeometry(geo);
  const line  = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
    color:0x00ff88, transparent:true, opacity:.12
  }));
  line.position.copy(mesh.position);
  scene.add(line);

  // rooftop glow
  const roofGeo = new THREE.PlaneGeometry(w-.5, d-.5);
  const roofMat = new THREE.MeshBasicMaterial({
    color:0x00ff88, transparent:true, opacity:.15, side:THREE.DoubleSide
  });
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.rotation.x = -Math.PI/2;
  roof.position.set(x, y+h-6, z);
  scene.add(roof);
});

// ── SMART BINS ──
const makeBin = (color, glow) => {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(
    new THREE.CylinderGeometry(.45,.55,1.2,10),
    new THREE.MeshPhongMaterial({ color, shininess:80 })
  ));
  const lid = new THREE.Mesh(
    new THREE.CylinderGeometry(.47,.45,.16,10),
    new THREE.MeshPhongMaterial({ color:glow, shininess:120 })
  );
  lid.position.y=.68; g.add(lid);
  const ant = new THREE.Mesh(
    new THREE.CylinderGeometry(.025,.025,.35,6),
    new THREE.MeshBasicMaterial({ color:glow })
  );
  ant.position.y=.95; g.add(ant);
  const tip = new THREE.Mesh(
    new THREE.SphereGeometry(.07,8,8),
    new THREE.MeshBasicMaterial({ color:glow })
  );
  tip.position.y=1.15; g.add(tip);
  return { g, tip };
};

const binPositions = [
  [4,0,  0x00aa55, 0x00ff88],
  [-5,3, 0xbb7700, 0xffcc00],
  [10,5, 0xbb1100, 0xff3300],
  [-9,-2,0x00aa55, 0x00ff88],
  [2,-8, 0xbb7700, 0xffcc00],
];

const bins = binPositions.map(([x,z,c,gl]) => {
  const { g, tip } = makeBin(c, gl);
  g.position.set(x, -5.4, z);
  scene.add(g);
  return { g, tip };
});

// ── DATA BEAM LINES between bins ──
bins.forEach((b, i) => {
  if(i === bins.length-1) return;
  const next = bins[i+1];
  const points = [b.g.position.clone(), next.g.position.clone()];
  points[0].y += 1.2;
  points[1].y += 1.2;
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  scene.add(new THREE.Line(geo, new THREE.LineBasicMaterial({
    color:0x00ff88, transparent:true, opacity:.2
  })));
});

// ── FLOATING SCAN RING ──
const scanRing = new THREE.Mesh(
  new THREE.TorusGeometry(25, .04, 8, 120),
  new THREE.MeshBasicMaterial({ color:0x00ff88, transparent:true, opacity:.3 })
);
scanRing.rotation.x = Math.PI/2;
scanRing.position.y = 2;
scene.add(scanRing);

// ── LIGHTS ──
scene.add(new THREE.AmbientLight(0x0a1628, 2));
const sun = new THREE.DirectionalLight(0xffffff, 1.5);
sun.position.set(20,30,20);
scene.add(sun);
const greenLight = new THREE.PointLight(0x00ff88, 3, 60);
greenLight.position.set(-10,10,0);
scene.add(greenLight);
const blueLight = new THREE.PointLight(0x0044aa, 2, 50);
blueLight.position.set(15,-2,-10);
scene.add(blueLight);

// ── MOUSE ──
let tmx=0,tmy=0,cmx=0,cmy=0;
document.addEventListener('mousemove', e=>{
  tmx=(e.clientX/innerWidth-.5)*2;
  tmy=(e.clientY/innerHeight-.5)*2;
});

// ── ANIMATE ──
const clock = new THREE.Clock();
(function loop(){
  requestAnimationFrame(loop);
  const t = clock.getElapsedTime();

  cmx+=(tmx-cmx)*.04; cmy+=(tmy-cmy)*.04;

  // scan ring moves up and down
  scanRing.position.y = Math.sin(t*.4)*8;
  scanRing.material.opacity = .15+Math.sin(t*.4+Math.PI/2)*.15;

  // bins blink
  bins.forEach((b,i)=>{
    b.tip.material.opacity = .3+Math.sin(t*3+i*1.2)*.7;
    b.g.position.y = -5.4+Math.sin(t*.8+i)*.08;
  });

  // green light pulse
  greenLight.intensity = 3+Math.sin(t*2)*1;

  // camera gentle parallax
  camera.position.x += (cmx*6-camera.position.x)*.03;
  camera.position.y += (-cmy*3+8-camera.position.y)*.03;
  camera.lookAt(0,0,0);

  renderer.render(scene, camera);
})();

window.addEventListener('resize', ()=>{
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});