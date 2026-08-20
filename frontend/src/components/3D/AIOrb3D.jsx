import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./AIOrb3D.css";

function AIOrb3D({ isThinking = false }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 180;
    const height = container.clientHeight || 180;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 4.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // AI Core Sphere
    const sphereGeo = new THREE.IcosahedronGeometry(1.2, 3);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      wireframe: true,
      roughness: 0.1,
      metalness: 0.9,
      emissive: 0x4f46e5,
      emissiveIntensity: 0.4,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphere);

    // Inner glowing core
    const innerGeo = new THREE.SphereGeometry(0.7, 16, 16);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: false,
      transparent: true,
      opacity: 0.8,
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerCore);

    // Outer Ring
    const ringGeo = new THREE.TorusGeometry(1.6, 0.03, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      wireframe: true,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    scene.add(ring);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x06b6d4, 2, 20);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 180;
      const h = container.clientHeight || 180;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    let animFrame;
    let clock = new THREE.Clock();

    const animate = () => {
      const time = clock.getElapsedTime();
      const speed = isThinking ? 2.5 : 1.0;

      sphere.rotation.y = time * 0.4 * speed;
      sphere.rotation.x = time * 0.2 * speed;

      ring.rotation.z = time * 0.5 * speed;
      ring.rotation.y = time * 0.3 * speed;

      innerCore.scale.setScalar(0.9 + Math.sin(time * 3 * speed) * 0.1);

      renderer.render(scene, camera);
      animFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animFrame);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isThinking]);

  return <div ref={mountRef} className="ai-orb-container" />;
}

export default AIOrb3D;
