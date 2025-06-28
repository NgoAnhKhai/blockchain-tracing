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
  Tooltip,
  CircularProgress,
  Divider,
  Chip,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

function shortHash(str, l = 8) {
  if (!str) return "--";
  return str.slice(0, l) + "..." + str.slice(-4);
}
function formatETH(val) {
  if (!val) return "0";
  if (val.length > 12)
    return (
      (parseFloat(val) / 1e18).toLocaleString("en-US", {
        maximumFractionDigits: 6,
      }) + " ETH"
    );
  return val;
}

export default function RightSideBar({
  open,
  onClose,
  walletData = {},
  loading = false,
}) {
  const handleCopy = () => {
    if (walletData.address) navigator.clipboard.writeText(walletData.address);
  };

  // Hiển thị tất cả transaction nếu có
  const txs =
    walletData.transactions && walletData.transactions.length
      ? walletData.transactions
      : [];

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 410,
          maxWidth: "100vw",
          height: "100vh",
          bgcolor: "linear-gradient(180deg, #232547 0%, #201e2c 100%)",
          color: "#fff",
          borderLeft: "2px solid #a08bfa44",
          boxShadow: "0 0 40px #bb86fc33",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          minHeight: 0,
        }}
      >
        {/* Header với màu gradient hoặc nổi bật */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              flex: 1,
              fontWeight: 800,
              letterSpacing: 1.1,
              background: "linear-gradient(90deg,#8e2de2,#4a00e0 60%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textTransform: "uppercase",
              fontSize: 21,
            }}
          >
            Wallet Details
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "#fff" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Địa chỉ ví + copy */}
        <Box
          sx={{
            mb: 1,
            p: 1,
            bgcolor: "#2d2950",
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
            wordBreak: "break-all",
            minWidth: 0,
          }}
        >
          <Typography
            fontFamily="monospace"
            fontSize={15}
            color="#7ef7ed"
            sx={{
              flex: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              minWidth: 0,
            }}
          >
            {walletData.address || "--"}
          </Typography>
          <Tooltip title="Copy address" arrow>
            <IconButton
              onClick={handleCopy}
              size="small"
              sx={{
                color: "#a48bfa",
                ":hover": { color: "#fff", bgcolor: "#5126c2" },
              }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Badge info căn giữa */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="center"
          mb={2}
          sx={{
            flexWrap: "wrap",
            gap: 1,
            rowGap: 1,
            width: "100%",
          }}
        >
          <Chip
            label={
              <span>
                <span style={{ color: "#39ffd6", fontWeight: 700 }}>
                  Balance:{" "}
                </span>
                {formatETH(walletData.balance)}
              </span>
            }
            sx={{
              bgcolor: "#232540",
              color: "#39ffd6",
              fontWeight: 700,
              mb: 0.5,
              fontSize: 14,
              px: 1.5,
            }}
            size="small"
          />
          <Chip
            label={
              <span>
                <span style={{ color: "#00e0c0" }}>In: </span>
                {formatETH(walletData.totalInflow)}
              </span>
            }
            sx={{
              bgcolor: "#1c3748",
              color: "#00e0c0",
              mb: 0.5,
              fontSize: 14,
              px: 1.5,
            }}
            size="small"
          />
          <Chip
            label={
              <span>
                <span style={{ color: "#ffbb44" }}>Out: </span>
                {formatETH(walletData.totalOutflow)}
              </span>
            }
            sx={{
              bgcolor: "#422a18",
              color: "#ffbb44",
              mb: 0.5,
              fontSize: 14,
              px: 1.5,
            }}
            size="small"
          />
          <Chip
            label={
              <span>
                <span style={{ color: "#b388ff" }}>Txs: </span>
                {walletData.totalTransactions ?? "--"}
              </span>
            }
            sx={{
              bgcolor: "#4a3872",
              color: "#b388ff",
              mb: 0.5,
              fontSize: 14,
              px: 1.5,
            }}
            size="small"
          />
        </Stack>

        <Divider sx={{ mb: 1, borderColor: "#484778" }} />

        {/* Transaction table */}
        <TableContainer
          component={Paper}
          sx={{
            bgcolor: "#252138",
            borderRadius: 2,
            boxShadow: "0 2px 16px #bb86fc19",
            flex: 1,
            minHeight: 0,
            overflow: "auto",
            mt: 1,
          }}
        >
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#aaa", minWidth: 100 }}>
                  Tx Hash
                </TableCell>
                <TableCell sx={{ color: "#aaa", minWidth: 68 }}>Type</TableCell>
                <TableCell sx={{ color: "#aaa", minWidth: 70 }}>
                  Value
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <CircularProgress size={28} sx={{ color: "#bb86fc" }} />
                  </TableCell>
                </TableRow>
              ) : !txs || txs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography color="warning.main" fontStyle="italic">
                      No transaction found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                txs.map((t, i) => (
                  <TableRow key={t.hash || i} hover>
                    <TableCell sx={{ fontFamily: "monospace" }}>
                      <Tooltip title={t.hash}>
                        <span>{shortHash(t.hash, 8)}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={
                          t.type || t.direction || t.txreceipt_status === "1"
                            ? "Success"
                            : "Failed"
                        }
                        sx={{
                          bgcolor:
                            t.type === "out" || t.direction === "out"
                              ? "#503854"
                              : t.txreceipt_status === "1"
                              ? "#314b47"
                              : "#872e3c",
                          color: "#fff",
                          fontWeight: 700,
                          textTransform: "capitalize",
                          px: 1,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <span style={{ color: "#6bffd0", fontWeight: 600 }}>
                        {formatETH(t.value || t.amount)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Drawer>
  );
}
