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
  useTheme,
} from "@mui/material";
import ReactECharts from "echarts-for-react";
import SearchingBar from "../components/searching/SearchingBar";

const HomePage = () => {
  const theme = useTheme();

  const transactionData = [
    { hash: "0x22f8...d123", from: "06fa...e07", to: "06fa...e07", amount: "3.36 ETH", time: "2 sec ago" },
    { hash: "0x22f8...a523", from: "06fa...e07", to: "06fa...e07", amount: "1.35 ETH", time: "2 sec ago" },
    { hash: "0x22f8...a623", from: "06fa...e07", to: "06fa...e07", amount: "1.53 ETH", time: "2 sec ago" },
  ];

  const alertData = [
    { severity: "Medium", wallet: "06fa...e07", type: "Large Transaction", time: "2 hrs ago" },
    { severity: "Medium", wallet: "06fa...e07", type: "Surge in Activity", time: "2 hrs ago" },
    { severity: "High", wallet: "06fa...ea9", type: "Surge in Activity", time: "2 hrs ago" },
  ];

  const lineChartOption = {
    backgroundColor: theme.palette.background.paper,
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: ["1", "2", "3", "4", "5", "6", "7"],
      boundaryGap: false,
      axisLine: { lineStyle: { color: theme.palette.text.primary } },
      axisLabel: { color: theme.palette.text.primary },
    },
    yAxis: {
      type: "value",
      axisLine: { lineStyle: { color: theme.palette.text.primary } },
      axisLabel: { color: theme.palette.text.primary },
      splitLine: { lineStyle: { color: theme.palette.divider } },
    },
    series: [
      {
        data: [50, 80, 40, 120, 90, 60, 85],
        type: "line",
        smooth: true,
        lineStyle: { color: "#00ff66", width: 2 },
        areaStyle: { color: "rgba(0,255,102,0.1)" },
        symbol: "none",
      },
    ],
    grid: { left: 10, right: 10, bottom: 20, top: 30, containLabel: true },
  };

  const areaChartOption = {
    backgroundColor: theme.palette.background.paper,
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      boundaryGap: false,
      axisLine: { lineStyle: { color: theme.palette.text.primary } },
      axisLabel: { color: theme.palette.text.primary },
    },
    yAxis: {
      type: "value",
      axisLine: { lineStyle: { color: theme.palette.text.primary } },
      axisLabel: { color: theme.palette.text.primary },
      splitLine: { lineStyle: { color: theme.palette.divider } },
    },
    series: [
      {
        data: [10, 15, 30, 40, 60, 50, 70],
        type: "line",
        smooth: true,
        symbol: "none",
        lineStyle: { color: "#ff4d88" },
        areaStyle: {
          color: theme.palette.mode === 'dark'
            ? 'rgba(255, 77, 136, 0.3)'
            : 'rgba(255, 77, 136, 0.4)',
        },
      },
    ],
    grid: { left: 10, right: 10, bottom: 20, top: 30, containLabel: true },
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Searching Bar */}
      <Box sx={{ display: "flex" }}>
        <SearchingBar />
      </Box>

      {/* Row 1: Line Chart + Area Chart */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Card sx={{ flex: 1, backgroundColor: theme.palette.background.paper }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Transaction Overview</Typography>
            <ReactECharts option={lineChartOption} style={{ height: 200 }} />
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, backgroundColor: theme.palette.background.paper }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Risk Alerts (Last 7 Days)</Typography>
            <ReactECharts option={areaChartOption} style={{ height: 200 }} />
          </CardContent>
        </Card>
      </Box>

      {/* Row 2: Table Transaction + Table Risk */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Card sx={{ flex: 2, backgroundColor: theme.palette.background.paper }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Recent Transaction</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Tx Hash</TableCell>
                  <TableCell>From</TableCell>
                  <TableCell>To</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactionData.map((tx, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{tx.hash}</TableCell>
                    <TableCell>{tx.from}</TableCell>
                    <TableCell>{tx.to}</TableCell>
                    <TableCell>{tx.amount}</TableCell>
                    <TableCell>{tx.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, backgroundColor: theme.palette.background.paper }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Risk Alerts</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Severity</TableCell>
                  <TableCell>Wallet</TableCell>
                  <TableCell>Alert Type</TableCell>
                  <TableCell>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {alertData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Chip
                        label={row.severity}
                        color={row.severity === "High" ? "error" : "warning"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{row.wallet}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default HomePage;
