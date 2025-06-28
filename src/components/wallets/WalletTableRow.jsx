import React from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";

import FollowButton from "./FollowButton";
import { useTheme } from "@mui/material";

export default function WalletTableRow({
  row,
  followed,
  onToggleFollow,
  onRowClick,
  formatAddress,
}) {
  const theme = useTheme();
  const accent = theme.palette.primary.main;
  const accentLight = theme.palette.primary.light;
  const accentDark = theme.palette.primary.dark;

  function formatBalance(balance) {
    const num = Number(balance);
    if (isNaN(num)) return balance;
    if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
    return num.toLocaleString("en-US", { maximumFractionDigits: 2 });
  }

  return (
    <TableRow
      key={row.address}
      onClick={() => onRowClick(row.address)}
      sx={{
        cursor: "pointer",
        transition: "all 0.13s",
        "&:hover": {
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(90deg, #2e1945 0%, #19062e 100%)"
              : "linear-gradient(90deg, #fff1fa 0%, #f3a2f3 100%)",
          boxShadow: `0 2px 16px 0 ${accent}44`,
          transform: "scale(1.014)",
        },
      }}
    >
      <TableCell
        sx={{
          fontWeight: 900,
          fontSize: 15,
          fontFamily: "Inter, monospace",
          color: accent,
        }}
      >
        <WalletIcon
          sx={{
            color: accentLight,
            fontSize: 20,
            mr: 1,
            verticalAlign: "middle",
          }}
        />
        {formatAddress(row.address)}
      </TableCell>
      <TableCell
        sx={{
          fontWeight: 700,
          color: theme.palette.text.primary,
          fontFamily: "Inter, monospace",
        }}
      >
        {row.name_tag || "--"}
      </TableCell>
      <TableCell
        sx={{
          color: accent,
          fontWeight: 900,
          fontFamily: "Inter, monospace",
          fontSize: 20,
          letterSpacing: 0.5,
          textShadow: `0 2px 10px ${accentLight}22`,
        }}
      >
        {formatBalance(row.balance)}
      </TableCell>

      <TableCell align="right">
        <FollowButton
          isFollowed={row.is_followed}
          walletAddress={row.address}
          walletId={row.id}
          onStatusChange={onToggleFollow}
        />
      </TableCell>
    </TableRow>
  );
}
