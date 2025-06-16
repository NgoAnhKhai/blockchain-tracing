import React, { useEffect, useState, useMemo } from "react";
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
  IconButton,
  Chip,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import WalletSelector from "../components/WalletSelector";
import LargeAreaChart from "../components/charts/LargeAreaChart";
import WeeklyAreaChart from "../components/charts/WeeklyAreaChart";
import { getTxList } from "../services/GetPopularWallet";

const HomePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [selectedWallet, setSelectedWallet] = useState(null);
  const [txList, setTxList] = useState([]);

  useEffect(() => {
    if (!selectedWallet) {
      setSelectedWallet({
        label: "Vitalik Buterin",
        address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
      });
    }
  }, [selectedWallet]);

  useEffect(() => {
    if (selectedWallet) {
      getTxList(selectedWallet.address).then((txs) => {
        setTxList(txs);
      });
    }
  }, [selectedWallet]);

  // Lọc 1 năm gần nhất
  const oneYearAgo = Date.now() - 365 * 24 * 3600 * 1000;
  const filteredTx = useMemo(
    () => txList.filter((tx) => tx.timeStamp * 1000 >= oneYearAgo),
    [txList]
  );

  const handleExpand = (route) => {
    navigate(`${route}?address=${selectedWallet.address}`);
  };

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
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Selector */}
      <Box sx={{ px: 3, pt: 1, display: "flex", justifyContent: "flex-end" }}>
        <WalletSelector
          selected={selectedWallet}
          onSelect={setSelectedWallet}
        />
      </Box>

      {/* Charts */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Card sx={{ flex: 1, bgcolor: theme.palette.background.paper }}>
          <CardContent>
            <LargeAreaChart txList={txList} />
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, bgcolor: theme.palette.background.paper }}>
          <CardContent>
            <WeeklyAreaChart txList={txList} />
          </CardContent>
        </Card>
      </Box>

      {/* Recent Transactions & Risk Alerts */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Card
          sx={{
            flex: 2,
            position: "relative",
            bgcolor: theme.palette.background.paper,
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Recent Transactions</Typography>
              <IconButton
                size="small"
                onClick={() => handleExpand("/transactions")}
              >
                <OpenInNewIcon />
              </IconButton>
            </Box>
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
                {filteredTx.map((tx, idx) => (
                  <TableRow
                    key={idx}
                    hover
                    sx={{
                      "&:nth-of-type(odd)": {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <TableCell>{tx.hash.slice(0, 12)}…</TableCell>
                    <TableCell>{tx.from.slice(0, 10)}…</TableCell>
                    <TableCell>{tx.to?.slice(0, 10)}…</TableCell>
                    <TableCell>
                      {(parseFloat(tx.value) / 1e18).toFixed(4)} ETH
                    </TableCell>
                    <TableCell>
                      {new Date(tx.timeStamp * 1000).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card
          sx={{
            flex: 1,
            position: "relative",
            bgcolor: theme.palette.background.paper,
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Risk Alerts</Typography>
              <IconButton size="small" onClick={() => handleExpand("/alerts")}>
                <OpenInNewIcon />
              </IconButton>
            </Box>
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
                  <TableRow
                    key={idx}
                    sx={{
                      "&:nth-of-type(odd)": {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
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
