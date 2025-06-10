import React, { useRef, useState } from "react";
import { Html, useCursor } from "@react-three/drei";

export default function Node({
  address,
  position,
  isCenter = false,
  onHover = () => {},
}) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  useCursor(hovered, "pointer", "auto");
  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHovered(true);
    onHover(true);
  };
  const handlePointerOut = (e) => {
    e.stopPropagation();
    setHovered(false);
    onHover(false);
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={isCenter ? 1.5 : 0.7}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshPhysicalMaterial
        color={isCenter ? "#00ffff" : hovered ? "#66ffff" : "#0088aa"}
        emissive={isCenter ? "#0088aa" : "#005566"}
        metalness={isCenter ? 1 : 0.5}
        roughness={isCenter ? 0 : 0.2}
        clearcoat={isCenter ? 1 : 0.3}
        clearcoatRoughness={isCenter ? 0 : 0.2}
      />

      {/* Tooltip 2D */}
      <Html
        transform={false}
        wrapperClass="tooltip-wrapper"
        style={{
          opacity: hovered ? 1 : 0,
          transform: hovered
            ? "translateY(-12px) scale(1)"
            : "translateY(0px) scale(0.8)",
          transition: "opacity 0.25s ease, transform 0.25s ease",
          pointerEvents: "none",
        }}
        position={[0, 0.6, 0]}
      >
        <div
          style={{
            background: "rgba(0,0,0,0.75)",
            color: "#fff",
            padding: "4px 8px",
            borderRadius: "4px",
            whiteSpace: "nowrap",
            fontSize: isCenter ? "1rem" : "0.8rem",
          }}
        >
          {address}
        </div>
      </Html>
    </mesh>
  );
}
