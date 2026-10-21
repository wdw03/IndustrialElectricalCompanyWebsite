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

function createPanel(variant: number) {
  const group = new THREE.Group();
  const cabinetMaterial = new THREE.MeshStandardMaterial({ color: variant % 2 ? "#172f4b" : "#d9e0e5", metalness: 0.78, roughness: 0.28 });
  const insetMaterial = new THREE.MeshStandardMaterial({ color: "#071426", metalness: 0.7, roughness: 0.32 });
  const steelMaterial = new THREE.MeshStandardMaterial({ color: "#9baab5", metalness: 0.95, roughness: 0.18 });
  const orangeMaterial = new THREE.MeshStandardMaterial({ color: orange, emissive: orange, emissiveIntensity: 0.18, metalness: 0.35, roughness: 0.3 });

  const cabinet = new THREE.Mesh(new THREE.BoxGeometry(2.85, 4.35, 1.35), cabinetMaterial);
  cabinet.castShadow = true;
  cabinet.receiveShadow = true;
  group.add(cabinet);

  const door = new THREE.Mesh(new THREE.BoxGeometry(2.62, 4.06, 0.09), cabinetMaterial);
  door.position.z = 0.72;
  door.castShadow = true;
  group.add(door);

  const edgeLines = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(2.86, 4.36, 1.36)),
    new THREE.LineBasicMaterial({ color: variant % 2 ? "#55708c" : "#ffffff", transparent: true, opacity: 0.5 }),
  );
  group.add(edgeLines);

  const header = new THREE.Mesh(new THREE.BoxGeometry(2.25, 0.45, 0.08), insetMaterial);
  header.position.set(0, 1.62, 0.8);
  group.add(header);

  const display = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.48, 0.1), new THREE.MeshStandardMaterial({ color: "#06131c", emissive: "#0d91b8", emissiveIntensity: 0.18, metalness: 0.4 }));
  display.position.set(-0.5, 0.88, 0.81);
  group.add(display);

  const screenGlow = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.27), new THREE.MeshBasicMaterial({ color: "#42d7ff", transparent: true, opacity: 0.65 }));
  screenGlow.position.set(-0.5, 0.88, 0.868);
  group.add(screenGlow);

  const meterCount = variant % 3 === 0 ? 3 : 2;
  for (let i = 0; i < meterCount; i += 1) {
    const meter = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.1, 28), insetMaterial);
    meter.rotation.x = Math.PI / 2;
    meter.position.set(-0.58 + i * 0.58, 1.62, 0.83);
    group.add(meter);
    const face = new THREE.Mesh(new THREE.CircleGeometry(0.14, 24), new THREE.MeshBasicMaterial({ color: "#dff7ff" }));
    face.position.set(meter.position.x, meter.position.y, 0.891);
    group.add(face);
  }

  const indicatorColors = ["#33d17a", "#ffbd2e", "#ff4d4d"];
  indicatorColors.forEach((color, i) => {
    const material = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.6 });
    const light = new THREE.Mesh(new THREE.SphereGeometry(0.11, 20, 20), material);
    light.position.set(0.38 + i * 0.34, 0.92, 0.88);
    group.add(light);
  });

  for (let row = 0; row < 4; row += 1) {
    const vent = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.055, 0.055), insetMaterial);
    vent.position.set(-0.2, -1.42 + row * 0.16, 0.82);
    group.add(vent);
  }

  const handle = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.82, 0.14), steelMaterial);
  handle.position.set(1.05, -0.2, 0.88);
  group.add(handle);
  const handleTop = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.12, 0.14), orangeMaterial);
  handleTop.position.set(0.95, 0.2, 0.88);
  group.add(handleTop);

  const plinth = new THREE.Mesh(new THREE.BoxGeometry(3.05, 0.3, 1.55), insetMaterial);
  plinth.position.y = -2.28;
  plinth.castShadow = true;
  group.add(plinth);

  const boltGeometry = new THREE.CylinderGeometry(0.055, 0.055, 0.045, 12);
  [[-1.18, 1.87], [1.18, 1.87], [-1.18, -1.87], [1.18, -1.87]].forEach(([x, y]) => {
    const bolt = new THREE.Mesh(boltGeometry, steelMaterial);
    bolt.rotation.x = Math.PI / 2;
    bolt.position.set(x, y, 0.82);
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

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, compact ? 0.1 : 0.35, compact ? 10.5 : 9.1);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.shadowMap.enabled = true;
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

    const ambient = new THREE.HemisphereLight("#dff4ff", "#07182c", 2.4);
    scene.add(ambient);
    const key = new THREE.SpotLight("#ffffff", 65, 30, Math.PI / 5, 0.5, 1);
    key.position.set(4, 7, 7);
    key.castShadow = true;
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
    const particleCount = compact ? 45 : 80;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 8;
      positions[i + 1] = (Math.random() - 0.5) * 7;
      positions[i + 2] = (Math.random() - 0.5) * 4;
    }
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({ color: "#ef6b25", size: 0.025, transparent: true, opacity: 0.65 }));
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

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const intro = gsap.fromTo(model.scale, { x: 0.45, y: 0.45, z: 0.45 }, { x: compact ? 0.9 : 1, y: compact ? 0.9 : 1, z: compact ? 0.9 : 1, duration: 1.35, ease: "back.out(1.4)" });
    const scrollTween = gsap.to(pivot.rotation, {
      y: Math.PI * 1.45,
      ease: "none",
      scrollTrigger: { trigger: mount, start: "top bottom", end: "bottom top", scrub: 1.2 },
    });

    let frame = 0;
    const clock = new THREE.Clock();
    const render = () => {
      const elapsed = clock.getElapsedTime();
      if (!reducedMotion) {
        model.position.y = Math.sin(elapsed * 0.85) * 0.1;
        model.rotation.y += (pointer.x * 0.24 - model.rotation.y) * 0.018;
        model.rotation.x += (pointer.y * 0.08 - model.rotation.x) * 0.025;
        particles.rotation.y = elapsed * 0.025;
      }
      renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(frame);
      intro.kill();
      scrollTween.kill();
      observer.disconnect();
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
