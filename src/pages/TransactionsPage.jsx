
import React, { useState } from "react";
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
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import SearchingBar from "../components/searching/SearchingBar"; // import component tìm kiếm của bạn

const TransactionsPage = () => {
  const theme = useTheme();

  // ----------------------
  // DỮ LIỆU MẪU (hardcode)
  // ----------------------
  const fromOptions = ["0x103ed...313", "0x22f8...d123", "0x06fa...e07"];
  const toOptions = ["0x103ed...313", "0x22f8...a523", "0x06fa...e07"];
  const tokenOptions = ["ETH", "USDT", "DAI"];
  const timeOptions = ["Last 5 mins", "Last hour", "Today", "This week"];

  const sampleTxs = Array.from({ length: 10 }).map((_, idx) => ({
    hash: `0x103ed...${300 + idx}`,
    from: "0x103ed...313",
    to: "0x103ed...313",
    amount: `${(Math.random() * 5 + 1).toFixed(2)} ETH`,
    token: "ETH",
    time: `${2 + idx} sec ago`,
  }));

  // ----------------------
  // STATE CHO FILTERS
  // ----------------------
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [filterToken, setFilterToken] = useState("");
  const [filterTime, setFilterTime] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 80;

  const handleFromChange = (e) => {
    setFilterFrom(e.target.value);
  };
  const handleToChange = (e) => {
    setFilterTo(e.target.value);
  };
  const handleTokenChange = (e) => {
    setFilterToken(e.target.value);
  };
  const handleTimeChange = (e) => {
    setFilterTime(e.target.value);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

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
        {/* =======================
            PHẦN TÌM KIẾM (SearchingBar)
        ======================== */}
        <Box>
          <SearchingBar />
        </Box>

        <Card
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: 1, 
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                alignItems: "center",
              }}
            >
              {/* From */}
              <FormControl sx={{ minWidth: 150 }} size="small">
                <InputLabel sx={{ color: theme.palette.text.primary }}>
                  From
                </InputLabel>
                <Select
                  value={filterFrom}
                  label="From"
                  onChange={handleFromChange}
                  sx={{
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? theme.palette.background.default
                        : "rgba(255,255,255,0.8)",
                    color: theme.palette.text.primary,
                    borderRadius: 1,
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {fromOptions.map((addr, idx) => (
                    <MenuItem key={idx} value={addr}>
                      {addr}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* To */}
              <FormControl sx={{ minWidth: 150 }} size="small">
                <InputLabel sx={{ color: theme.palette.text.primary }}>
                  To
                </InputLabel>
                <Select
                  value={filterTo}
                  label="To"
                  onChange={handleToChange}
                  sx={{
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? theme.palette.background.default
                        : "rgba(255,255,255,0.8)",
                    color: theme.palette.text.primary,
                    borderRadius: 1,
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {toOptions.map((addr, idx) => (
                    <MenuItem key={idx} value={addr}>
                      {addr}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Token */}
              <FormControl sx={{ minWidth: 120 }} size="small">
                <InputLabel sx={{ color: theme.palette.text.primary }}>
                  Token
                </InputLabel>
                <Select
                  value={filterToken}
                  label="Token"
                  onChange={handleTokenChange}
                  sx={{
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? theme.palette.background.default
                        : "rgba(255,255,255,0.8)",
                    color: theme.palette.text.primary,
                    borderRadius: 1,
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {tokenOptions.map((tok, idx) => (
                    <MenuItem key={idx} value={tok}>
                      {tok}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Time */}
              <FormControl sx={{ minWidth: 150 }} size="small">
                <InputLabel sx={{ color: theme.palette.text.primary }}>
                  Time
                </InputLabel>
                <Select
                  value={filterTime}
                  label="Time"
                  onChange={handleTimeChange}
                  sx={{
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? theme.palette.background.default
                        : "rgba(255,255,255,0.8)",
                    color: theme.palette.text.primary,
                    borderRadius: 1,
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {timeOptions.map((t, idx) => (
                    <MenuItem key={idx} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </CardContent>
        </Card>

        {/* =======================
            PHẦN BẢNG TRANSACTIONS
        ======================== */}
        <Paper
          sx={{
            width: "100%",
            overflowX: "auto",
            backgroundColor: theme.palette.background.paper,
            borderRadius: 1, // bo góc nhẹ
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ fontWeight: "bold", color: theme.palette.text.primary }}
                >
                  Tx Hash
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", color: theme.palette.text.primary }}
                >
                  From
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", color: theme.palette.text.primary }}
                >
                  To
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", color: theme.palette.text.primary }}
                >
                  Amount
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", color: theme.palette.text.primary }}
                >
                  Token
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", color: theme.palette.text.primary }}
                >
                  Time
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sampleTxs.map((tx, idx) => (
                <TableRow key={idx}>
                  <TableCell sx={{ color: theme.palette.text.secondary }}>
                    {tx.hash}
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.text.secondary }}>
                    {tx.from}
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.text.secondary }}>
                    {tx.to}
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.text.secondary }}>
                    {tx.amount}
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.text.secondary }}>
                    {tx.token}
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.text.secondary }}>
                    {tx.time}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* =======================
              PHẦN PAGINATION
          ======================== */}
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
};

export default TransactionsPage;
