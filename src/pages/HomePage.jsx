
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

import SearchingBar from "../components/searching/SearchingBar";
import WeeklyAreaChart from "../components/charts/WeeklyAreaChart";
import LargeAreaChart from "../components/charts/LargeAreaChart";

const HomePage = () => {
  const theme = useTheme();

  // Dữ liệu bảng Recent Transaction (giữ nguyên)
  const transactionData = [
    {
      hash: "0x22f8...d123",
      from: "06fa...e07",
      to: "06fa...e07",
      amount: "3.36 ETH",
      time: "2 sec ago",
    },
    {
      hash: "0x22f8...a523",
      from: "06fa...e07",
      to: "06fa...e07",
      amount: "1.35 ETH",
      time: "2 sec ago",
    },
    {
      hash: "0x22f8...a623",
      from: "06fa...e07",
      to: "06fa...e07",
      amount: "1.53 ETH",
      time: "2 sec ago",
    },
  ];

  // Dữ liệu bảng Risk Alerts (giữ nguyên)
  const alertData = [
    {
      severity: "Medium",
      wallet: "06fa...e07",
      type: "Large Transaction",
      time: "2 hrs ago",
    },
    {
      severity: "Medium",
      wallet: "06fa...e07",
      type: "Surge in Activity",
      time: "2 hrs ago",
    },
    {
      severity: "High",
      wallet: "06fa...ea9",
      type: "Surge in Activity",
      time: "2 hrs ago",
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Searching Bar */}
      <Box sx={{ display: "flex", }}>
        <SearchingBar />
      </Box>

      {/* Row 1: Large Area Chart + Weekly Area Chart */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Card sx={{ flex: 1, backgroundColor: theme.palette.background.paper }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Transaction Overview
            </Typography>
            <LargeAreaChart />
          </CardContent>
        </Card>

        {/* Card 2: 7 ngày */}
        <Card sx={{ flex: 1, backgroundColor: theme.palette.background.paper }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Risk Alerts (Last 7 Days)
            </Typography>
            <WeeklyAreaChart />
          </CardContent>
        </Card>
      </Box>

      {/* Row 2: Recent Transaction + Risk Alerts Table */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Card sx={{ flex: 2, backgroundColor: theme.palette.background.paper }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Transaction
            </Typography>
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
            <Typography variant="h6" gutterBottom>
              Risk Alerts
            </Typography>
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
