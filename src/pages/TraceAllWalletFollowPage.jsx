import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Card,
  CardContent,
  Pagination,
  useTheme,
} from "@mui/material";

import WalletTable from "../components/wallets/WalletTable";
import FollowFilterSwitcher from "../components/controls/FollowFilterButton";
import { GetFeaturedWallet } from "../services/wallets/GetFeaturedWallet";
import { SubscribeWallet } from "../services/follow/SubscribeWallet";
import { UnsubscribeWallet } from "../services/follow/UnsubscribeWallet";
import { useNavigate } from "react-router-dom";
import Loader from "../components/loading/Loading";

export default function TraceAllWalletFollowPage() {
  const theme = useTheme();
  const [wallets, setWallets] = useState([]);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const walletsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const featuredRes = await GetFeaturedWallet();
        const featured = (featuredRes?.featured_wallets || []).map((w) => ({
          ...w,
          _balanceNum: Number(
            (w.balance || "0").replace(/,/g, "").replace(/[^0-9.]/g, "")
          ),
          is_followed: w.is_following ?? false,
        }));
        setWallets(featured.sort((a, b) => b._balanceNum - a._balanceNum));
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    }
    fetchData();
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
      throw error;
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

  if (loading)
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loader />
      </Box>
    );

  // Accent màu hồng tím từ theme
  const accent = theme.palette.primary.main;
  const accentLight = theme.palette.primary.light;

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: theme.palette.background.default,
        minHeight: "100%",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <FollowFilterSwitcher filter={filter} setFilter={setFilter} />
      </Box>

      <Divider sx={{ mb: 2, borderColor: accent + "33" }} />

      <Card
        sx={{
          background: theme.palette.background.paper,
          borderRadius: 3,
          boxShadow: theme.shadows[6],
          border: `1.5px solid ${accentLight}50`,
        }}
      >
        <CardContent>
          <WalletTable
            wallets={paginatedWallets}
            onToggleFollow={handleFollowToggle}
            onRowClick={handleRowClick}
            formatAddress={formatAddress}
            // Gợi ý: thêm prop accent để WalletTable dùng theme đúng luôn
            accent={accent}
            accentLight={accentLight}
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
              sx={{
                "& .MuiPaginationItem-root": {
                  fontWeight: 700,
                  color: accent,
                  borderColor: accentLight,
                  "&.Mui-selected": {
                    bgcolor: accent,
                    color: "#fff",
                  },
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
