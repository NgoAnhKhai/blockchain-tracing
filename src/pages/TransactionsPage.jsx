import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  useTheme,
  Paper,
  Chip,
  Tooltip,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SmallLoader from "../components/loading/SmallLoader";
import { getTxList } from "../services/GetPopularWallet";

const isImportant = (tx) => parseFloat(tx.value) / 1e18 > 100;

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

export default function TransactionsPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [searchParams] = useSearchParams();
  const address = searchParams.get("address");
  const [txList, setTxList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [amountFilter, setAmountFilter] = useState("all");
  const [pageSize, setPageSize] = useState(10);

  // Color
  const accent = theme.palette.primary.main;
  const accentLight = theme.palette.primary.light;
  const accentDark = theme.palette.primary.dark;
  const paperBg = theme.palette.background.paper;
  const divider = theme.palette.divider;
  const textPrimary = theme.palette.text.primary;
  const textSecondary = theme.palette.text.secondary;

  useEffect(() => {
    function calcPageSize() {
      const headerHeight = 170;
      const paginationHeight = 65;
      const padding = 70;
      const rowHeight = 52;
      const usable =
        window.innerHeight - (headerHeight + paginationHeight + padding);
      const rows = Math.max(5, Math.floor(usable / rowHeight));
      setPageSize(rows);
    }
    calcPageSize();
    window.addEventListener("resize", calcPageSize);
    return () => window.removeEventListener("resize", calcPageSize);
  }, []);

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    getTxList(address).then((txs) => {
      setTxList(txs || []);
      setLoading(false);
    });
  }, [address]);

  const filteredTxList = useMemo(() => {
    switch (amountFilter) {
      case "1":
        return txList.filter((tx) => parseFloat(tx.value) / 1e18 > 1);
      case "10":
        return txList.filter((tx) => parseFloat(tx.value) / 1e18 > 10);
      case "100":
        return txList.filter((tx) => parseFloat(tx.value) / 1e18 > 100);
      default:
        return txList;
    }
  }, [txList, amountFilter]);

  const totalPages = Math.ceil(filteredTxList.length / pageSize);
  const paginatedTx = useMemo(
    () =>
      filteredTxList.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      ),
    [filteredTxList, currentPage, pageSize]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [amountFilter, pageSize]);

  // Styles
  const cardHeaderBg = isDark
    ? paperBg
    : `linear-gradient(90deg, ${accentLight} 45%, ${paperBg} 100%)`;
  const tableHeaderBg = isDark
    ? "#1B1729"
    : `linear-gradient(90deg, ${accentLight} 60%, ${paperBg} 100%)`;
  const importantRowBg = isDark ? "#26162d" : `${accentLight}18`;
  const tableRowHover = isDark ? "#32213d" : `${accentLight}12`;

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: theme.palette.background.default,
        color: textPrimary,
        minHeight: "100%",
        fontFamily: "Inter, Roboto, monospace",
      }}
    >
      <Box
        sx={{
          maxWidth: "100%",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* Header */}
        <Card
          sx={{
            background: cardHeaderBg,
            borderRadius: 4,
            boxShadow: theme.shadows[5],
            color: isDark ? accent : accentDark,
            border: isDark ? `1.5px solid ${accent}22` : undefined,
          }}
        >
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <AccountBalanceWalletIcon
                sx={{
                  fontSize: 40,
                  color: accent,
                  textShadow: isDark ? "none" : `0 1px 12px ${accentLight}66`,
                }}
              />
              <Typography
                variant="h5"
                fontWeight={900}
                sx={{
                  letterSpacing: 2,
                  color: accent,
                  textShadow: isDark ? "none" : `0 2px 8px ${accentLight}33`,
                  mr: 1,
                  fontFamily: "Inter, Roboto, sans-serif",
                }}
              >
                Transactions
              </Typography>
              <Chip
                label={shortAddr(address)}
                color="secondary"
                sx={{
                  fontWeight: 700,
                  fontSize: 17,
                  bgcolor: isDark ? accentDark : accentLight,
                  color: "#fff",
                  letterSpacing: 1,
                  px: 2,
                  borderRadius: 2,
                  boxShadow: isDark ? undefined : `0 2px 16px ${accentLight}77`,
                  fontFamily: "monospace",
                  border: `1.5px dashed ${accentLight}66`,
                }}
              />
            </Box>
            <Box sx={{ mt: 1 }}>
              <FormControl size="small" sx={{ minWidth: 170 }}>
                <InputLabel>Filter by Amount</InputLabel>
                <Select
                  value={amountFilter}
                  label="Filter by Amount"
                  onChange={(e) => setAmountFilter(e.target.value)}
                  sx={{
                    bgcolor: isDark ? "#151025" : paperBg,
                    color: accent,
                    fontWeight: 700,
                    fontFamily: "Inter, monospace",
                    "& .MuiSvgIcon-root": {
                      color: accent,
                    },
                  }}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="1">{"> 1 ETH"}</MenuItem>
                  <MenuItem value="10">{"> 10 ETH"}</MenuItem>
                  <MenuItem value="100">{"> 100 ETH"}</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Paper
          sx={{
            width: "100%",
            overflowX: "auto",
            backgroundColor: paperBg,
            borderRadius: 3,
            mt: 0,
            boxShadow: theme.shadows[2],
            fontFamily: "Inter, Roboto, monospace",
          }}
        >
          {loading ? (
            <Box
              sx={{
                py: 8,
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 300,
              }}
            >
              <SmallLoader />
            </Box>
          ) : (
            <Table size="small" sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow
                  sx={{
                    "& th": {
                      fontWeight: 800,
                      fontSize: 16,
                      letterSpacing: 0.7,
                      background: tableHeaderBg,
                      color: isDark ? "#fff" : accentDark,
                      borderBottom: `2.5px solid ${accentLight}88`,
                      fontFamily: "monospace",
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
                {paginatedTx.map((tx, idx) => {
                  const important = isImportant(tx);
                  return (
                    <TableRow
                      key={idx}
                      sx={
                        important
                          ? {
                              background: importantRowBg,
                              fontWeight: 900,
                              borderLeft: `6px solid ${accent}`,
                              transition: "background 0.15s",
                            }
                          : {
                              transition: "background 0.18s",
                              "&:hover": {
                                background: tableRowHover,
                              },
                            }
                      }
                    >
                      <TableCell>
                        <Tooltip title={tx.hash} arrow>
                          <span
                            style={{
                              fontFamily: "monospace",
                              color: important
                                ? accent
                                : isDark
                                ? "#fff"
                                : accentDark,
                              fontWeight: important ? 900 : 700,
                              fontSize: 15,
                              letterSpacing: 0.5,
                            }}
                          >
                            {shortHash(tx.hash)}
                          </span>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={tx.from} arrow>
                          <span
                            style={{
                              fontFamily: "monospace",
                              color: isDark ? textSecondary : accentDark,
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
                              color: isDark ? textSecondary : accentDark,
                            }}
                          >
                            {shortAddr(tx.to)}
                          </span>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="right">
                        <span
                          style={{
                            color: important
                              ? accent
                              : theme.palette.success.main,
                            fontWeight: important ? 900 : 700,
                            fontSize: 16,
                            fontFamily: "monospace",
                          }}
                        >
                          {formatBigNumber(parseFloat(tx.value) / 1e18)} ETH
                        </span>
                        {important && (
                          <Chip
                            label="LARGE"
                            size="small"
                            color="primary"
                            sx={{
                              ml: 1,
                              fontWeight: 900,
                              bgcolor: accent,
                              color: "#fff",
                              borderRadius: 1.5,
                              fontSize: 12,
                              fontFamily: "Inter, monospace",
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <span
                          style={{
                            color: isDark ? "#fff" : textPrimary,
                            fontFamily: "Inter, monospace",
                            fontSize: 15,
                          }}
                        >
                          {new Date(tx.timeStamp * 1000).toLocaleString()}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {paginatedTx.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
          {/* Pagination */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              p: 1.5,
              gap: 1,
              borderTop: `1px solid ${divider}`,
              background: paperBg,
              borderRadius: "0 0 18px 18px",
            }}
          >
            <IconButton
              size="small"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              sx={{
                bgcolor: accentLight,
                color: accentDark,
                "&:hover": { bgcolor: accent, color: "#fff" },
                transition: "all .15s",
              }}
            >
              <ChevronLeft />
            </IconButton>
            <Typography
              variant="body2"
              sx={{
                color: accentDark,
                fontWeight: 800,
                fontSize: 16,
                fontFamily: "monospace",
              }}
            >
              {currentPage} of {totalPages}
            </Typography>
            <IconButton
              size="small"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              sx={{
                bgcolor: accentLight,
                color: accentDark,
                "&:hover": { bgcolor: accent, color: "#fff" },
                transition: "all .15s",
              }}
            >
              <ChevronRight />
            </IconButton>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
