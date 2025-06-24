import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  useTheme,
  Pagination,
  IconButton,
} from "@mui/material";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ActivityHeatmap from "../components/charts/ActivityHeatmap";
import { getUserProfile } from "../services/GetUserProfile";
import { GetFeaturedWallet } from "../services/wallets/GetFeaturedWallet";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useNavigate } from "react-router-dom";
export default function TraceAllWalletFollowPage() {
  const theme = useTheme();
  const [wallets, setWallets] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [followed, setFollowed] = useState({});
  const [page, setPage] = useState(1);
  const walletsPerPage = 10;
  const navigate = useNavigate();
  const handleRowClick = (address) => {
    navigate(`/trace-wallets/${encodeURIComponent(address)}`);
  };

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profile = await getUserProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error("can not get user profile", error);
      }
    }
    fetchProfile();

    async function fetchWallets() {
      try {
        const res = await GetFeaturedWallet();
        let featured = res?.featured_wallets || [];
        featured = featured
          .map((w) => ({
            ...w,
            _balanceNum: Number(
              (w.balance || "0").replace(/,/g, "").replace(/[^0-9.]/g, "")
            ),
          }))
          .sort((a, b) => b._balanceNum - a._balanceNum);
        setWallets(featured);
      } catch (error) {
        console.error("can not get featured wallets", error);
      }
    }
    fetchWallets();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(wallets.length / walletsPerPage);
  const paginatedWallets = wallets.slice(
    (page - 1) * walletsPerPage,
    page * walletsPerPage
  );

  const toggleFollow = (id) => {
    setFollowed((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const formatAddress = (address = "") => {
    if (!address) return "--";
    return address.slice(0, 4) + "..." + address.slice(-2);
  };

  const getRankCup = (rank) => {
    if (rank === 1)
      return (
        <EmojiEventsIcon sx={{ color: "#ffbc00", mr: 0.5, fontSize: 22 }} />
      );
    if (rank === 2)
      return (
        <EmojiEventsIcon sx={{ color: "#bababa", mr: 0.5, fontSize: 20 }} />
      );
    if (rank === 3)
      return (
        <EmojiEventsIcon sx={{ color: "#a0785a", mr: 0.5, fontSize: 20 }} />
      );
    return null;
  };

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: theme.palette.background.default,
        minHeight: "100vh",
      }}
    >
      {/* Summary Cards */}
      <Grid
        sx={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
          gap: 2,
          mb: 2,
        }}
      >
        {/* Username */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background:
                "linear-gradient(135deg, rgba(36,0,70,0.98), rgba(255,0,208,0.11))",
              borderRadius: 4,
              height: 160,
              width: 230,
              boxShadow: "0 4px 40px 0 #ff4d8899",
              border: "2.5px solid",
              borderImage: "linear-gradient(90deg, #ff4d88 0%, #bb86fc 100%) 1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all .16s cubic-bezier(.2,.85,.41,.98)",
              "&:hover": {
                transform: "scale(1.055) rotate(-1deg)",
                boxShadow: "0 12px 54px 0 #ff4d88cc, 0 2px 16px 0 #bb86fc60",
              },
            }}
          >
            <CardContent sx={{ textAlign: "center", p: 2 }}>
              <PersonIcon sx={{ fontSize: 36, color: "#ff4d88", mb: 1 }} />
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{
                  background: "linear-gradient(90deg,#ff4d88,#bb86fc,#00FFE7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: 1,
                  wordBreak: "break-all",
                  overflowWrap: "break-word",
                  maxWidth: 200,
                  mx: "auto",
                  lineHeight: 1.15,
                  mb: 0.5,
                  textAlign: "center",
                }}
              >
                {userProfile?.username || "--"}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ color: "#fff", opacity: 0.8, mt: 1 }}
              >
                Username
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Email */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background:
                "linear-gradient(135deg, rgba(22,22,60,0.93), rgba(186,0,255,0.09))",
              borderRadius: 4,
              height: 160,
              width: 230,
              boxShadow: "0 4px 40px 0 #bb86fc77",
              border: "2.5px solid",
              borderImage: "linear-gradient(90deg, #bb86fc 0%, #00ffe7 100%) 1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all .16s cubic-bezier(.2,.85,.41,.98)",
              "&:hover": {
                transform: "scale(1.055) rotate(1deg)",
                boxShadow: "0 12px 54px 0 #bb86fcbb, 0 2px 16px 0 #00ffe770",
              },
            }}
          >
            <CardContent sx={{ textAlign: "center", p: 2 }}>
              <EmailIcon sx={{ fontSize: 36, color: "#bb86fc", mb: 1 }} />
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                  color: "#fff",
                  textShadow: "0 2px 10px #bb86fc88",
                  wordBreak: "break-all",
                }}
              >
                {userProfile?.email || "--"}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ color: "#fff", opacity: 0.8, mt: 1 }}
              >
                Email
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Role */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background:
                "linear-gradient(135deg, rgba(0,26,70,0.93), rgba(0,255,231,0.08))",
              borderRadius: 4,
              height: 160,
              width: 230,
              boxShadow: "0 4px 40px 0 #00ffe766",
              border: "2.5px solid",
              borderImage: "linear-gradient(90deg, #00ffe7 0%, #ff4d88 100%) 1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all .16s cubic-bezier(.2,.85,.41,.98)",
              "&:hover": {
                transform: "scale(1.055)",
                boxShadow: "0 12px 54px 0 #00ffe7cc",
              },
            }}
          >
            <CardContent sx={{ textAlign: "center", p: 2 }}>
              <VerifiedUserIcon
                sx={{ fontSize: 36, color: "#00ffe7", mb: 1 }}
              />
              <Typography
                variant="h4"
                fontWeight={900}
                sx={{
                  color: "#fff",
                  textShadow: "0 2px 10px #00ffe780",
                  letterSpacing: 1,
                }}
              >
                {userProfile?.role || "--"}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ color: "#fff", opacity: 0.8, mt: 1 }}
              >
                Role
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Activity Heatmap */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background:
                "linear-gradient(135deg, rgba(60,8,100,0.96), rgba(255,0,208,0.08))",
              borderRadius: 4,
              height: 160,
              width: 230,
              boxShadow: "0 4px 40px 0 #ff4d8877",
              border: "2.5px solid",
              borderImage: "linear-gradient(90deg, #ff4d88 0%, #00ffe7 100%) 1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all .16s cubic-bezier(.2,.85,.41,.98)",
              "&:hover": {
                transform: "scale(1.055) rotate(-1deg)",
                boxShadow: "0 12px 54px 0 #ff4d88bb",
              },
            }}
          >
            <CardContent sx={{ textAlign: "center", p: 2 }}>
              <ShowChartIcon sx={{ fontSize: 36, color: "#ff4d88", mb: 1 }} />
              <Typography
                variant="subtitle2"
                sx={{ color: "#fff", opacity: 0.9, fontWeight: 700, mb: 0.5 }}
              >
                Activity Heatmap
              </Typography>
              <ActivityHeatmap />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Full Table */}
      <Divider sx={{ mb: 2 }} />
      <Card
        sx={{
          backgroundColor: "rgba(40, 16, 60, 0.18)",
          borderRadius: 3,
        }}
      >
        <CardContent>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: 800,
                    background:
                      "linear-gradient(90deg, #ff4d88 30%, #bb86fc 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontSize: 18,
                    letterSpacing: 1,
                    textShadow: "0 2px 10px #bb86fc50",
                  }}
                >
                  Address{" "}
                  <WalletIcon
                    sx={{
                      fontSize: 18,
                      verticalAlign: "middle",
                      color: "#bb86fc",
                    }}
                  />
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 800,
                    color: "#bb86fc",
                    fontSize: 17,
                    textShadow: "0 1px 4px #bb86fc66",
                  }}
                >
                  Name Tag
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 800,
                    background:
                      "linear-gradient(90deg, #fd4d85 30%, #ffbc00 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontSize: 17,
                  }}
                >
                  Balance
                </TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: 16 }}>
                  Rank
                </TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: 16 }}>
                  Txns
                </TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: 16 }}>
                  Percentage
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, fontSize: 16 }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedWallets.map((row) => (
                <TableRow
                  key={row.id || row.address}
                  onClick={() => handleRowClick(row.address)}
                  sx={{
                    cursor: "pointer",
                    transition: "all 0.13s",
                    "&:hover": {
                      background:
                        theme.palette.mode === "dark"
                          ? "linear-gradient(90deg, #40156b 0%, #0a0023 100%)"
                          : "linear-gradient(90deg, #f0e6fc 0%, #e4eaff 100%)",
                      boxShadow: "0 2px 16px 0 #bb86fc50",
                      transform: "scale(1.018)",
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      background:
                        "linear-gradient(90deg, #ff4d88 0%, #bb86fc 80%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontSize: 15,
                    }}
                  >
                    <WalletIcon
                      sx={{
                        color: "#bb86fc",
                        fontSize: 20,
                        mr: 1,
                        verticalAlign: "middle",
                      }}
                    />
                    {formatAddress(row.address)}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#bb86fc" }}>
                    {row.name_tag || "--"}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#ff4d88",
                      fontWeight: 700,
                      fontSize: 16,
                    }}
                  >
                    {row.balance}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: row.rank <= 3 ? "#ff4d88" : "#fff",
                      fontSize: 16,
                    }}
                  >
                    {getRankCup(row.rank)}
                    {row.rank}
                  </TableCell>
                  <TableCell sx={{ color: "#00ffe7", fontWeight: 700 }}>
                    {row.txn_count}
                  </TableCell>
                  <TableCell>
                    <Box
                      component="span"
                      sx={{
                        bgcolor: "#2e1440",
                        color: "#00ffe7",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 2,
                        fontWeight: 700,
                        fontSize: 13,
                        display: "inline-block",
                      }}
                    >
                      {row.percentage}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => toggleFollow(row.id)}>
                      {followed[row.id] ? (
                        <FavoriteIcon sx={{ color: "#ff4d88" }} />
                      ) : (
                        <FavoriteBorderIcon sx={{ color: "#ff4d88" }} />
                      )}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedWallets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No wallet found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              siblingCount={1}
              boundaryCount={1}
              showFirstButton
              showLastButton
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
