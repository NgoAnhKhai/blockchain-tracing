// src/components/charts/Graph.jsx
import React, { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import Node from "../Node";
import ParticleEdge from "./ParticleEdge";

export default function Graph({ center, children }) {
  const groupRef = useRef();
  const [isPaused, setIsPaused] = useState(false);
  const rotRef = useRef(0);

  // Tính vị trí đều trên mặt cầu
  const positions = useMemo(() => {
    const pts = [];
    const n = children.length;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = 1 - (2 * i) / (n - 1);
      const r = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;
      pts.push([Math.cos(theta) * r * 5, y * 5, Math.sin(theta) * r * 5]);
    }
    return pts;
  }, [children.length]);

  // Xoay group, giữ góc khi pause/resume
  useFrame((_, delta) => {
    if (!isPaused && groupRef.current) {
      rotRef.current += delta * 0.2;
      groupRef.current.rotation.y = rotRef.current;
    }
  });

  // Called by Node on hover
  const handleHover = (flag) => setIsPaused(flag);

  return (
    <group ref={groupRef}>
      {/* Node cha */}
      <Node
        address={center}
        position={[0, 0, 0]}
        isCenter
        onHover={handleHover}
      />

      {children.map((addr, i) => (
        <group key={addr}>
          {/* Particle flow edge */}
          <ParticleEdge
            start={[0, 0, 0]}
            end={positions[i]}
            speed={0.5}
            radius={0.02}
            particleRadius={0.08}
          />

          {/* Node con */}
          <Node address={addr} position={positions[i]} onHover={handleHover} />
        </group>
      ))}
    </group>
  );
}
