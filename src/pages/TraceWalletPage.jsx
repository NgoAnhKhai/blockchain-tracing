
import React from "react";
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
} from "@mui/material";
import ChartMoneyFlow from "../components/charts/ChartMoneyFlow";

const TraceWalletPage = () => {
  const theme = useTheme();

  // Dữ liệu tạm cho Wallet Overview
  const walletOverview = {
    totalTx: 143,
    totalReceived: "6.5 ETH",
    totalSent: "5.1 ETH",
    chain: "ETH",
    lastActive: "Active 2 years ago • 5 mins ago",
  };

  // Dữ liệu tạm cho Transaction List (có thể thay bằng prop hoặc after API)
  const transactionList = [
    {
      hash: "0x9...23",
      from: "0x06fa...e07",
      to: "0x06fa...e07",
      amount: "5 ETH",
      token: "ETH",
      time: "Just now",
    },
    {
      hash: "0x9...23",
      from: "0x06fa...e07",
      to: "0x06fa...e07",
      amount: "1.53 ETH",
      token: "ETH",
      time: "2 mins ago",
    },
    {
      hash: "0x9...23",
      from: "0x06fa...e07",
      to: "0x06fa...e07",
      amount: "1 ETH",
      token: "ETH",
      time: "5 mins ago",
    },
    // Bạn có thể thêm nhiều dòng giả lập hơn
  ];

  // Dữ liệu tạm cho Related Alerts
  const relatedAlerts = [
    { severity: "Medium", type: "Large Transaction", time: "2 hrs ago" },
    { severity: "High", type: "Surge in Activity", time: "3 hrs ago" },
    { severity: "Medium", type: "Unusual Behavior", time: "1 day ago" },
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
              {/* Dòng 3 card nhỏ */}
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", my: 1 }}>
                <Card
                  sx={{
                    flex: 1,
                    minWidth: 100,
                    bgcolor:
                      theme.palette.mode === "dark" ? "#2e2e2e" : "#f5f5f5",
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle2">
                      Total Transactions
                    </Typography>
                    <Typography variant="h5">
                      {walletOverview.totalTx}
                    </Typography>
                  </CardContent>
                </Card>
                <Card
                  sx={{
                    flex: 1,
                    minWidth: 100,
                    bgcolor:
                      theme.palette.mode === "dark" ? "#2e2e2e" : "#f5f5f5",
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle2">Total Received</Typography>
                    <Typography variant="h5">
                      {walletOverview.totalReceived}
                    </Typography>
                  </CardContent>
                </Card>
                <Card
                  sx={{
                    flex: 1,
                    minWidth: 100,
                    bgcolor:
                      theme.palette.mode === "dark" ? "#2e2e2e" : "#f5f5f5",
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle2">Total Sent</Typography>
                    <Typography variant="h5">
                      {walletOverview.totalSent}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>

              <Divider sx={{ my: 1 }} />

              {/* Dòng ETH + last active */}
              <Typography variant="subtitle2">
                {walletOverview.chain}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {walletOverview.lastActive}
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

              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Tx Hash</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>From</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>To</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Token</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactionList.map((tx, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{tx.hash}</TableCell>
                      <TableCell>{tx.from}</TableCell>
                      <TableCell>{tx.to}</TableCell>
                      <TableCell>{tx.amount}</TableCell>
                      <TableCell>{tx.token}</TableCell>
                      <TableCell>{tx.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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

              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Severity</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Alert Type
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {relatedAlerts.map((alert, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <Chip
                          label={alert.severity}
                          color={
                            alert.severity === "High"
                              ? "error"
                              : alert.severity === "Medium"
                              ? "warning"
                              : "default"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{alert.type}</TableCell>
                      <TableCell>{alert.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default TraceWalletPage;
