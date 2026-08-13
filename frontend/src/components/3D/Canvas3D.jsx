import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./Canvas3D.css";

function Canvas3D({ variant = "default" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x6366f1, 2, 50);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xa855f7, 2, 50);
    pointLight2.position.set(-10, -10, 5);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0x06b6d4, 1.5, 50);
    pointLight3.position.set(0, 15, -5);
    scene.add(pointLight3);

    // 3D Floating Geometries (Study Crystals & Cubes)
    const group = new THREE.Group();
    scene.add(group);

    const materials = [
      new THREE.MeshStandardMaterial({
        color: 0x6366f1,
        roughness: 0.2,
        metalness: 0.8,
        wireframe: true,
      }),
      new THREE.MeshStandardMaterial({
        color: 0xa855f7,
        roughness: 0.1,
        metalness: 0.9,
        transparent: true,
        opacity: 0.7,
      }),
      new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        roughness: 0.3,
        metalness: 0.7,
        wireframe: true,
      }),
      new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        roughness: 0.1,
        metalness: 0.8,
        transparent: true,
        opacity: 0.6,
      }),
    ];

    const geometries = [
      new THREE.IcosahedronGeometry(1.4, 0),
      new THREE.OctahedronGeometry(1.2, 0),
      new THREE.TorusKnotGeometry(0.9, 0.3, 64, 16),
      new THREE.DodecahedronGeometry(1.1, 0),
    ];

    const objects = [];
    const count = variant === "hero" ? 22 : 14;

    for (let i = 0; i < count; i++) {
      const geo = geometries[i % geometries.length];
      const mat = materials[i % materials.length];
      const mesh = new THREE.Mesh(geo, mat);

      mesh.position.x = (Math.random() - 0.5) * 28;
      mesh.position.y = (Math.random() - 0.5) * 20;
      mesh.position.z = (Math.random() - 0.5) * 16;

      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;

      const scale = 0.5 + Math.random() * 0.8;
      mesh.scale.set(scale, scale, scale);

      mesh.userData = {
        rotSpeedX: (Math.random() - 0.5) * 0.015,
        rotSpeedY: (Math.random() - 0.5) * 0.015,
        floatSpeed: 0.005 + Math.random() * 0.008,
        floatOffset: Math.random() * Math.PI * 2,
        initialY: mesh.position.y,
      };

      group.add(mesh);
      objects.push(mesh);
    }

    // 3D Particles Field (Star dust)
    const particleCount = variant === "hero" ? 700 : 400;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorChoices = [
      new THREE.Color(0x818cf8),
      new THREE.Color(0xc084fc),
      new THREE.Color(0x38bdf8),
      new THREE.Color(0x34d399),
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 45;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 35;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

      const c = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Handle Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      group.rotation.y = targetX * 0.3;
      group.rotation.x = -targetY * 0.3;

      particles.rotation.y = elapsedTime * 0.02;
      particles.rotation.x = elapsedTime * 0.01;

      // Animate each object
      objects.forEach((obj) => {
        obj.rotation.x += obj.userData.rotSpeedX;
        obj.rotation.y += obj.userData.rotSpeedY;
        obj.position.y =
          obj.userData.initialY +
          Math.sin(elapsedTime * 1.5 + obj.userData.floatOffset) * 0.6;
      });

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [variant]);

  return <div ref={containerRef} className="canvas-3d-bg" />;
}

export default Canvas3D;
