import React, { useMemo } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Box, IconButton } from "@mui/material";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import Graph from "./Graph";

export default function ThreeGraphView({ data, onNodeClick }) {
  const center = data?.address || "";

  const children = useMemo(() => {
    if (!data) return [];
    const addrs = new Set();
    (data.sent || []).forEach((tx) => {
      if (tx?.to?.address && tx.to.address !== center) addrs.add(tx.to.address);
    });
    (data.received || []).forEach((tx) => {
      if (tx?.from?.address && tx.from.address !== center)
        addrs.add(tx.from.address);
    });
    return Array.from(addrs);
  }, [data, center]);

  const handleNodeSelect = (addr) => {
    if (onNodeClick) onNodeClick(addr);
  };

  // Tổng số node = 1 node trung tâm + children
  const totalNodes = 1 + children.length;

  // Log ra tổng số node
  console.log("[ThreeGraphView] Tổng số node:", totalNodes);

  return (
    <Box sx={{ flex: 1, overflow: "hidden", position: "relative" }}>
      <IconButton
        // Nếu cần mở sidebar thì implement thêm ở đây
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 10,
          bgcolor: "rgba(0,0,0,0.3)",
        }}
        size="small"
      >
        <MenuOpenIcon fontSize="small" />
      </IconButton>

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
        />
      </Canvas>
    </Box>
  );
}
