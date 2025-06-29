import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Skeleton,
  IconButton,
  Tooltip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { GetAlertsDetailUser } from "../services/AIModel/GetAlertsDetailUser";
import { useAuth } from "../context/AuthContext";

function formatNumberShort(n) {
  if (!n || isNaN(Number(n))) return n;
  n = Number(n);
  if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return n.toLocaleString();
}
function formatDateTime(dt) {
  if (!dt) return "--";
  const d = new Date(dt);
  if (isNaN(d.getTime())) return dt;
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

const riskColor = { LOW: "#1ecc7a", MEDIUM: "#ffad33", HIGH: "#ff4d4f" };

export default function RelatedAlertsTable({ walletId, navigate }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // LOGIN logic
  const { user } = useAuth();
  const isLoggedIn = !!user;

  // Popup
  const [openPopup, setOpenPopup] = useState(false);
  const [timer, setTimer] = useState(null);

  // Open popup and auto-close
  const handleLockClick = () => {
    setOpenPopup(true);
    // Reset timer if any
    if (timer) clearTimeout(timer);
    const t = setTimeout(() => setOpenPopup(false), 3000);
    setTimer(t);
  };
  // Clean timer on unmount or close
  useEffect(() => {
    return () => {
      if (timer) clearTimeout(timer);
    };
    // eslint-disable-next-line
  }, [timer]);

  useEffect(() => {
    if (!walletId || !isLoggedIn) return;
    setLoading(true);
    (async () => {
      try {
        const res = await GetAlertsDetailUser(walletId, 1, 7);
        setAlerts(res?.alerts ?? []);
      } catch (e) {
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [walletId, isLoggedIn]);

  const AlertsTableUI = () =>
    alerts && alerts.length ? (
      <Table size="small" sx={{ minWidth: 300 }}>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{ fontWeight: 900, color: "#a076ff", border: "none" }}
            >
              Risk Level
            </TableCell>
            <TableCell
              sx={{ fontWeight: 900, color: "#12e47a", border: "none" }}
            >
              Transactions
            </TableCell>
            <TableCell sx={{ fontWeight: 900, color: "#fff", border: "none" }}>
              Analyzed At
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {alerts.map((alert, idx) => (
            <TableRow key={alert.id || idx}>
              <TableCell>
                <Chip
                  label={alert.risk_level || "N/A"}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontSize: 12,
                    color: "#fff",
                    px: 0.8,
                    py: 0.1,
                    minWidth: 56,
                    height: 22,
                    borderRadius: "9px",
                    background:
                      alert.risk_level === "HIGH"
                        ? riskColor.HIGH
                        : alert.risk_level === "MEDIUM"
                        ? riskColor.MEDIUM
                        : riskColor.LOW,
                    boxShadow: "0 1px 4px #2221",
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                  }}
                />
              </TableCell>
              <TableCell>
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontFamily: "monospace",
                    fontSize: 15,
                    color: "#ffb9ee",
                  }}
                >
                  {formatNumberShort(alert.total_transactions) || "--"}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  sx={{
                    color: "#b0beff",
                    fontFamily: "monospace",
                    fontSize: 15,
                    fontWeight: 700,
                    letterSpacing: 0.3,
                  }}
                >
                  {formatDateTime(alert.analyzed_at)}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    ) : (
      <Fade in>
        <Typography color="text.secondary" align="center" sx={{ my: 6 }}>
          No related alerts found.
        </Typography>
      </Fade>
    );

  return (
    <Card
      sx={{
        flex: 1,
        backgroundColor: "background.paper",
        minWidth: 320,
        height: "40vh",
        p: 0,
        boxShadow: "0 2px 18px #2b174322",
        borderRadius: 4,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <CardContent
        sx={{
          p: 2,
          filter: !isLoggedIn ? "blur(5px)" : "none",
          pointerEvents: !isLoggedIn ? "none" : "auto",
          transition: "filter .2s",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            Related Alerts
          </Typography>
          {alerts.length === 7 && isLoggedIn && (
            <Tooltip title="Show all alerts">
              <IconButton
                size="small"
                onClick={() => navigate(`/alerts?address=${walletId}`)}
                sx={{
                  color: "#ff69e5",
                  ml: 0.5,
                  "&:hover": {
                    color: "#fff",
                    bgcolor: "#9e23c9",
                  },
                  transition: "all .18s",
                }}
              >
                <OpenInNewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        {loading && isLoggedIn ? (
          <Skeleton
            variant="rectangular"
            height={120}
            sx={{ borderRadius: 2 }}
          />
        ) : isLoggedIn ? (
          <AlertsTableUI />
        ) : (
          <Box sx={{ minHeight: 120 }} />
        )}
      </CardContent>

      {/* Icon khoá + overlay nếu chưa login */}
      {!isLoggedIn && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 6,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "auto",
            userSelect: "none",
            cursor: "pointer",
            bgcolor: "rgba(24,14,34,0.22)",
          }}
          onClick={handleLockClick}
        >
          <LockIcon sx={{ fontSize: 48, color: "#b69af7", mb: 1 }} />
          <Typography color="text.secondary" fontWeight={600}>
            You need to login to view alerts
          </Typography>
        </Box>
      )}

      {/* Popup thông báo login */}
      <Dialog
        open={openPopup}
        onClose={() => setOpenPopup(false)}
        maxWidth="xs"
        PaperProps={{
          sx: { borderRadius: 3, p: 2, textAlign: "center" },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#b69af7" }}>
          Login Required
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#9d83c6", mb: 1 }}>
            You need to login to view alerts.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={() => setOpenPopup(false)}
            sx={{
              bgcolor: "#b69af7",
              color: "#fff",
              px: 3,
              fontWeight: 700,
              borderRadius: 2,
              "&:hover": { bgcolor: "#9e23c9" },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
