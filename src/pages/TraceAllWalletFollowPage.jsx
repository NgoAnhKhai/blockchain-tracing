import React, { useState } from "react";
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
  Button,
  Divider,
  useTheme,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
import Sparkline from "../components/charts/Sparkline";
import ActivityHeatmap from "../components/charts/ActivityHeatmap";

const followersData = [
  {
    address: "0x7f4d...05c5",
    lastActive: "3 hours ago",
    sparkData: [3, 5, 2, 6, 4, 7, 5],
    followed: false,
  },
  {
    address: "0x348a...5b0",
    lastActive: "1 day ago",
    sparkData: [2, 4, 3, 5, 4, 6, 3],
    followed: true,
  },
  {
    address: "0x08ba...05c5",
    lastActive: "1 day ago",
    sparkData: [1, 3, 1, 2, 1, 3, 2],
    followed: false,
  },
  {
    address: "0x08fa...05cf",
    lastActive: "5 mins ago",
    sparkData: [5, 7, 6, 8, 7, 9, 8],
    followed: false,
  },
];

export default function TraceAllWalletFollowPage() {
  const theme = useTheme();
  const [followers, setFollowers] = useState(followersData);
  const [search, setSearch] = useState("");

  const toggleFollow = (i) =>
    setFollowers((f) =>
      f.map((row, idx) =>
        idx === i ? { ...row, followed: !row.followed } : row
      )
    );

  // Summary
  const totalFollowing = followers.filter((f) => f.followed).length;
  const totalTx = followers.reduce(
    (sum, f) => sum + f.sparkData.reduce((a, b) => a + b, 0),
    0
  );
  const activeTime = "12d 8h";

  // Filter theo search
  const filtered = followers.filter((f) =>
    f.address.toLowerCase().includes(search.toLowerCase())
  );

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
        {/* Following */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              backgroundColor: "rgba(70,14,82,0.08)",
              borderRadius: 2,
              height: 140,
              width: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CardContent sx={{ textAlign: "center", p: 2 }}>
              <Typography variant="h3" color="#ff4d88" gutterBottom>
                {totalFollowing}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                Following
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Transactions */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              backgroundColor: "rgba(70,14,82,0.08)",
              borderRadius: 2,
              height: 140,
              width: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CardContent sx={{ textAlign: "center", p: 2 }}>
              <Typography variant="h3" color="#bb86fc" gutterBottom>
                {`${totalTx}K`}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                Transactions
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Activity Heatmap */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              backgroundColor: "rgba(70,14,82,0.08)",
              borderRadius: 2,
              height: 140,
              width: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CardContent sx={{ textAlign: "center", p: 2 }}>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                gutterBottom
              >
                Activity Heatmap
              </Typography>
              <ActivityHeatmap />
            </CardContent>
          </Card>
        </Grid>

        {/* Active Time */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              backgroundColor: "rgba(70,14,82,0.08)",
              borderRadius: 2,
              height: 140,
              width: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CardContent sx={{ textAlign: "center", p: 2 }}>
              <Typography variant="h3" color="textPrimary" gutterBottom>
                {activeTime}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                Active Time
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Full Table */}
      <Divider sx={{ mb: 2 }} />
      <Card
        sx={{
          backgroundColor: "rgba(70, 14, 82, 0.08)",
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Last Active</TableCell>
                <TableCell>Sparkline</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((row, idx) => (
                <TableRow key={row.address}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <WalletIcon fontSize="small" sx={{ color: "#bb86fc" }} />
                      {row.address}
                    </Box>
                  </TableCell>
                  <TableCell>{row.lastActive}</TableCell>
                  <TableCell>
                    <Sparkline data={row.sparkData} color="#ff4d88" />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant={row.followed ? "outlined" : "contained"}
                      sx={{
                        color: row.followed ? "#ff4d88" : "#fff",
                        borderColor: "#ff4d88",
                        "&:hover": {
                          backgroundColor: "rgba(255,77,136,0.1)",
                        },
                      }}
                      onClick={() => toggleFollow(idx)}
                    >
                      {row.followed ? "Unfollow" : "Follow"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
}
