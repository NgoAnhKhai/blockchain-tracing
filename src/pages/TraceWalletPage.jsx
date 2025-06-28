import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  useTheme,
  Skeleton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";
import ChartMoneyFlow from "../components/charts/ChartMoneyFlow";
import { useParams, useNavigate } from "react-router-dom";
import { GetDetailWallet } from "../services/wallets/GetDetailWallet";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { SubscribeWallet } from "../services/follow/SubscribeWallet";
import { UnsubscribeWallet } from "../services/follow/UnsubscribeWallet";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LoadingButton from "@mui/lab/LoadingButton";
import { GetAlertsDetailUser } from "../services/AIModel/GetAlertsDetailUser";
import RelatedAlertsTable from "../components/RelatedAlertsTable";

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

function shortenAddr(addr) {
  if (!addr || typeof addr !== "string") return addr;
  return addr.length > 12 ? addr.slice(0, 6) + "..." + addr.slice(-4) : addr;
}
function shortenHash(hash) {
  if (!hash || typeof hash !== "string") return hash;
  return hash.length > 16 ? hash.slice(0, 7) + "..." + hash.slice(-5) : hash;
}

const TraceWalletPage = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [alertsLoading, setAlertsLoading] = useState(false);
  useEffect(() => {
    async function fetchDetailAndAlerts() {
      setLoading(true);
      setAlertsLoading(true);
      try {
        const res = await GetDetailWallet(id);
        setDetail(res);

        const alertsRes = await GetAlertsDetailUser(id, 1, 5);
        console.log("alerts", alertsRes.alerts);

        const alertArr = alertsRes.alerts;
        setAlerts(alertArr);
      } catch (e) {
        console.error("Error fetching wallet detail/alerts:", e);
        setDetail(null);
        setAlerts([]);
      }
      setLoading(false);
      setAlertsLoading(false);
    }
    if (id) fetchDetailAndAlerts();
  }, [id]);

  function shortenBigNumber(n) {
    if (!n) return "--";
    const s = n.toString();
    if (s.includes("B")) return s;
    if (s.length > 6) return `${s[0]}...${s.slice(-2)}B`;
    return n;
  }

  const handleToggleFollow = async () => {
    if (!detail) return;
    setFollowLoading(true);
    try {
      if (detail.is_following) {
        await UnsubscribeWallet(detail.address || id);
      } else {
        await SubscribeWallet(detail.address || id);
      }
      setDetail((prev) =>
        prev ? { ...prev, is_following: !prev.is_following } : prev
      );
    } catch (e) {
      console.error("Follow/unfollow error:", e);
    }
    setFollowLoading(false);
  };

  const transactions = detail?.transactions?.slice?.(0, 8) ?? [];
  const hasMore = (detail?.transactions?.length ?? 0) > 8;

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
        minHeight: "100%",
      }}
    >
      <Box
        sx={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* WALLET ADDRESS + NÚT FOLLOW */}
        <Box
          sx={{ mb: 1, mt: 1, display: "flex", alignItems: "center", gap: 2 }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 900,
              fontFamily: "monospace",
              letterSpacing: 1,
              color: theme.palette.primary.light,
              userSelect: "all",
              fontSize: 22,
            }}
          >
            Wallet Address:
          </Typography>
          <Typography
            sx={{
              fontWeight: 700,
              fontFamily: "monospace",
              fontSize: 19,
              background: "#232a38",
              borderRadius: 2,
              px: 2,
              py: 0.3,
              color: "#4ed3ff",
              border: "1.5px dashed #53e1fe99",
              userSelect: "all",
              wordBreak: "break-all",
            }}
          >
            {id}
          </Typography>
          {/* Nút follow/unfollow */}
          {detail && (
            <LoadingButton
              variant={detail.is_following ? "contained" : "outlined"}
              color="primary"
              size="small"
              loading={followLoading}
              startIcon={
                detail.is_following ? <FavoriteIcon /> : <FavoriteBorderIcon />
              }
              onClick={handleToggleFollow}
              sx={{
                ml: 2,
                minWidth: 105,
                fontWeight: 700,
                fontFamily: "monospace",
                textTransform: "none",
                boxShadow: detail.is_following
                  ? "0 2px 12px 0 #1be7ff77"
                  : "0 2px 12px 0 #37b6fd44",
                letterSpacing: 0.6,
                bgcolor: detail.is_following ? "#22bbff" : "transparent",
                color: detail.is_following ? "#fff" : "#22bbff",
                borderColor: "#22bbff",
                "&:hover": {
                  bgcolor: detail.is_following ? "#1e98d7" : "#e3f7ff",
                },
                transition: "all .2s",
              }}
              disabled={followLoading}
            >
              {detail.is_following ? "Following" : "Follow"}
            </LoadingButton>
          )}
        </Box>

        {/* OVERVIEW + CHART */}
        <Box
          sx={{
            position: "relative",
            display: "flex",
            gap: 0,
            flexWrap: { xs: "wrap", md: "nowrap" },
            alignItems: "stretch",
            width: "100%",
            minHeight: 370,
            mt: 2,
          }}
        >
          {/* LINE DỌC NGĂN */}
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              position: "absolute",
              top: 24,
              bottom: 24,
              left: "44%",
              width: "2px",
              bgcolor: "rgba(120,180,255,0.16)",
              zIndex: 2,
              borderRadius: 1,
              pointerEvents: "none",
              boxShadow: "0 0 8px 2px #63b9f960",
              marginLeft: "-1px",
            }}
          />

          {/* OVERVIEW BOXES */}
          <Card
            sx={{
              minWidth: 330,
              maxWidth: "44%",
              flex: "1 1 0",
              background: "transparent",
              boxShadow: "none",
              p: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 1.5,
              zIndex: 1,
            }}
          >
            <CardContent
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1.5,
                pb: 2,
              }}
            >
              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Skeleton
                      variant="rectangular"
                      width={128}
                      height={80}
                      sx={{ borderRadius: 3 }}
                    />
                    <Skeleton
                      variant="rectangular"
                      width={128}
                      height={80}
                      sx={{ borderRadius: 3 }}
                    />
                  </Box>
                  <Skeleton
                    variant="rectangular"
                    width={272}
                    height={80}
                    sx={{ borderRadius: 3 }}
                  />
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                    gap: 2,
                  }}
                >
                  {/* Hàng trên: Total In + Total Out */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    {/* Total In */}
                    <Box
                      sx={{
                        flex: 1,
                        minWidth: 140,
                        borderRadius: 4,
                        px: 2.5,
                        py: 1.9,
                        background:
                          "linear-gradient(135deg, #22ffea 10%, #37b6fd 90%)",
                        boxShadow:
                          "0 0 36px 0 #1be7ff77, 0 4px 24px 0 #37b6fd44",
                        textAlign: "center",
                        border: `2.5px solid #42f5e5cc`,
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          top: -30,
                          left: 30,
                          width: 120,
                          height: 80,
                          background:
                            "radial-gradient(circle, #ffffff88 0%, #22ffea00 90%)",
                          opacity: 0.5,
                          filter: "blur(12px)",
                          pointerEvents: "none",
                        }}
                      />
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: "#fff",
                          fontWeight: 900,
                          fontSize: 18,
                          mb: 1.5,
                          letterSpacing: 0.5,
                          textShadow: "0 2px 10px #0008, 0 1px 2px #2ffde999",
                        }}
                      >
                        Total In
                      </Typography>
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 900,
                          color: "#fff",
                          fontSize: 30,
                          fontFamily: "monospace",
                          textShadow: "0 3px 18px #08fff5aa, 0 1px 8px #0009",
                        }}
                      >
                        {shortenBigNumber(
                          formatNumberShort(detail?.total_in)
                        ) ?? "--"}
                      </Typography>
                    </Box>
                    {/* Total Out */}
                    <Box
                      sx={{
                        flex: 1,
                        minWidth: 140,
                        borderRadius: 4,
                        px: 2.5,
                        py: 1.9,
                        background:
                          "linear-gradient(135deg, #7647ff 10%, #44f2ff 100%)",
                        boxShadow:
                          "0 0 36px 0 #7647ff77, 0 4px 24px 0 #44f2ff55",
                        textAlign: "center",
                        border: `2.5px solid #8566f9bb`,
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          top: -30,
                          right: 40,
                          width: 110,
                          height: 80,
                          background:
                            "radial-gradient(circle, #fff9ff88 0%, #7647ff00 90%)",
                          opacity: 0.5,
                          filter: "blur(12px)",
                          pointerEvents: "none",
                        }}
                      />
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: "#fff",
                          fontWeight: 900,
                          fontSize: 18,
                          mb: 1.5,
                          letterSpacing: 0.5,
                          textShadow: "0 2px 10px #0008, 0 1px 2px #7647ffcc",
                        }}
                      >
                        Total Out
                      </Typography>
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 900,
                          color: "#fff",
                          fontSize: 30,
                          fontFamily: "monospace",
                          textShadow: "0 3px 18px #7c56ffbb, 0 1px 8px #0009",
                        }}
                      >
                        {shortenBigNumber(
                          formatNumberShort(detail?.total_out)
                        ) ?? "--"}
                      </Typography>
                    </Box>
                  </Box>
                  {/* Hàng dưới: Balance */}
                  <Box
                    sx={{
                      width: "100%",
                      borderRadius: 4,
                      px: 2.5,
                      py: 2.5,
                      background:
                        "linear-gradient(135deg, #ff69b4 0%, #ff85c1 80%)",
                      boxShadow: "0 0 56px 0 #ff69b477, 0 8px 32px 0 #ff85c177",
                      textAlign: "center",
                      border: `2.5px solid #ff85c1cc`,
                      mt: 1,
                      alignSelf: "center",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: -35,
                        left: 70,
                        width: 160,
                        height: 110,
                        background:
                          "radial-gradient(circle, #fff0fc77 0%, #ff69b400 95%)",
                        opacity: 0.56,
                        filter: "blur(18px)",
                        pointerEvents: "none",
                      }}
                    />
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: "#fff",
                        fontWeight: 900,
                        fontSize: 20,
                        mb: 1.5,
                        letterSpacing: 0.5,
                        textShadow: "0 2px 10px #000a, 0 2px 2px #fface1",
                      }}
                    >
                      Balance
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 900,
                        color: "#fff",
                        fontSize: 38,
                        fontFamily: "monospace",
                        textShadow: "0 4px 26px #ff85c1bb, 0 1px 14px #000b",
                      }}
                    >
                      {shortenBigNumber(formatNumberShort(detail?.balance)) ??
                        "--"}
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Info phụ dưới box */}
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  textAlign: "center",
                  fontStyle: "italic",
                  opacity: 0.93,
                  mt: 2,
                }}
              >
                Name tag:{" "}
                <b style={{ color: "#19c6e6", fontWeight: 500 }}>
                  {detail?.name_tag ?? "—"}
                </b>
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ textAlign: "center", fontSize: 16, mb: 1 }}
              >
                Last active: <b>{formatDateTime(detail?.last_active)}</b>
              </Typography>
              <Divider sx={{ my: 1.3 }} />
            </CardContent>
          </Card>

          {/* CHART */}
          <Card
            sx={{
              flex: "2.2 1 0",
              maxWidth: "56%",
              minWidth: 620,
              background: theme.palette.background.paper,
              borderRadius: 3,
              display: "flex",
              alignItems: "stretch",
              justifyContent: "center",
              zIndex: 1,
            }}
          >
            <CardContent sx={{ width: "100%", minWidth: 0, py: 4 }}>
              <Typography variant="h5" gutterBottom>
                Money Flow
              </Typography>
              <ChartMoneyFlow
                transactions={detail?.transactions || []}
                walletAddress={detail?.address}
              />
            </CardContent>
          </Card>
        </Box>

        {/* TRANSACTION + ALERTS */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Card
            sx={{ flex: 2, backgroundColor: theme.palette.background.paper }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="h6">Transaction List</Typography>
                {hasMore && (
                  <Tooltip title="Show all transactions">
                    <IconButton
                      onClick={() => navigate(`/transactions?address=${id}`)}
                      size="small"
                      sx={{ ml: 1, color: theme.palette.primary.main }}
                    >
                      <OpenInNewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
              {loading ? (
                <Skeleton variant="rectangular" height={200} />
              ) : transactions.length ? (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">From</TableCell>
                      <TableCell align="left">To</TableCell>
                      <TableCell align="left">Tx Hash</TableCell>
                      <TableCell align="right">Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.map((t, idx) => {
                      const highlight =
                        t.value && Number(t.value) > 1e18
                          ? "#ffd74033"
                          : "inherit";
                      return (
                        <TableRow
                          key={t.id || idx}
                          sx={{
                            bgcolor: highlight,
                            fontWeight:
                              highlight !== "inherit" ? 700 : undefined,
                            borderLeft:
                              highlight !== "inherit"
                                ? "4px solid #FFD600"
                                : undefined,
                          }}
                        >
                          <TableCell>
                            <span style={{ fontFamily: "monospace" }}>
                              {shortenAddr(t.from_address)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span style={{ fontFamily: "monospace" }}>
                              {shortenAddr(t.to_address)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span style={{ fontFamily: "monospace" }}>
                              {shortenHash(t.tx_hash)}
                            </span>
                          </TableCell>
                          <TableCell align="right">
                            <span
                              style={{
                                color:
                                  Number(t.value) > 1e18
                                    ? "#e92d74"
                                    : "#19e675",
                                fontWeight: 700,
                              }}
                            >
                              {formatNumberShort(t.value)}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <Typography color="text.secondary" align="center">
                  No transactions found.
                </Typography>
              )}
            </CardContent>
          </Card>
          {/* Related Alerts giữ nguyên */}
          <Card
            sx={{ flex: 1, backgroundColor: theme.palette.background.paper }}
          >
            <RelatedAlertsTable walletId={id} navigate={navigate} />
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default TraceWalletPage;
