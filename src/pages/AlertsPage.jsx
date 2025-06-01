
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
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  IconButton,
  useTheme,
  Paper,
  Divider,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import DonutChartAlerts from "../components/charts/DonutChartAlerts";
import BarChartAlertsOverTime from "../components/charts/BarChartAlertsOverTime";

const AlertsPage = () => {
  const theme = useTheme();

  // ----------------------
  // DỮ LIỆU MẪU (Hardcode)
  // ----------------------
  const severityOptions = ["All", "High", "Medium", "Low"];
  const typeOptions = [
    "All",
    "Large Transaction",
    "Surge in Activity",
    "Unusual Behavior",
    "New Wallet Interaction",
  ];
  const timeOptions = ["All", "Last 5 mins", "Last hour", "Today", "This week"];

  // Mảng sample Alerts cho bảng dưới
  const sampleAlerts = [
    {
      severity: "High",
      type: "Large Transaction",
      wallet: "0x6fa...e07",
      txHash: "0x92...d123",
      time: "2 sec ago",
    },
    {
      severity: "High",
      type: "Surge in Activity",
      wallet: "0x6fa...e07",
      txHash: "0x92...d123",
      time: "5 sec ago",
    },
    {
      severity: "Medium",
      type: "Unusual Behavior",
      wallet: "0x6fa...e07",
      txHash: "0x92...d123",
      time: "10 sec ago",
    },
    {
      severity: "Low",
      type: "New Wallet Interaction",
      wallet: "0x6fa...e07",
      txHash: "0x92...d123",
      time: "1 min ago",
    },
  ];

  // ----------------------
  // State cho Filters
  // ----------------------
  const [filterSeverity, setFilterSeverity] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [filterTime, setFilterTime] = useState("All");
  const [filterWallet, setFilterWallet] = useState("");

  const handleSeverityChange = (e) => setFilterSeverity(e.target.value);
  const handleTypeChange = (e) => setFilterType(e.target.value);
  const handleTimeChange = (e) => setFilterTime(e.target.value);
  const handleWalletChange = (e) => setFilterWallet(e.target.value);
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
            PHẦN FILTER (Severity / Type / Time / Wallet Search)
        ======================== */}
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
              {/* Severity */}
              <FormControl sx={{ minWidth: 140 }} size="small">
                <InputLabel sx={{ color: theme.palette.text.primary }}>
                  Severity
                </InputLabel>
                <Select
                  value={filterSeverity}
                  label="Severity"
                  onChange={handleSeverityChange}
                  sx={{
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? theme.palette.background.default
                        : "rgba(255,255,255,0.8)",
                    color: theme.palette.text.primary,
                    borderRadius: 1,
                  }}
                >
                  {severityOptions.map((sev, idx) => (
                    <MenuItem key={idx} value={sev}>
                      {sev}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Type */}
              <FormControl sx={{ minWidth: 180 }} size="small">
                <InputLabel sx={{ color: theme.palette.text.primary }}>
                  Type
                </InputLabel>
                <Select
                  value={filterType}
                  label="Type"
                  onChange={handleTypeChange}
                  sx={{
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? theme.palette.background.default
                        : "rgba(255,255,255,0.8)",
                    color: theme.palette.text.primary,
                    borderRadius: 1,
                  }}
                >
                  {typeOptions.map((tp, idx) => (
                    <MenuItem key={idx} value={tp}>
                      {tp}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Time */}
              <FormControl sx={{ minWidth: 140 }} size="small">
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
                  {timeOptions.map((tm, idx) => (
                    <MenuItem key={idx} value={tm}>
                      {tm}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Wallet Search */}
              <TextField
                size="small"
                variant="outlined"
                placeholder="Wallet"
                value={filterWallet}
                onChange={handleWalletChange}
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                  ),
                  sx: {
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? theme.palette.background.default
                        : "rgba(255,255,255,0.8)",
                    borderRadius: 1,
                    width: 200,
                  },
                }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* =======================
            PHẦN 2 CHIẾC BÁNH DONUT + BAR CHART
        ======================== */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          {/* Donut Chart */}
          <Card
            sx={{
              flex: 1,
              backgroundColor: theme.palette.background.paper,
              borderRadius: 1,
            }}
          >
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Alerts Types
              </Typography>
              <DonutChartAlerts />
            </CardContent>
          </Card>

          {/* Bar Chart */}
          <Card
            sx={{
              flex: 1,
              backgroundColor: theme.palette.background.paper,
              borderRadius: 1,
            }}
          >
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Alerts Over Time
              </Typography>
              <BarChartAlertsOverTime />
            </CardContent>
          </Card>
        </Box>

        {/* =======================
            PHẦN BẢNG ALERTS VỚI NÚT EXPAND
        ======================== */}
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="h6">Alerts</Typography>
            <Typography
              variant="body2"
              sx={{
                cursor: "pointer",
                color: theme.palette.primary.main,
                fontWeight: 500,
              }}
            >
              Expand
            </Typography>
          </Box>

          <Paper
            sx={{
              width: "100%",
              overflowX: "auto",
              backgroundColor: theme.palette.background.paper,
              borderRadius: 1,
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: theme.palette.text.primary,
                    }}
                  >
                    Severity
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: theme.palette.text.primary,
                    }}
                  >
                    Type
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: theme.palette.text.primary,
                    }}
                  >
                    Wallet
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: theme.palette.text.primary,
                    }}
                  >
                    Tx Hash
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: theme.palette.text.primary,
                    }}
                  >
                    Time
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sampleAlerts.map((alert, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Chip
                        label={alert.severity}
                        color={
                          alert.severity === "High"
                            ? "error"
                            : alert.severity === "Medium"
                            ? "warning"
                            : "default"
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ color: theme.palette.text.secondary }}>
                      {alert.type}
                    </TableCell>
                    <TableCell sx={{ color: theme.palette.text.secondary }}>
                      {alert.wallet}
                    </TableCell>
                    <TableCell sx={{ color: theme.palette.text.secondary }}>
                      {alert.txHash}
                    </TableCell>
                    <TableCell sx={{ color: theme.palette.text.secondary }}>
                      {alert.time}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default AlertsPage;
