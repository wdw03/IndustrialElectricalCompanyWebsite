import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type ThreePanelSceneProps = {
  variant?: number;
  className?: string;
  compact?: boolean;
};

const orange = new THREE.Color("#ef6b25");
const navy = new THREE.Color("#081f3a");

function createCanvasTexture(
  width: number,
  height: number,
  drawFn: (ctx: CanvasRenderingContext2D, w: number, h: number) => void
) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  drawFn(ctx, width, height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function createDigitalMeterTexture(variant = 0) {
  const titles = ["MAIN INCOMER", "MCC FEEDER", "APFC BANK", "PLC AUTOMATION"];
  const title = titles[variant % titles.length];
  const volts = ["415.2 V", "414.8 V", "415.6 V", "230.1 V"][variant % 4];
  const amps = ["1650 A", "840 A", "450 A", "120 A"][variant % 4];

  return createCanvasTexture(320, 240, (ctx, w, h) => {
    ctx.fillStyle = "#0c131d";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#1e2c3d";
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, w - 8, h - 8);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 13px 'Segoe UI', system-ui";
    ctx.fillText(`POWERTECH · ${title}`, 16, 26);

    ctx.fillStyle = "#22c55e";
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "right";
    ctx.fillText("● TRUE RMS", w - 16, 26);
    ctx.textAlign = "left";

    // Voltage display
    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 10px monospace";
    ctx.fillText("V_LL (AVG)", 16, 56);
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 28px 'Courier New', monospace";
    ctx.fillText(volts, 16, 88);

    // Current display
    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 10px monospace";
    ctx.fillText("I_AVG", 16, 120);
    ctx.fillStyle = "#34d399";
    ctx.font = "bold 28px 'Courier New', monospace";
    ctx.fillText(amps, 16, 152);

    // Frequency & Power factor
    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 11px monospace";
    ctx.fillText("FREQ: 50.02 Hz   PF: 0.994 Lag", 16, 185);

    // Bottom keypad
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(16, 200, w - 32, 28);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("[ V/A ]   [ W/PF ]   [ HARMONICS ]   [ PROG ]", w / 2, 218);
  });
}

function createDangerPlateTexture() {
  return createCanvasTexture(256, 128, (ctx, w, h) => {
    ctx.fillStyle = "#ffcc00";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#111111";
    ctx.lineWidth = 6;
    ctx.strokeRect(4, 4, w - 8, h - 8);

    // Triangle
    ctx.fillStyle = "#d32f2f";
    ctx.beginPath();
    ctx.moveTo(36, 20);
    ctx.lineTo(66, 80);
    ctx.lineTo(6, 80);
    ctx.closePath();
    ctx.fill();

    // Lightning bolt
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(38, 30);
    ctx.lineTo(26, 55);
    ctx.lineTo(36, 55);
    ctx.lineTo(30, 75);
    ctx.lineTo(48, 50);
    ctx.lineTo(38, 50);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#111111";
    ctx.font = "bold 22px 'Segoe UI', Arial, sans-serif";
    ctx.fillText("ख़तरा", 80, 44);

    ctx.font = "900 22px 'Arial Black', Impact, sans-serif";
    ctx.fillStyle = "#b91c1c";
    ctx.fillText("DANGER", 80, 74);

    ctx.fillStyle = "#111111";
    ctx.font = "900 16px sans-serif";
    ctx.fillText("415 VOLTS · 50 Hz", 80, 100);
  });
}

function createPanel(variant: number) {
  const group = new THREE.Group();
  const isDark = variant % 2 === 1;

  // Authentic powder-coat sheet steel
  const cabinetMaterial = new THREE.MeshPhysicalMaterial({
    color: isDark ? "#202a36" : "#ced4da",
    metalness: 0.35,
    roughness: 0.45,
    clearcoat: 0.35,
    clearcoatRoughness: 0.38,
  });

  const insetMaterial = new THREE.MeshStandardMaterial({
    color: "#0f1622",
    metalness: 0.6,
    roughness: 0.4,
  });

  const steelMaterial = new THREE.MeshStandardMaterial({
    color: "#e2e8f0",
    metalness: 0.95,
    roughness: 0.16,
  });

  const copperMaterial = new THREE.MeshStandardMaterial({
    color: "#d9783f",
    metalness: 0.98,
    roughness: 0.22,
  });

  const orangeMaterial = new THREE.MeshStandardMaterial({
    color: orange,
    emissive: orange,
    emissiveIntensity: 0.2,
    metalness: 0.3,
    roughness: 0.32,
  });

  // Main Enclosure Cabinet
  const cabinet = new THREE.Mesh(new THREE.BoxGeometry(2.85, 4.35, 1.35), cabinetMaterial);
  cabinet.castShadow = true;
  cabinet.receiveShadow = true;
  group.add(cabinet);

  // Hinged Door Panel with slight reveal
  const door = new THREE.Mesh(new THREE.BoxGeometry(2.65, 4.08, 0.08), cabinetMaterial);
  door.position.z = 0.72;
  door.castShadow = true;
  group.add(door);

  // Subtle bevel accent outline
  const edgeLines = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(2.86, 4.36, 1.36)),
    new THREE.LineBasicMaterial({ color: isDark ? "#455a74" : "#ffffff", transparent: true, opacity: 0.35 }),
  );
  group.add(edgeLines);

  // 4x Crane Lifting Eyebolts on roof
  [[-1.15, -0.4], [1.15, -0.4], [-1.15, 0.4], [1.15, 0.4]].forEach(([ex, ez]) => {
    const eyeBase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.06, 16), steelMaterial);
    eyeBase.position.set(ex, 2.2, ez);
    const eyeRing = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.035, 12, 24), steelMaterial);
    eyeRing.position.set(ex, 2.32, ez);
    eyeRing.castShadow = true;
    group.add(eyeBase, eyeRing);
  });

  // Header Rating Bar
  const header = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.38, 0.06), insetMaterial);
  header.position.set(0, 1.68, 0.78);
  group.add(header);

  // Digital Multi-Function Meter (Screen)
  const meterTexture = createDigitalMeterTexture(variant);
  const meterMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1.05, 0.78),
    new THREE.MeshBasicMaterial({ map: meterTexture, transparent: true })
  );
  meterMesh.position.set(-0.55, 0.95, 0.785);
  group.add(meterMesh);

  // Digital Meter Bezel
  const meterBezel = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.88, 0.05), insetMaterial);
  meterBezel.position.set(-0.55, 0.95, 0.76);
  group.add(meterBezel);

  // R-Y-B Phase Pilot Lamps
  const indicatorColors = ["#ef4444", "#eab308", "#2563eb"];
  indicatorColors.forEach((color, i) => {
    const bezel = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.04, 16), steelMaterial);
    bezel.rotation.x = Math.PI / 2;
    bezel.position.set(0.38 + i * 0.32, 1.15, 0.78);

    const lampMat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.8 });
    const lampDome = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), lampMat);
    lampDome.rotation.x = Math.PI / 2;
    lampDome.position.set(0.38 + i * 0.32, 1.15, 0.81);

    group.add(bezel, lampDome);
  });

  // Bilingual Caution / Danger Notice Plate
  const dangerTex = createDangerPlateTexture();
  const dangerPlate = new THREE.Mesh(
    new THREE.PlaneGeometry(0.78, 0.39),
    new THREE.MeshBasicMaterial({ map: dangerTex, transparent: true })
  );
  dangerPlate.position.set(0.65, 0.62, 0.785);
  group.add(dangerPlate);

  // Rotary Operating Handle (ROH) with emergency yellow collar
  const handleBase = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.04, 24), insetMaterial);
  handleBase.rotation.x = Math.PI / 2;
  handleBase.position.set(0.65, -0.05, 0.78);

  const yellowCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.05, 20), orangeMaterial);
  yellowCollar.rotation.x = Math.PI / 2;
  yellowCollar.position.set(0.65, -0.05, 0.8);

  const handleLever = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.42, 0.09), insetMaterial);
  handleLever.position.set(0.65, 0.08, 0.85);

  const handleRedTip = new THREE.Mesh(new THREE.BoxGeometry(0.095, 0.09, 0.095), new THREE.MeshStandardMaterial({ color: "#dc2626" }));
  handleRedTip.position.set(0.65, 0.24, 0.85);
  group.add(handleBase, yellowCollar, handleLever, handleRedTip);

  // Ventilation Louvers (Lower Door)
  for (let row = 0; row < 5; row += 1) {
    const vent = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.04, 0.03), insetMaterial);
    vent.position.set(-0.25, -1.35 + row * 0.14, 0.78);
    group.add(vent);
  }

  // Industrial Lift-off Hinges on Left Edge
  [-1.4, 1.4].forEach((hy) => {
    const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.24, 16), steelMaterial);
    hinge.position.set(-1.3, hy, 0.74);
    group.add(hinge);
  });

  // Base Plinth
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(3.05, 0.36, 1.55), insetMaterial);
  plinth.position.y = -2.32;
  plinth.castShadow = true;
  group.add(plinth);

  // Continuous Copper Earth Busbar on Plinth
  const earthBar = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.08, 0.02), copperMaterial);
  earthBar.position.set(0, -2.25, 0.8);
  group.add(earthBar);

  // Chrome Plinth Bolts
  [[-1.25, 1.88], [1.25, 1.88], [-1.25, -1.88], [1.25, -1.88]].forEach(([x, y]) => {
    const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.03, 12), steelMaterial);
    bolt.rotation.x = Math.PI / 2;
    bolt.position.set(x, y, 0.78);
    group.add(bolt);
  });

  group.rotation.y = -0.38;
  return group;
}

export default function ThreePanelScene({ variant = 0, className = "", compact = false }: ThreePanelSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const isMobile = window.innerWidth < 768;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, compact ? 0.1 : 0.35, compact ? 10.5 : 9.1);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: isMobile ? "default" : "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.35 : 1.7));
    renderer.shadowMap.enabled = !isMobile;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);

    const pivot = new THREE.Group();
    const model = createPanel(variant);
    model.scale.setScalar(compact ? 0.9 : 1);
    pivot.add(model);
    scene.add(pivot);

    const ambient = new THREE.HemisphereLight("#dff4ff", "#07182c", 2.2);
    scene.add(ambient);

    const key = new THREE.SpotLight("#ffffff", 65, 30, Math.PI / 5, 0.5, 1);
    key.position.set(4, 7, 7);
    key.castShadow = !isMobile;
    scene.add(key);

    const rim = new THREE.PointLight("#ef6b25", 35, 18);
    rim.position.set(-4, 1, 4);
    scene.add(rim);

    const blue = new THREE.PointLight("#2498ff", 24, 15);
    blue.position.set(4, -2, 2);
    scene.add(blue);

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(4.7, 64),
      new THREE.MeshStandardMaterial({ color: navy, metalness: 0.55, roughness: 0.5, transparent: true, opacity: 0.75 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.45;
    floor.receiveShadow = true;
    scene.add(floor);

    const grid = new THREE.GridHelper(9, 18, "#ef6b25", "#27425f");
    grid.position.y = -2.43;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.35;
    scene.add(grid);

    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = compact || isMobile ? 35 : 75;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 8;
      positions[i + 1] = (Math.random() - 0.5) * 7;
      positions[i + 2] = (Math.random() - 0.5) * 4;
    }
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({ color: "#ef6b25", size: 0.025, transparent: true, opacity: 0.65 })
    );
    scene.add(particles);

    const pointer = new THREE.Vector2();
    const onPointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = -((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    mount.addEventListener("pointermove", onPointerMove);

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();

    let isVisible = true;
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { rootMargin: "100px" }
    );
    intersectionObserver.observe(mount);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const intro = gsap.fromTo(
      model.scale,
      { x: 0.45, y: 0.45, z: 0.45 },
      { x: compact ? 0.9 : 1, y: compact ? 0.9 : 1, z: compact ? 0.9 : 1, duration: 1.35, ease: "back.out(1.4)" }
    );
    const scrollTween = gsap.to(pivot.rotation, {
      y: Math.PI * 1.45,
      ease: "none",
      scrollTrigger: { trigger: mount, start: "top bottom", end: "bottom top", scrub: 1.2 },
    });

    let frame = 0;
    const clock = new THREE.Clock();
    const render = () => {
      frame = requestAnimationFrame(render);
      if (!isVisible || document.hidden) return;

      const elapsed = clock.getElapsedTime();
      if (!reducedMotion) {
        model.position.y = Math.sin(elapsed * 0.85) * 0.1;
        model.rotation.y += (pointer.x * 0.24 - model.rotation.y) * 0.018;
        model.rotation.x += (pointer.y * 0.08 - model.rotation.x) * 0.025;
        particles.rotation.y = elapsed * 0.025;
      }
      renderer.render(scene, camera);
    };
    render();

    return () => {
      cancelAnimationFrame(frame);
      intro.kill();
      scrollTween.kill();
      observer.disconnect();
      intersectionObserver.disconnect();
      mount.removeEventListener("pointermove", onPointerMove);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments || object instanceof THREE.Points) {
          object.geometry?.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material?.dispose());
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [variant, compact]);

  return <div ref={mountRef} className={className} aria-label="Interactive 3D industrial electrical panel" role="img" />;
}
