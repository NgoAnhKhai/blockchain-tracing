import React, { useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import Graph from "../components/charts/Graph";
import SearchingBar from "../components/searching/SearchingBar";
import RightSideBar from "../components/sidebar/RightSideBar";

import { Box, IconButton } from "@mui/material";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";

export default function WalletGraphPage() {
  const center = "0x033cd";
  const children = [
    "0x203e...323",
    "0x2038...892",
    "0x203ed...143",
    "0x196lej...332",
    "0x13u4f...713",
    "0x103ed...313",
    "0x103ed...313",
    "0x103ed...313",
    "0x103ed...313",
    "0x103ed...313",
    "0x103ed...313",
    "0x103ed...313",
    "0x103ed...313",
    "0x103ed...313",
  ];

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [txs, setTxs] = useState([]);

  const handleNodeSelect = (addr) => {
    setSelectedNode(addr);
    setTxs([
      {
        id: "0xabc123",
        direction: "out",
        amount: 1.2,
        count: 3,
        last: "2025-06-10 12:00",
      },
      {
        id: "0xdef456",
        direction: "in",
        amount: 0.5,
        count: 1,
        last: "2025-06-09 16:45",
      },
    ]);
    setSidebarOpen(true);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Search Bar */}
      <Box sx={{ flex: "0 0 auto" }}>
        <SearchingBar />
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, position: "relative", display: "flex" }}>
        {/* Canvas */}
        <Box sx={{ flex: 1, overflow: "hidden" /* chỉ chặn canvas thôi */ }}>
          <IconButton
            onClick={() => setSidebarOpen(true)}
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
            <hemisphereLight
              skyColor="white"
              groundColor="black"
              intensity={0.2}
            />
            <directionalLight castShadow position={[5, 5, 5]} intensity={1} />
            <OrbitControls enablePan enableZoom />

            {/* pass onNodeClick để click node cũng mở sidebar */}
            <Graph
              center={center}
              children={children}
              onNodeClick={handleNodeSelect}
            />
          </Canvas>
        </Box>

        {/* Drawer nằm ngoài vùng overflow: hidden */}
        <RightSideBar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          selectedNode={selectedNode}
          transactions={txs}
        />
      </Box>
    </Box>
  );
}
