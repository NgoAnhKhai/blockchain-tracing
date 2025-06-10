import React from "react";
import {
  Drawer,
  IconButton,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function RightSideBar({
  open,
  onClose,
  selectedNode,
  transactions = [],
}) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 320, bgcolor: "#1e1e1e", color: "#fff" } }}
    >
      <Box sx={{ p: 2 }}>
        {/* Header với nút đóng */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ flex: 1 }}>
            Transactions with {selectedNode || "—"}
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "#fff" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Bảng giao dịch */}
        <TableContainer component={Paper} sx={{ bgcolor: "#2b2b2b" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#aaa" }}>Tx ID</TableCell>
                <TableCell sx={{ color: "#aaa" }}>Dir</TableCell>
                <TableCell sx={{ color: "#aaa" }}>Amt</TableCell>
                <TableCell sx={{ color: "#aaa" }}>Count</TableCell>
                <TableCell sx={{ color: "#aaa" }}>Last</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((t) => (
                <TableRow key={t.id} hover>
                  <TableCell>
                    {t.id.slice(0, 6)}…{t.id.slice(-4)}
                  </TableCell>
                  <TableCell>{t.direction === "out" ? "→" : "←"}</TableCell>
                  <TableCell>{t.amount}</TableCell>
                  <TableCell>{t.count}</TableCell>
                  <TableCell>{t.last}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Drawer>
  );
}
