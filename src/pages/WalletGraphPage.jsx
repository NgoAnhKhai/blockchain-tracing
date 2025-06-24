import React, { useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";
import ThreeGraphView from "../components/charts/ThreeGraphView";
import D3GraphView from "../components/charts/D3GraphView";
import RightSideBar from "../components/sidebar/RightSideBar";
import { useViewMode } from "../context/ViewModeContext";
import { useAddressSearch } from "../context/AddressSearchContext";
import { getTraceWallet } from "../services/dgraph/GetTraceWallet";

export default function WalletGraphPage() {
  const { viewMode } = useViewMode();
  const { address } = useAddressSearch();
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [txs, setTxs] = useState([]);

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    setGraphData(null);

    // Tạo 1 async function bên trong useEffect
    const fetchData = async () => {
      try {
        const res = await getTraceWallet(address);

        console.log("Graph Data: ", res);
        const data = res[0] || null;
        setGraphData(data);
      } catch (error) {
        setGraphData(null);
        console.error("API getTraceWallet error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [address]);

  const handleNodeClick = (addr) => {
    setSelectedNode(addr);
    setTxs([]);
    setSidebarOpen(true);
  };

  const totalNodeCount = useMemo(() => {
    if (!graphData) return 0;
    const sent = graphData.sent ?? [];
    const received = graphData.received ?? [];
    const addrs = new Set();

    sent.forEach((tx) => addrs.add(tx.to?.address));
    received.forEach((tx) => addrs.add(tx.from?.address));

    // Log ra cho dễ kiểm tra
    console.log("All unique node addresses:", Array.from(addrs));
    console.log("Total nodes:", 1 + addrs.size);

    return 1 + addrs.size; // 1 là node trung tâm
  }, [graphData]);

  const show3D =
    graphData && typeof totalNodeCount === "number" && totalNodeCount <= 100;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ flex: 1, display: "flex", position: "relative" }}>
        {loading && (
          <Box
            sx={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
              bgcolor: "rgba(255,255,255,0.65)",
            }}
          >
            Đang tải dữ liệu...
          </Box>
        )}
        {!loading && graphData ? (
          show3D && viewMode === "3d" ? (
            <ThreeGraphView data={graphData} onNodeClick={handleNodeClick} />
          ) : (
            <D3GraphView data={graphData} onNodeClick={handleNodeClick} />
          )
        ) : (
          !loading && (
            <Box
              sx={{
                width: "100%",
                minHeight: 360,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#bbb",
              }}
            >
              {!address
                ? "Nhập địa chỉ ví để xem mạng lưới giao dịch"
                : "Không có dữ liệu"}
            </Box>
          )
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
