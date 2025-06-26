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

const PAGE_SIZE = 10;
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
  const [searchParams] = useSearchParams();
  const address = searchParams.get("address");
  const [txList, setTxList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [amountFilter, setAmountFilter] = useState("all");

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

  const totalPages = Math.ceil(filteredTxList.length / PAGE_SIZE);
  const paginatedTx = useMemo(
    () =>
      filteredTxList.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
      ),
    [filteredTxList, currentPage]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [amountFilter]);

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
        minHeight: "100vh",
        fontFamily: "Inter, Roboto, monospace",
      }}
    >
      <Box
        sx={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* Header */}
        <Card
          sx={{
            background: "linear-gradient(90deg, #241445 45%, #323f6e 100%)",
            borderRadius: 3,
            boxShadow: "0 8px 32px #5411c747",
            color: "#fff",
          }}
        >
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <AccountBalanceWalletIcon
                sx={{
                  fontSize: 40,
                  color: "#23e6ff",
                  textShadow: "0 1px 12px #23e6ff55",
                }}
              />
              <Typography
                variant="h5"
                fontWeight={900}
                sx={{
                  letterSpacing: 2,
                  color: "#e2489e",
                  textShadow: "0 2px 8px #e2489e44, 0 1px 8px #23e6ff77",
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
                  bgcolor: "#3a3375",
                  color: "#23e6ff",
                  letterSpacing: 1,
                  px: 2,
                  borderRadius: 2,
                  boxShadow: "0 2px 16px #23e6ff55",
                  fontFamily: "monospace",
                  border: "1.5px dashed #1be7ff88",
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
                    bgcolor: "#221d3a",
                    color: "#23e6ff",
                    fontWeight: 700,
                    fontFamily: "Inter, monospace",
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
            backgroundColor: theme.palette.background.paper,
            borderRadius: 3,
            mt: 0,
            boxShadow: "0 2px 24px #332d4a33",
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
                      background:
                        "linear-gradient(90deg, #262152 65%, #2e315a 100%)",
                      color: "#23e6ff",
                      borderBottom: `2.5px solid #34157e88`,
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
                              background:
                                "linear-gradient(90deg,#461b8d0a 0%, #22fff26c 100%)",
                              boxShadow: "0 2px 16px #23e6ff55",
                              fontWeight: 900,
                              borderLeft: "6px solid #23e6ff",
                              transition: "background 0.15s",
                            }
                          : {
                              transition: "background 0.18s",
                              "&:hover": {
                                background: "#e2489e18",
                              },
                            }
                      }
                    >
                      <TableCell>
                        <Tooltip title={tx.hash} arrow>
                          <span
                            style={{
                              fontFamily: "monospace",
                              color: important ? "#e2489e" : "#23e6ff",
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
                            color="error"
                            sx={{
                              ml: 1,
                              fontWeight: 900,
                              bgcolor: "#e2489e",
                              color: "#fff",
                              boxShadow: "0 2px 12px #e2489e88",
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
                            color: "#fff",
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
              borderTop: `1px solid ${theme.palette.divider}`,
              background: "#221d3a",
              borderRadius: "0 0 12px 12px",
            }}
          >
            <IconButton
              size="small"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              sx={{
                bgcolor: "#19162d",
                color: "#23e6ff",
                "&:hover": { bgcolor: "#27215b" },
              }}
            >
              <ChevronLeft />
            </IconButton>
            <Typography
              variant="body2"
              sx={{
                color: "#23e6ff",
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
                bgcolor: "#19162d",
                color: "#23e6ff",
                "&:hover": { bgcolor: "#27215b" },
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
