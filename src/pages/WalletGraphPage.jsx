import React, { useState } from "react";
import { Box } from "@mui/material";
import ThreeGraphView from "../components/charts/ThreeGraphView";
import D3GraphView from "../components/charts/D3GraphView";
import RightSideBar from "../components/sidebar/RightSideBar";
import { useViewMode } from "../context/ViewModeContext";

export default function WalletGraphPage() {
  const { viewMode } = useViewMode();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [txs, setTxs] = useState([]);

  const handleNodeClick = (addr) => {
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
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ flex: 1, display: "flex", position: "relative" }}>
        {viewMode === "3d" ? (
          <ThreeGraphView onNodeClick={handleNodeClick} />
        ) : (
          <D3GraphView onNodeClick={handleNodeClick} />
        )}
      </Box>
      <RightSideBar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        selectedNode={selectedNode}
        transactions={txs}
      />
    </Box>
  );
}
