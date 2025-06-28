import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  useTheme,
} from "@mui/material";
import WalletTableRow from "./WalletTableRow";

export default function WalletTable({
  wallets,
  followed,
  onToggleFollow,
  onRowClick,
  formatAddress,
}) {
  const theme = useTheme();
  const accent = theme.palette.primary.main;

  return (
    <Table size="small">
      <TableHead>
        <TableRow
          sx={{
            "& th": {
              fontWeight: 900,
              fontSize: 16,
              fontFamily: "Inter, monospace",
              letterSpacing: 0.5,
              color: accent,
              background:
                theme.palette.mode === "dark"
                  ? "#191228"
                  : theme.palette.primary.light,
              borderBottom: `2.5px solid ${accent}33`,
              textShadow: `0 2px 8px ${accent}22`,
            },
          }}
        >
          <TableCell>Address</TableCell>
          <TableCell>Name Tag</TableCell>
          <TableCell>Balance</TableCell>
          <TableCell align="right">Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {wallets.map((row) => (
          <WalletTableRow
            key={row.id || row.address}
            row={row}
            onToggleFollow={onToggleFollow}
            onRowClick={onRowClick}
            formatAddress={formatAddress}
            accent={accent}
          />
        ))}
        {wallets.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} align="center">
              No wallet found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
