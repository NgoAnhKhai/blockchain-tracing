import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Tube } from "@react-three/drei";

export default function ParticleEdge({
  start = [0, 0, 0],
  end = [0, 0, 0],
  speed = 0.5,
  radius = 0.02,
  particleRadius = 0.05,
}) {
  const tubeRef = useRef();
  const particleRef = useRef();

  const tRef = useRef(0);

  const curve = useMemo(() => {
    const p0 = new THREE.Vector3(...start);
    const p1 = new THREE.Vector3(...end);
    return new THREE.LineCurve3(p0, p1);
  }, [start, end]);

  useFrame((_, delta) => {
    tRef.current = (tRef.current + delta * speed) % 1;
    const point = curve.getPointAt(tRef.current);
    if (particleRef.current) {
      particleRef.current.position.copy(point);
    }
  });

  return (
    <>
      <Tube
        ref={tubeRef}
        args={[curve, 20 /* segments */, radius, 8 /* radialSegs */, false]}
      >
        <meshPhysicalMaterial
          color="#00ffff"
          emissive="#00ffff"
          metalness={1}
          roughness={0.2}
          clearcoat={0.5}
          clearcoatRoughness={0}
        />
      </Tube>

      <mesh ref={particleRef}>
        <sphereGeometry args={[particleRadius, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </>
  );
}
