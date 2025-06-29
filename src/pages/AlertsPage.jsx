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
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  useTheme,
  Paper,
  Pagination,
  Tooltip,
  IconButton,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
import DonutChartAlerts from "../components/charts/DonutChartAlerts";
import BarChartAlertsOverTime from "../components/charts/BarChartAlertsOverTime";
import { GetAlertFromAllUser } from "../services/AIModel/GetAlertFromAlluser";

const severityOptions = ["All", "HIGH", "MEDIUM", "LOW"];
const typeOptions = ["All", "FRAUDULENT", "NORMAL"];
const ROWS_PER_PAGE = 10;
const PAGE_SIZE_FETCH = 100;

async function fetchAllAlerts(limitPerPage = 100, setProgress) {
  let allAlerts = [];
  let totalPages = 1;
  try {
    const firstRes = await GetAlertFromAllUser({
      page: 1,
      limit: limitPerPage,
    });
    allAlerts = firstRes.alerts || [];
    totalPages = firstRes.pagination?.total_pages || 1;
    if (setProgress) setProgress({ value: 1, total: totalPages });

    const chunkSize = 10;
    let pageArr = [];
    for (let p = 2; p <= totalPages; p++) pageArr.push(p);
    for (let i = 0; i < pageArr.length; i += chunkSize) {
      const chunk = pageArr.slice(i, i + chunkSize);
      const results = await Promise.all(
        chunk.map((pageNum) =>
          GetAlertFromAllUser({ page: pageNum, limit: limitPerPage })
        )
      );
      results.forEach((res) => {
        if (Array.isArray(res.alerts)) allAlerts.push(...res.alerts);
      });
      if (setProgress)
        setProgress({ value: 1 + i + chunk.length, total: totalPages });
    }
  } catch (err) {
    console.error("Error fetch all alerts", err);
  }
  return allAlerts;
}

const AlertsPage = () => {
  const theme = useTheme();
  const [searchParams] = useSearchParams();

  const [filterSeverity, setFilterSeverity] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [filterWallet, setFilterWallet] = useState("");
  const [alertsAll, setAlertsAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [progress, setProgress] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const paramAddress = searchParams.get("address");
    if (paramAddress && paramAddress !== filterWallet) {
      setFilterWallet(paramAddress);
      setPage(1);
    }
  }, [searchParams]);

  // Fetch ALL alerts từ ALL pages
  useEffect(() => {
    let cancelled = false;
    async function fetchAll() {
      setLoading(true);
      setFetchError("");
      setProgress({ value: 0, total: 1 });
      try {
        const all = await fetchAllAlerts(PAGE_SIZE_FETCH, (prog) => {
          if (!cancelled) setProgress(prog);
        });
        if (!cancelled) setAlertsAll(all);
      } catch (err) {
        if (!cancelled) setFetchError("Failed to fetch all alerts.");
        setAlertsAll([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
          setProgress(null);
        }
      }
    }
    fetchAll();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredAlerts = useMemo(() => {
    let data = alertsAll;
    if (!Array.isArray(data)) return [];
    return data.filter((alert) => {
      let ok = true;
      if (filterSeverity !== "All" && alert.risk_level)
        ok = ok && alert.risk_level.toUpperCase() === filterSeverity;
      if (filterType !== "All" && alert.prediction)
        ok = ok && alert.prediction.toUpperCase() === filterType;
      if (filterWallet && alert.wallet_address)
        ok =
          ok &&
          alert.wallet_address
            .toLowerCase()
            .includes(filterWallet.toLowerCase());
      return ok;
    });
  }, [alertsAll, filterSeverity, filterType, filterWallet]);

  const totalPages = Math.ceil(filteredAlerts.length / ROWS_PER_PAGE);
  const paginatedAlerts = useMemo(
    () =>
      filteredAlerts.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE),
    [filteredAlerts, page]
  );

  const handlePageChange = (event, value) => setPage(value);

  const handleReset = () => {
    setFilterSeverity("All");
    setFilterType("All");
    setFilterWallet("");
    setPage(1);
  };

  // Helpers
  const shortAddr = (addr) =>
    addr ? addr.slice(0, 8) + "..." + addr.slice(-6) : "--";
  const formatTime = (iso) => {
    if (!iso) return "--";
    const d = new Date(iso);
    return d.toLocaleString("en-GB", { hour12: false });
  };
  const getRowStyle = (risk) => {
    if (risk === "HIGH")
      return {
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(90deg, #ff496c11 50%, transparent 100%)"
            : "#ffe0e6",
        borderLeft: `6px solid ${theme.palette.error.main}`,
      };
    if (risk === "MEDIUM")
      return {
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(90deg, #ffd90011 50%, transparent 100%)"
            : "#fffbe0",
        borderLeft: `6px solid #ffc107`,
      };
    if (risk === "LOW")
      return {
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(90deg, #40ffd011 50%, transparent 100%)"
            : "#e8fff0",
        borderLeft: `6px solid #4caf50`,
      };
    return {};
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
        {/* FILTER BAR */}
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
                  onChange={(e) => {
                    setFilterSeverity(e.target.value);
                    setPage(1);
                  }}
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
                  onChange={(e) => {
                    setFilterType(e.target.value);
                    setPage(1);
                  }}
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
              {/* Wallet search + nút RESET */}
              <TextField
                size="small"
                variant="outlined"
                placeholder="Wallet"
                value={filterWallet}
                onChange={(e) => {
                  setFilterWallet(e.target.value);
                  setPage(1);
                }}
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                  ),
                  endAdornment: (
                    <Tooltip title="Reset filters">
                      <IconButton
                        size="small"
                        onClick={handleReset}
                        edge="end"
                        sx={{
                          ml: 1,
                          color: "#ff69e5",
                          bgcolor: "rgba(255,255,255,0.02)",
                          "&:hover": {
                            color: "#fff",
                            bgcolor: "#ff69e544",
                          },
                          borderRadius: "50%",
                        }}
                      >
                        <ClearIcon />
                      </IconButton>
                    </Tooltip>
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

        {/* DONUT + BAR CHART */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
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
              <DonutChartAlerts alerts={alertsAll} />
            </CardContent>
          </Card>
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
              <BarChartAlertsOverTime alerts={alertsAll} />
            </CardContent>
          </Card>
        </Box>

        {/* LOADING toàn bộ pages */}
        {progress && (
          <Box sx={{ mt: 3, mb: 1, width: "100%", textAlign: "center" }}>
            <LinearProgress
              variant="determinate"
              value={Math.min(100, (progress.value / progress.total) * 100)}
              sx={{ height: 10, borderRadius: 3, mb: 1 }}
            />
            <Typography sx={{ fontWeight: 700 }}>
              Loading alerts page {progress.value}/{progress.total}...
            </Typography>
            {progress.value === progress.total && (
              <CircularProgress size={32} sx={{ mt: 2 }} />
            )}
          </Box>
        )}

        {/* ALERTS TABLE */}
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="h6" fontWeight={900}>
              Alerts
            </Typography>
          </Box>
          <Paper
            sx={{
              width: "100%",
              overflowX: "auto",
              backgroundColor: theme.palette.background.paper,
              borderRadius: 1,
              boxShadow: theme.shadows[4],
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: theme.palette.text.primary,
                      fontSize: 15,
                    }}
                  >
                    Severity
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: theme.palette.text.primary,
                      fontSize: 15,
                    }}
                  >
                    Type
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: theme.palette.text.primary,
                      fontSize: 15,
                    }}
                  >
                    Wallet
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: theme.palette.text.primary,
                      fontSize: 15,
                    }}
                  >
                    Time
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography>Loading...</Typography>
                    </TableCell>
                  </TableRow>
                ) : fetchError ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography color="error">{fetchError}</Typography>
                    </TableCell>
                  </TableRow>
                ) : paginatedAlerts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography>No alerts found.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedAlerts.map((alert, idx) => (
                    <TableRow
                      key={alert.id || idx}
                      sx={{
                        ...getRowStyle(alert.risk_level),
                        "&:hover": {
                          background:
                            alert.risk_level === "HIGH"
                              ? "#ff496c22"
                              : alert.risk_level === "MEDIUM"
                              ? "#ffe16c33"
                              : alert.risk_level === "LOW"
                              ? "#6fffc022"
                              : theme.palette.action.hover,
                          cursor: "pointer",
                        },
                        transition: "all .18s",
                      }}
                    >
                      <TableCell>
                        <Chip
                          label={alert.risk_level}
                          color={
                            alert.risk_level === "HIGH"
                              ? "error"
                              : alert.risk_level === "MEDIUM"
                              ? "warning"
                              : alert.risk_level === "LOW"
                              ? "success"
                              : "default"
                          }
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontFamily: "monospace",
                            letterSpacing: 0.6,
                            textTransform: "capitalize",
                            fontSize: 13,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={alert.prediction}
                          color={
                            alert.prediction === "FRAUDULENT"
                              ? "error"
                              : alert.prediction === "NORMAL"
                              ? "success"
                              : "default"
                          }
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontFamily: "monospace",
                            letterSpacing: 0.5,
                            fontSize: 13,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title={alert.wallet_address} arrow>
                          <span
                            style={{
                              fontFamily: "monospace",
                              color:
                                alert.risk_level === "HIGH"
                                  ? theme.palette.error.main
                                  : alert.risk_level === "MEDIUM"
                                  ? "#c4921f"
                                  : alert.risk_level === "LOW"
                                  ? "#43d991"
                                  : theme.palette.text.secondary,
                              fontWeight: 600,
                            }}
                          >
                            {shortAddr(alert.wallet_address)}
                          </span>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <span style={{ color: "#a076ff", fontWeight: 700 }}>
                          {formatTime(alert.analyzed_at)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {/* Pagination client-side */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", my: 2 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
                siblingCount={1}
                boundaryCount={1}
              />
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default AlertsPage;
