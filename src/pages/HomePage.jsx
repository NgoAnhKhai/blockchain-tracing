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
  Tooltip,
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
  function shortHash(str) {
    if (!str) return "";
    return str.slice(0, 10) + "…" + str.slice(-6);
  }
  function shortAddr(str) {
    if (!str) return "";
    return str.slice(0, 8) + "…" + str.slice(-4);
  }
  function formatBigNumber(num) {
    num = Number(num);
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
    return num?.toFixed?.(4) || num;
  }
  const isImportant = (tx) => parseFloat(tx.value) / 1e18 > 100;

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
            background: "linear-gradient(90deg, #19183b 70%, #31236b 100%)",
            borderRadius: 3,
            boxShadow: "0 4px 32px #2ec7fd18",
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
                mb: 1,
              }}
            >
              <Typography
                variant="h6"
                fontWeight={900}
                sx={{
                  fontFamily: "Inter, monospace",
                  color: "#23e6ff",
                  letterSpacing: 1,
                }}
              >
                Recent Transactions
              </Typography>
              <IconButton
                size="small"
                onClick={() => handleExpand("/transactions")}
                sx={{
                  bgcolor: "#262152",
                  color: "#23e6ff",
                  borderRadius: 2,
                  "&:hover": { bgcolor: "#341f78" },
                }}
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
              <Table size="small" sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow
                    sx={{
                      "& th": {
                        fontWeight: 900,
                        fontSize: 15,
                        fontFamily: "monospace",
                        background:
                          "linear-gradient(90deg, #251b45 60%, #26285c 100%)",
                        color: "#23e6ff",
                        borderBottom: "2.5px solid #23e6ff33",
                      },
                    }}
                  >
                    <TableCell>Tx Hash</TableCell>
                    <TableCell>From</TableCell>
                    <TableCell>To</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentTx.map((tx, idx) => {
                    const important = isImportant(tx);
                    return (
                      <TableRow
                        key={idx}
                        sx={
                          important
                            ? {
                                background:
                                  "linear-gradient(90deg,#1b5eaf0f 0%, #23e6ff25 100%)",
                                borderLeft: "6px solid #23e6ff",
                                fontWeight: 900,
                              }
                            : {
                                "&:hover": { background: "#e2489e10" },
                              }
                        }
                        hover
                      >
                        <TableCell>
                          <Box sx={{ fontFamily: "monospace" }}>
                            <Tooltip title={tx.hash} arrow>
                              <span
                                style={{
                                  color: important ? "#e2489e" : "#23e6ff",
                                  fontWeight: important ? 900 : 700,
                                }}
                              >
                                {shortHash(tx.hash)}
                              </span>
                            </Tooltip>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={tx.from} arrow>
                            <span
                              style={{
                                fontFamily: "monospace",
                                color: "#a5ebff",
                              }}
                            >
                              {shortAddr(tx.from)}
                            </span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={tx.to} arrow>
                            <span
                              style={{
                                fontFamily: "monospace",
                                color: "#a5ebff",
                              }}
                            >
                              {shortAddr(tx.to)}
                            </span>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="right">
                          <span
                            style={{
                              color: important ? "#e2489e" : "#12e39a",
                              fontWeight: important ? 900 : 700,
                              fontFamily: "monospace",
                            }}
                          >
                            {formatBigNumber(parseFloat(tx.value) / 1e18)} ETH
                          </span>
                          {important && (
                            <Chip
                              label="LARGE"
                              size="small"
                              color="error"
                              sx={{
                                ml: 1,
                                fontWeight: 900,
                                bgcolor: "#e2489e",
                                color: "#fff",
                                boxShadow: "0 2px 12px #e2489e88",
                                borderRadius: 1.5,
                                fontSize: 11,
                                fontFamily: "Inter, monospace",
                              }}
                            />
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <span
                            style={{
                              color: "#fff",
                              fontFamily: "Inter, monospace",
                              fontSize: 14,
                            }}
                          >
                            {new Date(tx.timeStamp * 1000).toLocaleString()}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
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
