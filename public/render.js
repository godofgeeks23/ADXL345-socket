const socket = io();

// === Three.js Scene Setup ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(2, 2, 4);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// === Lighting ===
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

// === Helpers ===
scene.add(new THREE.GridHelper(10, 10));
scene.add(new THREE.AxesHelper(2));

// === Drone Object ===
const drone = new THREE.Object3D();
scene.add(drone);

// === Body ===
const bodyGeometry = new THREE.BoxGeometry(1.2, 0.2, 1.2);
const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
const droneBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
drone.add(droneBody);

// === Arms ===
const armMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
const armLength = 2;
const armRadius = 0.05;

const createArm = (x, z) => {
  const arm = new THREE.Mesh(
    new THREE.CylinderGeometry(armRadius, armRadius, armLength, 16),
    armMaterial
  );
  arm.rotation.x = Math.PI / 2;
  arm.position.set(x, 0, z);
  return arm;
};

const arm1 = createArm(0, 0); // shared arm
arm1.rotation.z = Math.PI / 4;
drone.add(arm1);

// === Motors + Propellers ===
const motorMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const propellerMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

const motors = [];
const propellers = [];

const positions = [
  [0.85, 0.85],
  [-0.85, 0.85],
  [0.85, -0.85],
  [-0.85, -0.85],
];

positions.forEach(([x, z]) => {
  const motor = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 0.2, 16),
    motorMaterial
  );
  motor.position.set(x, 0.15, z);
  motor.rotation.x = Math.PI / 2;
  drone.add(motor);
  motors.push(motor);

  const propeller = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.02, 0.1),
    propellerMaterial
  );
  propeller.position.set(x, 0.25, z);
  drone.add(propeller);
  propellers.push(propeller);
});

// === Propeller Animation ===
function animatePropellers() {
  propellers.forEach((p) => {
    p.rotation.y += 0.6;
  });
}

// === Rotation State ===
let targetRotation = { x: 0, y: 0, z: 0 };
let currentRotation = { x: 0, y: 0, z: 0 };
const smoothingFactor = 0.1;

// === Animate Loop ===
function animate() {
  requestAnimationFrame(animate);

  currentRotation.x += (targetRotation.x - currentRotation.x) * smoothingFactor;
  currentRotation.y += (targetRotation.y - currentRotation.y) * smoothingFactor;
  currentRotation.z += (targetRotation.z - currentRotation.z) * smoothingFactor;

  drone.rotation.x = currentRotation.x;
  drone.rotation.y = currentRotation.y;
  drone.rotation.z = currentRotation.z;

  animatePropellers();
  renderer.render(scene, camera);
}

animate();

// === Socket Data Handler ===
socket.on("sensor-data", ({ pitch, roll, yaw }) => {
  console.log(pitch, roll, yaw);
  targetRotation.x = THREE.MathUtils.degToRad(pitch);
  targetRotation.y = THREE.MathUtils.degToRad(roll);
  targetRotation.z = THREE.MathUtils.degToRad(yaw || 0);
});
