import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const container = document.getElementById("hero3d");
if (!container) return;

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isMobile = window.matchMedia("(max-width: 900px)").matches;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
camera.position.set(0.15, 0.35, 3.8);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  powerPreference: "high-performance",
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
container.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xe8e4dc, 0.55));

const keyLight = new THREE.DirectionalLight(0xfff8ee, 1.1);
keyLight.position.set(3, 5, 4);
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0x8a9ab8, 0.35);
fillLight.position.set(-4, 1, -2);
scene.add(fillLight);

const accentLight = new THREE.PointLight(0xa89b6a, 0.7, 14);
accentLight.position.set(0.5, 0.8, 2.5);
scene.add(accentLight);

const group = new THREE.Group();
scene.add(group);

const loader = new GLTFLoader();
loader.load(
  "assets/it-hub.glb",
  (gltf) => {
    const model = gltf.scene;
    let meshIndex = 0;

    model.traverse((child) => {
      if (!child.isMesh) return;

      const isCore = meshIndex === 6;
      const isNode = meshIndex >= 7;

      child.material = new THREE.MeshStandardMaterial({
        color: isCore ? 0xc9bc8e : isNode ? 0x9a8e72 : 0x8a8560,
        metalness: 0.75,
        roughness: isCore ? 0.22 : 0.38,
        emissive: isCore ? 0x1a1410 : 0x000000,
        emissiveIntensity: isCore ? 0.15 : 0,
      });

      meshIndex += 1;
    });

    model.position.set(0, -0.12, 0);
    group.add(model);
  },
  undefined,
  () => buildFallback(group)
);

function buildFallback(parent) {
  const rackMat = new THREE.MeshStandardMaterial({
    color: 0x8a8560,
    metalness: 0.72,
    roughness: 0.38,
  });
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0xc9bc8e,
    metalness: 0.85,
    roughness: 0.2,
    emissive: 0x1a1410,
    emissiveIntensity: 0.15,
  });

  for (let i = 0; i < 6; i += 1) {
    const blade = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.12, 0.9), rackMat);
    blade.position.y = i * 0.16 - 0.4;
    parent.add(blade);
  }

  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.35, 1), coreMat);
  core.position.y = 0.35;
  parent.add(core);
}

function resize() {
  const w = container.clientWidth;
  const h = container.clientHeight;
  if (!w || !h) return;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h, false);
}

const targetRotation = { x: 0, y: 0 };
const currentRotation = { x: 0, y: 0 };

function onPointerMove(e) {
  const rect = container.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
  const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  targetRotation.y = x * 0.18;
  targetRotation.x = y * 0.08;
}

if (!isMobile && !prefersReducedMotion) {
  window.addEventListener("pointermove", onPointerMove);
}

window.addEventListener("resize", resize);
resize();

let autoSpin = 0;

function animate() {
  requestAnimationFrame(animate);

  if (!prefersReducedMotion) {
    autoSpin += 0.0018;
    currentRotation.x += (targetRotation.x - currentRotation.x) * 0.04;
    currentRotation.y += (targetRotation.y - currentRotation.y) * 0.04;
    group.rotation.x = currentRotation.x;
    group.rotation.y = autoSpin + currentRotation.y;
  }

  renderer.render(scene, camera);
}

animate();
