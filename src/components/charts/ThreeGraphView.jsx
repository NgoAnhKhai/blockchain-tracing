import React, { useMemo } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import Graph from "./Graph";
import { Box } from "@mui/material";

// Utility màu pastel
function randomPastelColor() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 72%, 74%)`;
}
function getHue(hsl) {
  return parseInt(hsl.match(/hsl\((\d+),/)[1], 10);
}
function gen2Colors() {
  let a = randomPastelColor();
  let b = randomPastelColor();
  while (Math.abs(getHue(a) - getHue(b)) < 70) b = randomPastelColor();
  return [a, b];
}

export default function ThreeGraphView({ data, onNodeClick }) {
  const center = data?.address || "";
  // children kèm type sent/received
  const children = useMemo(() => {
    if (!data) return [];
    const arr = [];
    const check = new Set();
    (data.sent || []).forEach((tx) => {
      if (
        tx?.to?.address &&
        tx.to.address !== center &&
        !check.has(tx.to.address)
      ) {
        arr.push({ address: tx.to.address, type: "sent" });
        check.add(tx.to.address);
      }
    });
    (data.received || []).forEach((tx) => {
      if (
        tx?.from?.address &&
        tx.from.address !== center &&
        !check.has(tx.from.address)
      ) {
        arr.push({ address: tx.from.address, type: "received" });
        check.add(tx.from.address);
      }
    });
    return arr;
  }, [data, center]);

  // Random màu sent/received mỗi lần mount
  const [sentColor, receivedColor] = useMemo(gen2Colors, [center]);

  const handleNodeSelect = (addr) => {
    if (onNodeClick) onNodeClick(addr);
  };

  return (
    <Box sx={{ flex: 1, overflow: "hidden", position: "relative" }}>
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputEncoding: THREE.sRGBEncoding,
        }}
        camera={{ position: [0, 0, 10], fov: 50 }}
        style={{ width: "100%", height: "100%" }}
      >
        <Environment preset="studio" />
        <ambientLight intensity={0.2} />
        <hemisphereLight skyColor="white" groundColor="black" intensity={0.2} />
        <directionalLight castShadow position={[5, 5, 5]} intensity={1} />
        <OrbitControls enablePan enableZoom />
        <Graph
          center={center}
          children={children}
          onNodeClick={handleNodeSelect}
          centerColor="#29fff6"
          sentColor={sentColor}
          receivedColor={receivedColor}
        />
      </Canvas>
      {/* Legend cho node */}
      <div
        style={{
          position: "absolute",
          right: 20,
          bottom: 16,
          zIndex: 22,
          background: "rgba(30,25,48,0.9)",
          padding: "12px 18px",
          borderRadius: 12,
          fontSize: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
          <span
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              marginRight: 8,
              background: "#29fff6",
              border: "2px solid #fff",
            }}
          />
          Main Node (center)
        </div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
          <span
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              marginRight: 8,
              background: sentColor,
            }}
          />
          Sent Node (sent)
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              marginRight: 8,
              background: receivedColor,
            }}
          />
          Received Node (received)
        </div>
      </div>
    </Box>
  );
}
