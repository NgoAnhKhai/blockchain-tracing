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
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SmallLoader from "../components/loading/SmallLoader";
import { getTxList } from "../services/GetPopularWallet"; // hàm lấy txList theo address

const PAGE_SIZE = 10;

// Định nghĩa "giao dịch quan trọng"
const isImportant = (tx) => parseFloat(tx.value) / 1e18 > 100;

export default function TransactionsPage() {
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const address = searchParams.get("address");
  const [txList, setTxList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [amountFilter, setAmountFilter] = useState("all");

  // Gọi API lấy transactions theo address
  useEffect(() => {
    if (!address) return;
    setLoading(true);
    getTxList(address).then((txs) => {
      setTxList(txs || []);
      setLoading(false);
    });
  }, [address]);

  // Lọc theo amount filter
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

  // Pagination logic
  const totalPages = Math.ceil(filteredTxList.length / PAGE_SIZE);
  const paginatedTx = useMemo(
    () =>
      filteredTxList.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
      ),
    [filteredTxList, currentPage]
  );

  const handlePrevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((p) => Math.min(p + 1, totalPages));

  // Reset page nếu filter đổi
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
        {/* Tiêu đề với icon sinh động */}
        <Card
          sx={{
            background: "linear-gradient(90deg, #170048 50%, #30236e 100%)",
            borderRadius: 2,
            boxShadow: "0 6px 36px #8a2be267",
            color: "#fff",
          }}
        >
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <AccountBalanceWalletIcon
                sx={{ fontSize: 38, color: "#fd4d85" }}
              />
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                  letterSpacing: 1,
                  color: "#fd4d85",
                  textShadow: "0 2px 8px #fd4d8555, 0 1px 8px #7a6cff77",
                  mr: 1,
                }}
              >
                Transactions
              </Typography>
              <Chip
                label={address?.slice(0, 8) + "..." + address?.slice(-5)}
                color="secondary"
                sx={{
                  fontWeight: 700,
                  fontSize: 18,
                  bgcolor: "#262065",
                  color: "#fff",
                  letterSpacing: 1,
                  px: 2,
                  borderRadius: 2,
                  boxShadow: "0 2px 12px #fd4d8555",
                }}
              />
            </Box>
            {/* Nút Filter */}
            <Box sx={{ mt: 1 }}>
              <FormControl size="small" sx={{ minWidth: 170 }}>
                <InputLabel>Filter by Amount</InputLabel>
                <Select
                  value={amountFilter}
                  label="Filter by Amount"
                  onChange={(e) => setAmountFilter(e.target.value)}
                  sx={{
                    bgcolor: "#25144c",
                    color: "#fff",
                    fontWeight: 700,
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

        {/* Table Transactions */}
        <Paper
          sx={{
            width: "100%",
            overflowX: "auto",
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
            mt: 0,
          }}
        >
          {loading ? (
            <Box sx={{ py: 8, textAlign: "center" }}>
              <SmallLoader />
            </Box>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Tx Hash</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>From</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>To</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#fd4d85" }}>
                    Amount
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedTx.map((tx, idx) => (
                  <TableRow
                    key={idx}
                    sx={
                      isImportant(tx)
                        ? {
                            background:
                              "linear-gradient(90deg, #fd4d8522 0%, #fff0 100%)",
                            boxShadow: "0 1px 12px #fd4d8540",
                            fontWeight: 700,
                          }
                        : {
                            transition: "background 0.2s",
                            "&:hover": {
                              background: "#26144c22",
                            },
                          }
                    }
                  >
                    <TableCell>
                      <span
                        style={
                          isImportant(tx)
                            ? { color: "#fd4d85", fontWeight: 700 }
                            : {}
                        }
                      >
                        {tx.hash.slice(0, 14)}…
                      </span>
                    </TableCell>
                    <TableCell>{tx.from?.slice(0, 12)}…</TableCell>
                    <TableCell>{tx.to?.slice(0, 12)}…</TableCell>
                    <TableCell
                      sx={{
                        color: isImportant(tx)
                          ? "#fd4d85"
                          : theme.palette.text.primary,
                        fontWeight: isImportant(tx) ? 800 : 600,
                      }}
                    >
                      {(parseFloat(tx.value) / 1e18).toFixed(4)} ETH
                      {isImportant(tx) && (
                        <Chip
                          label="Large"
                          size="small"
                          color="error"
                          sx={{
                            ml: 1,
                            fontWeight: 700,
                            fontSize: 11,
                            bgcolor: "#fd4d85",
                            color: "#fff",
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(tx.timeStamp * 1000).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
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
              p: 1,
              gap: 1,
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <IconButton
              size="small"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft sx={{ color: theme.palette.text.primary }} />
            </IconButton>
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.primary }}
            >
              {currentPage} of {totalPages}
            </Typography>
            <IconButton
              size="small"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRight sx={{ color: theme.palette.text.primary }} />
            </IconButton>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
