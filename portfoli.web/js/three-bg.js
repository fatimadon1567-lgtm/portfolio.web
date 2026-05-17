/**
 * three-bg.js
 * Three.js animated particle network background
 */
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 80;

  // ---- Particles ----
  const PARTICLE_COUNT = 180;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const velocities = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 200;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 120;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
    velocities.push({
      x: (Math.random() - 0.5) * 0.06,
      y: (Math.random() - 0.5) * 0.06,
      z: (Math.random() - 0.5) * 0.02
    });
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0x00f5ff,
    size: 0.6,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true
  });

  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // ---- Connection Lines ----
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x00f5ff,
    transparent: true,
    opacity: 0.08
  });

  const lineGroup = new THREE.Group();
  scene.add(lineGroup);

  function updateLines() {
    // Remove old lines
    while (lineGroup.children.length) {
      lineGroup.remove(lineGroup.children[0]);
    }

    const pos = particleGeo.attributes.position.array;
    const MAX_DIST = 28;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const dx = pos[i * 3]     - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < MAX_DIST) {
          const lineGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]),
            new THREE.Vector3(pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2])
          ]);
          const opacity = (1 - dist / MAX_DIST) * 0.15;
          const mat = new THREE.LineBasicMaterial({
            color: 0x00f5ff,
            transparent: true,
            opacity
          });
          lineGroup.add(new THREE.Line(lineGeo, mat));
        }
      }
    }
  }

  // ---- Floating Geometric Shapes ----
  const shapes = [];
  const shapeGeos = [
    new THREE.OctahedronGeometry(2, 0),
    new THREE.TetrahedronGeometry(2, 0),
    new THREE.IcosahedronGeometry(1.5, 0)
  ];

  for (let i = 0; i < 6; i++) {
    const geo = shapeGeos[i % shapeGeos.length];
    const mat = new THREE.MeshBasicMaterial({
      color: 0x00f5ff,
      wireframe: true,
      transparent: true,
      opacity: 0.12
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(
      (Math.random() - 0.5) * 160,
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 40 - 20
    );
    mesh.userData.rotSpeed = {
      x: (Math.random() - 0.5) * 0.008,
      y: (Math.random() - 0.5) * 0.008
    };
    scene.add(mesh);
    shapes.push(mesh);
  }

  // ---- Mouse parallax ----
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 0.3;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.3;
  });

  // ---- Resize ----
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ---- Animate ----
  let frame = 0;
  function animate() {
    requestAnimationFrame(animate);
    frame++;

    const pos = particleGeo.attributes.position.array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3]     += velocities[i].x;
      pos[i * 3 + 1] += velocities[i].y;
      pos[i * 3 + 2] += velocities[i].z;

      // Wrap around
      if (pos[i * 3]     >  100) pos[i * 3]     = -100;
      if (pos[i * 3]     < -100) pos[i * 3]     =  100;
      if (pos[i * 3 + 1] >   60) pos[i * 3 + 1] =  -60;
      if (pos[i * 3 + 1] <  -60) pos[i * 3 + 1] =   60;
    }

    particleGeo.attributes.position.needsUpdate = true;

    // Update lines every 3 frames for performance
    if (frame % 3 === 0) updateLines();

    // Rotate shapes
    shapes.forEach(s => {
      s.rotation.x += s.userData.rotSpeed.x;
      s.rotation.y += s.userData.rotSpeed.y;
    });

    // Camera parallax
    camera.position.x += (mouseX * 10 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 6 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();
})();
