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
import SmallLoader from "../components/loading/SmallLoader";

const RECENT_COUNT = 8;

const HomePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
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
      setLoading(true);
      getTxList(selectedWallet.address).then((txs) => {
        setTxList(txs);
        setLoading(false);
      });
    }
  }, [selectedWallet]);

  const oneYearAgo = Date.now() - 365 * 24 * 3600 * 1000;
  const filteredTx = useMemo(
    () => txList.filter((tx) => tx.timeStamp * 1000 >= oneYearAgo),
    [txList]
  );

  const sortedTx = useMemo(
    () => [...filteredTx].sort((a, b) => b.timeStamp - a.timeStamp),
    [filteredTx]
  );

  const recentTx = useMemo(() => sortedTx.slice(0, RECENT_COUNT), [sortedTx]);

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
        <Card sx={{ flex: 1, backgroundColor: "rgba(70, 14, 82, 0.08)" }}>
          <CardContent
            sx={{
              minHeight: 220,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {loading ? <SmallLoader /> : <LargeAreaChart txList={txList} />}
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, backgroundColor: "rgba(70, 14, 82, 0.08)" }}>
          <CardContent
            sx={{
              minHeight: 220,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {loading ? <SmallLoader /> : <WeeklyAreaChart txList={txList} />}
          </CardContent>
        </Card>
      </Box>

      {/* Recent Transactions & Risk Alerts */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        {/* Recent Transactions */}
        <Card
          sx={{
            flex: 2,
            position: "relative",
            backgroundColor: "rgba(70, 14, 82, 0.08)",
          }}
        >
          <CardContent
            sx={{ minHeight: 270, display: "flex", flexDirection: "column" }}
          >
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
            {loading ? (
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 160,
                }}
              >
                <SmallLoader />
              </Box>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Tx Hash</TableCell>
                    <TableCell sx={{ color: "#F028FD" }}>From</TableCell>
                    <TableCell>To</TableCell>
                    <TableCell sx={{ color: "#fd4d85" }}>Amount</TableCell>
                    <TableCell>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentTx.map((tx, idx) => (
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
                      <TableCell
                        sx={{
                          color: "#F028FD",
                          fontWeight: 700,
                          letterSpacing: 0.5,
                        }}
                      >
                        {tx.from.slice(0, 10)}…
                      </TableCell>
                      <TableCell>{tx.to?.slice(0, 10)}…</TableCell>
                      <TableCell
                        sx={{
                          color: "#fd4d85",
                          fontWeight: 700,
                          letterSpacing: 0.5,
                        }}
                      >
                        {(parseFloat(tx.value) / 1e18).toFixed(4)} ETH
                      </TableCell>
                      <TableCell>
                        {new Date(tx.timeStamp * 1000).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Risk Alerts */}
        <Card
          sx={{
            flex: 1,
            position: "relative",
            backgroundColor: "rgba(70, 14, 82, 0.08)",
          }}
        >
          <CardContent
            sx={{ minHeight: 270, display: "flex", flexDirection: "column" }}
          >
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
            {loading ? (
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 120,
                }}
              >
                <SmallLoader />
              </Box>
            ) : (
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
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default HomePage;
