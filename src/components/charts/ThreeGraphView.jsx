import React, { useMemo } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import Graph from "./Graph";
import { Box, useTheme } from "@mui/material";

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
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const center = data?.address || "";

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

  const [sentColor, receivedColor] = useMemo(gen2Colors, [center]);

  const handleNodeSelect = (addr) => {
    if (onNodeClick) onNodeClick(addr);
  };

  // CHỌN MÀU LEGEND THEO THEME
  const legendBg = isDark ? "rgba(32,28,54,0.93)" : "rgba(255,255,255,0.92)";
  const legendBorder = isDark ? "#4736a1" : "#e7dafc";
  const textColor = isDark ? "#fff" : "#2c1860";
  const nodeBorder = isDark ? "#fff" : "#432381";
  const centerNodeColor = "#29fff6";

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
          centerColor={centerNodeColor}
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
          background: legendBg,
          color: textColor,
          padding: "13px 19px",
          borderRadius: 12,
          fontSize: 14,
          border: `1.5px solid ${legendBorder}`,
          boxShadow: isDark ? "0 4px 18px #4328b322" : "0 2px 14px #c9b1ff22",
          minWidth: 160,
          transition: "background 0.3s, border 0.3s, color 0.3s",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
          <span
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              marginRight: 10,
              background: centerNodeColor,
              border: `2.5px solid ${nodeBorder}`,
              boxShadow: isDark
                ? "0 2px 10px #23f5ef55"
                : "0 1px 5px #29fff677",
            }}
          />
          <span>Main Node (center)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
          <span
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              marginRight: 10,
              background: sentColor,
              border: `2.5px solid ${nodeBorder}`,
            }}
          />
          <span>Sent Node (sent)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              marginRight: 10,
              background: receivedColor,
              border: `2.5px solid ${nodeBorder}`,
            }}
          />
          <span>Received Node (received)</span>
        </div>
      </div>
    </Box>
  );
}
