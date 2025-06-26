import React, { useRef, useState } from "react";
import { Html, useCursor } from "@react-three/drei";

export default function Node({
  address,
  position,
  isCenter = false,
  nodeColor = "#00ffff",
  onHover = () => {},
  onClick,
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

  // Làm màu hover sáng lên một chút
  function lighten(color) {
    try {
      let col = color.replace("hsl(", "").replace(")", "").split(",");
      let l = Math.min(parseInt(col[2], 10) + 12, 90);
      return `hsl(${col[0]},${col[1]},${l}%)`;
    } catch {
      return color;
    }
  }

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={isCenter ? 1.5 : 0.7}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={onClick}
    >
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshPhysicalMaterial
        color={hovered ? lighten(nodeColor) : nodeColor}
        emissive={isCenter ? "#0088aa" : "#003344"}
        metalness={isCenter ? 1 : 0.7}
        roughness={isCenter ? 0.13 : 0.2}
        clearcoat={isCenter ? 1 : 0.5}
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
