import React, { useEffect, useMemo, useState } from "react";
import ThreeGraphView from "../components/charts/ThreeGraphView";
import D3GraphView from "../components/charts/D3GraphView";
import RightSideBar from "../components/sidebar/RightSideBar";
import { useViewMode } from "../context/ViewModeContext";
import { useAddressSearch } from "../context/AddressSearchContext";
import { getTraceWallet } from "../services/dgraph/GetTraceWallet";
import { GetWalletTransaction } from "../services/dgraph/GetWalletTransaction";
import { Box, IconButton } from "@mui/material";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import BlockchainLoading from "../components/loading/BlockchainLoading";

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

    const fetchData = async () => {
      try {
        await GetWalletTransaction(address);
        const res = await getTraceWallet(address.toLowerCase());
        setGraphData(res || null);
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
    return 1 + addrs.size; // 1 là node trung tâm
  }, [graphData]);

  const show3D =
    graphData && typeof totalNodeCount === "number" && totalNodeCount <= 100;

  // ==== Đây là nút menu mở sidebar ====
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Menu IconButton cố định ở cạnh phải */}
      <IconButton
        sx={{
          position: "fixed",
          bottom: "50%",
          right: 20,
          zIndex: 1202,
          bgcolor: "rgba(0,0,0,0.34)",
          color: "#fff",
          boxShadow: "0 2px 16px #0004",
          ":hover": { bgcolor: "rgba(80,80,120,0.72)" },
        }}
        size="large"
        onClick={() => setSidebarOpen((prev) => !prev)}
        aria-label="Toggle sidebar"
      >
        <MenuOpenIcon fontSize="large" />
      </IconButton>

      <Box sx={{ flex: 1, display: "flex", position: "relative" }}>
        {loading && (
          <Box
            sx={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              zIndex: 99,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BlockchainLoading />
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
