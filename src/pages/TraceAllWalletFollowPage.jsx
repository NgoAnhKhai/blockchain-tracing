import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Divider,
  Card,
  CardContent,
  Pagination,
  useTheme,
} from "@mui/material";

import UserProfileCard from "../components/profile/UserProfileCard";
import WalletTable from "../components/wallets/WalletTable";
import FollowFilterSwitcher from "../components/controls/FollowFilterButton";

import { getUserProfile } from "../services/GetUserProfile";
import { GetFeaturedWallet } from "../services/wallets/GetFeaturedWallet";
import { GetAllSubscribeWallet } from "../services/follow/GetAllSubscribeWallet";
import { SubscribeWallet } from "../services/follow/SubscribeWallet";
import { UnsubscribeWallet } from "../services/follow/UnsubscribeWallet";

import { useNavigate } from "react-router-dom";

export default function TraceAllWalletFollowPage() {
  const theme = useTheme();
  const [wallets, setWallets] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const walletsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const [featuredRes, followedRes] = await Promise.all([
          GetFeaturedWallet(),
          GetAllSubscribeWallet(),
        ]);

        const followedSet = new Set(
          (followedRes?.wallets || []).map((addr) => addr.toLowerCase())
        );

        const featured = (featuredRes?.featured_wallets || []).map((w) => ({
          ...w,
          _balanceNum: Number(
            (w.balance || "0").replace(/,/g, "").replace(/[^0-9.]/g, "")
          ),
          is_followed: followedSet.has(w.address.toLowerCase()),
        }));

        setWallets(featured.sort((a, b) => b._balanceNum - a._balanceNum));
      } catch (error) {
        console.error("Failed to fetch wallets:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();

    async function fetchProfile() {
      try {
        const profile = await getUserProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error("can not get user profile", error);
      }
    }
    fetchProfile();
  }, []);

  const handleFollowToggle = async (walletId, walletAddress, isFollowed) => {
    try {
      if (isFollowed) {
        await UnsubscribeWallet(walletAddress);
      } else {
        await SubscribeWallet(walletAddress);
      }
      setWallets((prev) =>
        prev.map((w) =>
          w.id === walletId ? { ...w, is_followed: !isFollowed } : w
        )
      );
    } catch (err) {
      console.error("Follow/unfollow failed", err);
    }
  };

  const filteredWallets = wallets.filter((wallet) =>
    filter === "followed" ? wallet.is_followed : true
  );

  const totalPages = Math.ceil(filteredWallets.length / walletsPerPage);
  const paginatedWallets = filteredWallets.slice(
    (page - 1) * walletsPerPage,
    page * walletsPerPage
  );

  const formatAddress = (address) => {
    if (!address) return "--";
    return address.slice(0, 4) + "..." + address.slice(-2);
  };

  const handleRowClick = (address) => {
    navigate(`/trace-wallets/${encodeURIComponent(address)}`);
  };

  if (loading) return <Box sx={{ p: 3 }}>Loading...</Box>;

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: theme.palette.background.default,
        minHeight: "100%",
      }}
    >
      <Grid
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 3,
          mb: 2,
        }}
      >
        <UserProfileCard userProfile={userProfile} />
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <FollowFilterSwitcher filter={filter} setFilter={setFilter} />
      </Box>

      <Divider sx={{ mb: 2 }} />
      <Card sx={{ backgroundColor: "rgba(40, 16, 60, 0.18)", borderRadius: 3 }}>
        <CardContent>
          <WalletTable
            wallets={paginatedWallets}
            onToggleFollow={handleFollowToggle}
            onRowClick={handleRowClick}
            formatAddress={formatAddress}
          />
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
