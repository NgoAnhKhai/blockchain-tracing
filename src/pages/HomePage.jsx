import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Chip,
  useTheme,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import WalletSelector from "../components/WalletSelector";
import LargeAreaChart from "../components/charts/LargeAreaChart";
import WeeklyAreaChart from "../components/charts/WeeklyAreaChart";
import SmallLoader from "../components/loading/SmallLoader";
import { getTxList } from "../services/GetPopularWallet";
import { GetAlertsDetailUser } from "../services/AIModel/GetAlertsDetailUser";
import RelatedAlertsTable from "../components/RelatedAlertsTable";
import { GetFeaturedWallet } from "../services/wallets/GetFeaturedWallet";

const DEFAULT_WALLET = {
  address: "0x8315177ab297ba92a06054ce80a67ed4dbd7ed3a",
  label: "LayerZero Executor", // hoặc tên gì cũng được
};

const RECENT_COUNT = 8;

const HomePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [featuredWallets, setFeaturedWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState(DEFAULT_WALLET);
  const [txList, setTxList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Alert state
  const [alertDetail, setAlertDetail] = useState(null);
  const [alertLoading, setAlertLoading] = useState(false);
  const [alertError, setAlertError] = useState("");

  // ===== Fetch Featured Wallets (2 ví nổi bật) =====
  useEffect(() => {
    (async () => {
      try {
        const data = await GetFeaturedWallet();
        let list = data?.slice(0, 2) || [];
        // Ensure DEFAULT_WALLET is always first and unique
        if (
          !list.some(
            (w) =>
              (w.address || w.wallet_address || "").toLowerCase() ===
              DEFAULT_WALLET.address.toLowerCase()
          )
        ) {
          list = [DEFAULT_WALLET, ...list.slice(0, 1)];
        } else {
          // Đảm bảo DEFAULT_WALLET nằm đầu list
          list = [
            list.find(
              (w) =>
                (w.address || w.wallet_address || "").toLowerCase() ===
                DEFAULT_WALLET.address.toLowerCase()
            ),
            ...list.filter(
              (w) =>
                (w.address || w.wallet_address || "").toLowerCase() !==
                DEFAULT_WALLET.address.toLowerCase()
            ),
          ].slice(0, 2);
        }
        setFeaturedWallets(list);
      } catch (e) {
        setFeaturedWallets([DEFAULT_WALLET]);
      }
    })();
  }, []);

  // ===== Auto-select ví đầu tiên khi có featuredWallets (và lần đầu load thôi) =====
  useEffect(() => {
    if (
      featuredWallets.length > 0 &&
      (!selectedWallet || !selectedWallet.address)
    ) {
      setSelectedWallet({
        ...featuredWallets[0],
        address:
          featuredWallets[0].address || featuredWallets[0].wallet_address,
      });
    }
    // eslint-disable-next-line
  }, [featuredWallets]);

  // ===== Fetch Transactions =====
  useEffect(() => {
    if (!selectedWallet?.address) return;
    setLoading(true);
    getTxList(selectedWallet.address)
      .then((txs) => setTxList(txs))
      .finally(() => setLoading(false));
  }, [selectedWallet]);

  // ===== Fetch Alert by Wallet =====
  useEffect(() => {
    if (!selectedWallet?.address) {
      setAlertDetail(null);
      return;
    }
    setAlertLoading(true);
    setAlertError("");
    setAlertDetail(null);
    (async () => {
      try {
        const data = await GetAlertsDetailUser(selectedWallet.address);
        setAlertDetail(data);
      } catch (err) {
        setAlertDetail(null);
        setAlertError("Failed to fetch alert data.");
      } finally {
        setAlertLoading(false);
      }
    })();
  }, [selectedWallet]);

  // ===== Data Helpers =====
  const oneYearAgo = Date.now() - 365 * 24 * 3600 * 1000;
  const filteredTx = useMemo(
    () => txList.filter((tx) => tx.timeStamp * 1000 >= oneYearAgo),
    [txList]
  );
  const sortedTx = useMemo(
    () => [...filteredTx].sort((a, b) => b.timeStamp - a.timeStamp),
    [filteredTx]
  );
  const recentTx = useMemo(() => sortedTx.slice(0, RECENT_COUNT), [sortedTx]);

  function handleExpand(route) {
    if (!selectedWallet?.address) return;
    navigate(`${route}?address=${selectedWallet.address}`);
  }
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
  const isImportant = (tx) => parseFloat(tx.value) / 1e18 > 100;

  // Accent màu hồng tím
  const accent = theme.palette.primary.main;
  const accentLight = theme.palette.primary.light;
  const accentDark = theme.palette.primary.dark;
  const accentGradient =
    theme.palette.mode === "dark"
      ? `linear-gradient(90deg, ${theme.palette.background.paper} 60%, ${accent} 100%)`
      : `linear-gradient(90deg, #ffe2fc 0%, ${accentLight} 80%)`;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        bgcolor: theme.palette.background.default,
        minHeight: "100%",
      }}
    >
      {/* Selector */}
      <Box sx={{ px: 3, pt: 1, display: "flex", justifyContent: "flex-end" }}>
        <WalletSelector
          wallets={featuredWallets}
          selected={selectedWallet}
          onSelect={(wallet) => {
            setSelectedWallet({
              ...wallet,
              address: wallet.address || wallet.wallet_address,
            });
          }}
        />
      </Box>

      {/* Charts */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Card
          sx={{
            flex: 1,
            background: theme.palette.background.paper,
            borderRadius: 3,
            boxShadow: theme.shadows[3],
          }}
        >
          <CardContent
            sx={{
              minHeight: 220,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {loading ? <SmallLoader /> : <LargeAreaChart txList={txList} />}
          </CardContent>
        </Card>
        <Card
          sx={{
            flex: 1,
            background: theme.palette.background.paper,
            borderRadius: 3,
            boxShadow: theme.shadows[3],
          }}
        >
          <CardContent
            sx={{
              minHeight: 220,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {loading ? <SmallLoader /> : <WeeklyAreaChart txList={txList} />}
          </CardContent>
        </Card>
      </Box>

      {/* Recent Transactions & Risk Alerts */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        {/* Recent Transactions */}
        <Card
          sx={{
            flex: 2,
            position: "relative",
            background:
              theme.palette.mode === "dark"
                ? theme.palette.background.paper
                : accentGradient,
            borderRadius: 3,
            boxShadow: theme.shadows[6],
            border: `1.5px solid ${accentLight}40`,
          }}
        >
          <CardContent
            sx={{
              minHeight: 270,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography
                variant="h6"
                fontWeight={900}
                sx={{
                  fontFamily: "Inter, monospace",
                  color: accent,
                  letterSpacing: 1,
                }}
              >
                Recent Transactions
              </Typography>
              <IconButton
                size="small"
                onClick={() => handleExpand("/transactions")}
                sx={{
                  bgcolor: accentLight,
                  color: accentDark,
                  borderRadius: 2,
                  "&:hover": { bgcolor: accent, color: "#fff" },
                  boxShadow: theme.shadows[1],
                  transition: "all .15s",
                }}
              >
                <OpenInNewIcon />
              </IconButton>
            </Box>
            {loading ? (
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 160,
                }}
              >
                <SmallLoader />
              </Box>
            ) : (
              <Table size="small" sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow
                    sx={{
                      "& th": {
                        fontWeight: 900,
                        fontSize: 15,
                        fontFamily: "monospace",
                        background:
                          theme.palette.mode === "dark"
                            ? "#191228"
                            : accentLight,
                        color:
                          theme.palette.mode === "dark" ? "#fff" : accentDark,
                        borderBottom: `2.5px solid ${accent}33`,
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
                  {recentTx.map((tx, idx) => {
                    const important = isImportant(tx);
                    return (
                      <TableRow
                        key={idx}
                        sx={
                          important
                            ? {
                                background:
                                  theme.palette.mode === "dark"
                                    ? "#27113a"
                                    : `${accentLight}44`,
                                borderLeft: `6px solid ${accent}`,
                                fontWeight: 900,
                              }
                            : {
                                "&:hover": {
                                  background:
                                    theme.palette.mode === "dark"
                                      ? "#31213d"
                                      : `${accentLight}18`,
                                },
                              }
                        }
                        hover
                      >
                        <TableCell>
                          <Box sx={{ fontFamily: "monospace" }}>
                            <Tooltip title={tx.hash} arrow>
                              <span
                                style={{
                                  color: important
                                    ? theme.palette.error.main
                                    : accent,
                                  fontWeight: important ? 900 : 700,
                                }}
                              >
                                {shortHash(tx.hash)}
                              </span>
                            </Tooltip>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={tx.from} arrow>
                            <span
                              style={{
                                fontFamily: "monospace",
                                color: theme.palette.text.secondary,
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
                                color: theme.palette.text.secondary,
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
                                ? theme.palette.error.main
                                : theme.palette.success.main,
                              fontWeight: important ? 900 : 700,
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
                                boxShadow: `0 2px 12px ${accent}77`,
                                borderRadius: 1.5,
                                fontSize: 11,
                                fontFamily: "Inter, monospace",
                              }}
                            />
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <span
                            style={{
                              color: theme.palette.text.primary,
                              fontFamily: "Inter, monospace",
                              fontSize: 14,
                            }}
                          >
                            {new Date(tx.timeStamp * 1000).toLocaleString()}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Risk Alerts */}
        <Card
          sx={{
            flex: 1,
            position: "relative",
            background: theme.palette.background.paper,
            borderRadius: 3,
            boxShadow: theme.shadows[4],
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardContent sx={{ minHeight: 260, p: 0 }}>
            <RelatedAlertsTable
              walletId={selectedWallet?.address}
              navigate={navigate}
            />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default HomePage;
