import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Divider,
  useTheme,
  Skeleton,
} from "@mui/material";
import ChartMoneyFlow from "../components/charts/ChartMoneyFlow";
import { useParams } from "react-router-dom";
import { GetDetailAddress } from "../services/dgraph/GetDetailAddress";

const TraceWalletPage = () => {
  const theme = useTheme();
  const { address } = useParams();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  // Call API when address param changes
  useEffect(() => {
    async function fetchDetail() {
      setLoading(true);
      const res = await GetDetailAddress(address);
      console.log("res:", res);
      setDetail(res?.data?.data);
      setLoading(false);
    }
    if (address) fetchDetail();
  }, [address]);

  // Mapping overview cards
  const overviewCards = [
    {
      label: "Normal Txns",
      value: detail?.normalTxCount ?? "--",
      color: "#ff4d88",
    },
    {
      label: "Internal Txns",
      value: detail?.internalTxCount ?? "--",
      color: "#00ffe7",
    },
    {
      label: "Blocks",
      value: detail?.blockCount ?? "--",
      color: "#bb86fc",
    },
    {
      label: "Tokens",
      value: detail?.tokenCount ?? "--",
      color: "#ffbc00",
    },
  ];

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
        minHeight: "100vh",
      }}
    >
      {/* Container chính */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* === ROW 1: Wallet Overview & Money Flow Chart === */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          {/* Wallet Overview */}
          <Card
            sx={{ flex: 1, backgroundColor: theme.palette.background.paper }}
          >
            <CardContent>
              <Typography variant="h6" mb={2}>
                Wallet:{" "}
                <span style={{ fontFamily: "monospace" }}>
                  {address?.slice(0, 12)}...
                </span>
              </Typography>

              {loading ? (
                <Box sx={{ display: "flex", gap: 1 }}>
                  {[1, 2, 3, 4].map((_, idx) => (
                    <Skeleton
                      variant="rectangular"
                      key={idx}
                      width={110}
                      height={70}
                      sx={{ borderRadius: 3 }}
                    />
                  ))}
                </Box>
              ) : (
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 1 }}>
                  {overviewCards.map((c) => (
                    <Card
                      key={c.label}
                      sx={{
                        flex: 1,
                        minWidth: 110,
                        bgcolor:
                          theme.palette.mode === "dark" ? "#2e2e2e" : "#f5f5f5",
                        border: `2px solid ${c.color}`,
                        borderRadius: 3,
                        textAlign: "center",
                        boxShadow: "0 2px 10px 0 #e9e9e926",
                      }}
                    >
                      <CardContent sx={{ py: 1 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{ color: c.color, fontWeight: 700 }}
                        >
                          {c.label}
                        </Typography>
                        <Typography variant="h5" fontWeight={900}>
                          {c.value}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}

              <Divider sx={{ my: 1 }} />

              <Typography variant="subtitle2" color="text.secondary">
                Data is synced from blockchain to graphDB.
              </Typography>
            </CardContent>
          </Card>

          {/* Money Flow Chart */}
          <Card
            sx={{ flex: 2, backgroundColor: theme.palette.background.paper }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Money Flow
              </Typography>
              <ChartMoneyFlow />
            </CardContent>
          </Card>
        </Box>

        {/* === ROW 2: Transaction List & Related Alerts === */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          {/* Transaction List */}
          <Card
            sx={{ flex: 2, backgroundColor: theme.palette.background.paper }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="h6">Transaction List</Typography>
                <Typography
                  variant="body2"
                  sx={{ cursor: "pointer", color: theme.palette.primary.main }}
                >
                  Expand
                </Typography>
              </Box>
              {/* Nếu chưa có API transactions, để placeholder: */}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center", my: 5 }}
              >
                Coming soon...
              </Typography>
            </CardContent>
          </Card>

          {/* Related Alerts */}
          <Card
            sx={{ flex: 1, backgroundColor: theme.palette.background.paper }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="h6">Related Alerts</Typography>
                <Typography
                  variant="body2"
                  sx={{ cursor: "pointer", color: theme.palette.primary.main }}
                >
                  Expand
                </Typography>
              </Box>
              {/* Nếu chưa có API alerts, để placeholder: */}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center", my: 5 }}
              >
                Coming soon...
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default TraceWalletPage;
