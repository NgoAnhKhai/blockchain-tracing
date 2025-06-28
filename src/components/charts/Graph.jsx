import React, { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import Node from "../Node";
import ParticleEdge from "./ParticleEdge";

export default function Graph({
  center,
  children,
  onNodeClick,
  centerColor = "#29fff6",
  sentColor,
  receivedColor,
}) {
  const groupRef = useRef();
  const [isPaused, setIsPaused] = useState(false);
  const rotRef = useRef(0);

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

  useFrame((_, delta) => {
    if (!isPaused && groupRef.current) {
      rotRef.current += delta * 0.2;
      groupRef.current.rotation.y = rotRef.current;
    }
  });

  const handleHover = (flag) => setIsPaused(flag);

  return (
    <group ref={groupRef}>
      {/* Node trung tâm */}
      <Node
        address={center}
        position={[0, 0, 0]}
        isCenter
        nodeColor={centerColor}
        onHover={handleHover}
        onClick={() => onNodeClick && onNodeClick(center)}
      />

      {children.map((item, i) => (
        <group key={item.address}>
          <ParticleEdge
            start={[0, 0, 0]}
            end={positions[i]}
            speed={0.5}
            radius={0.02}
            particleRadius={0.08}
          />
          <Node
            address={item.address}
            position={positions[i]}
            nodeColor={item.type === "sent" ? sentColor : receivedColor}
            onHover={handleHover}
            onClick={() => onNodeClick && onNodeClick(item.address)}
          />
        </group>
      ))}
    </group>
  );
}
