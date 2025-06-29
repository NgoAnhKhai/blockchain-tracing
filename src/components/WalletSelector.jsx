import React, { useEffect, useState } from "react";
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputBase,
  useTheme,
  CircularProgress,
  Typography,
} from "@mui/material";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { GetFeaturedWallet } from "../services/wallets/GetFeaturedWallet";

function colorFromAddress(address) {
  if (!address) return "#607d8b";
  const hash = parseInt(address.slice(-6), 16);
  const r = (hash >> 16) & 0xff;
  const g = (hash >> 8) & 0xff;
  const b = hash & 0xff;
  return `rgb(${200 + (r % 50)},${180 + (g % 50)},${220 + (b % 35)})`;
}
function shortAddr(addr) {
  if (!addr) return "";
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

export default function WalletSelector({ selected, onSelect }) {
  const theme = useTheme();
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError("");
    async function fetchWallets() {
      try {
        const data = await GetFeaturedWallet();
        const walletAddress = data.featured_wallets;
        if (!Array.isArray(data.featured_wallets))
          throw new Error("Data response not fit");
        if (isMounted) setWallets(walletAddress.slice(0, 2));
        if (isMounted && data.length > 0 && !selected) {
          onSelect?.(data[0]);
        }
      } catch (err) {
        setWallets([]);
        setError("Default");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchWallets();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line
  }, []);

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 15,
        px: 2,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[1],
        minWidth: 180,
        height: 50,
      }}
    >
      <WalletIcon
        fontSize="small"
        sx={{ color: theme.palette.text.primary, mr: 1 }}
      />
      <FormControl variant="standard" sx={{ flex: 1 }}>
        {loading ? (
          <Box sx={{ display: "flex", alignItems: "center", pl: 1 }}>
            <CircularProgress size={18} />
            <Box
              sx={{ fontSize: 13, ml: 1, color: theme.palette.text.secondary }}
            >
              Loading...
            </Box>
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ fontSize: 13, pl: 1 }}>
            {error}
          </Typography>
        ) : (
          <Select
            value={selected?.address || wallets[0]?.address || ""}
            onChange={(e) => {
              const found = wallets.find(
                (w) =>
                  (w.address || w.wallet_address)?.toLowerCase() ===
                  e.target.value.toLowerCase()
              );
              onSelect && onSelect(found || null);
            }}
            displayEmpty
            input={<InputBase />}
            IconComponent={ExpandMoreIcon}
            sx={{
              ".MuiSelect-select": {
                padding: 0,
                display: "flex",
                alignItems: "center",
                gap: 1,
              },
              ".MuiSelect-icon": {
                color: theme.palette.text.primary,
              },
              fontSize: 14,
              color: theme.palette.text.primary,
            }}
          >
            {wallets.length === 0 ? (
              <MenuItem value="" disabled>
                Have not wallet popular
              </MenuItem>
            ) : (
              wallets.map((w) => {
                const label =
                  w.label || w.name || shortAddr(w.address || w.wallet_address);
                const addr = w.address || w.wallet_address || "";
                const color = w.color || colorFromAddress(addr);
                return (
                  <MenuItem
                    key={addr}
                    value={addr}
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: color,
                      }}
                    />
                    <Box component="span">{label}</Box>
                  </MenuItem>
                );
              })
            )}
          </Select>
        )}
      </FormControl>
    </Box>
  );
}
