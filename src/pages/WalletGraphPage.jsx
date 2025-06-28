import React, { useEffect, useMemo, useState } from "react";
import ThreeGraphView from "../components/charts/ThreeGraphView";
import D3GraphView from "../components/charts/D3GraphView";
import RightSideBar from "../components/sidebar/RightSideBar";
import { useViewMode } from "../context/ViewModeContext";
import { useAddressSearch } from "../context/AddressSearchContext";
import { getTraceWallet } from "../services/dgraph/GetTraceWallet";
import { GetWalletTransaction } from "../services/dgraph/GetWalletTransaction";
import { Box, IconButton, Chip, Tooltip, Fade } from "@mui/material";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import BlockchainLoading from "../components/loading/BlockchainLoading";

export default function WalletGraphPage() {
  const { viewMode } = useViewMode();
  const { address } = useAddressSearch();
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [txs, setTxs] = useState([]);
  const [txLoading, setTxLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Lấy dữ liệu chính
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

  // Xử lý click node
  const handleNodeClick = async (addr) => {
    setSelectedNode(addr);
    setSidebarOpen(true);
    setTxs([]);
    setTxLoading(true);
    try {
      const txRes = await GetWalletTransaction(addr);
      setTxs(txRes.walletData || []);
    } catch (e) {
      setTxs([]);
    } finally {
      setTxLoading(false);
    }
  };

  // Đếm node
  const totalNodeCount = useMemo(() => {
    if (!graphData) return 0;
    const sent = graphData.sent ?? [];
    const received = graphData.received ?? [];
    const addrs = new Set();
    sent.forEach((tx) => addrs.add(tx.to?.address));
    received.forEach((tx) => addrs.add(tx.from?.address));
    return 1 + addrs.size;
  }, [graphData]);

  const show3D =
    graphData && typeof totalNodeCount === "number" && totalNodeCount <= 100;

  // Xử lý copy ví + hiệu ứng copied
  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1100);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Nút mở sidebar cố định */}
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

      {/* Chip: Đang xem địa chỉ ví nào */}
      {address && (
        <Fade in>
          <Box
            sx={{
              width: "100%",
              mt: 2,
              mb: 1,
              display: "flex",
              justifyContent: "center",
              pointerEvents: "none",
              zIndex: 9,
              position: "relative",
            }}
          >
            <Chip
              sx={{
                px: 2.4,
                py: 2,
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: 0.5,
                background: "linear-gradient(90deg,#341d6b 60%,#a076ff 110%)",
                color: "#fff",
                boxShadow: "0 4px 20px #a076ff22",
                border: "none",
                borderRadius: "14px",
                minHeight: 48,
                maxWidth: 520,
                fontFamily: "monospace",
                pointerEvents: "auto",
              }}
              label={
                <span>
                  <span
                    style={{
                      color: "#ffe4fc",
                      marginRight: 8,
                      fontWeight: 600,
                      textShadow: "0 1px 4px #43295a77",
                    }}
                  >
                    Đang xem:
                  </span>
                  {address.slice(0, 9)}...{address.slice(-7)}
                </span>
              }
              icon={
                <Tooltip
                  title={copied ? "Đã copy!" : "Copy address"}
                  arrow
                  open={copied ? true : undefined}
                >
                  <IconButton
                    onClick={handleCopy}
                    sx={{
                      color: copied ? "#37ffc6" : "#fff",
                      ml: 1,
                      p: 0.6,
                      "&:hover": { color: "#a076ff", bgcolor: "#fff1" },
                      pointerEvents: "auto",
                    }}
                    size="small"
                  >
                    <ContentCopyIcon sx={{ fontSize: 19 }} />
                  </IconButton>
                </Tooltip>
              }
            />
          </Box>
        </Fade>
      )}

      {/* Graph content */}
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

      {/* Sidebar chi tiết node */}
      <RightSideBar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        walletData={txs}
        loading={txLoading}
      />
    </Box>
  );
}
