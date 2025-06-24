import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import WalletTableRow from "./WalletTableRow";

export default function WalletTable({
  wallets,
  followed,
  onToggleFollow,
  onRowClick,
  formatAddress,
}) {
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Address</TableCell>
          <TableCell>Name Tag</TableCell>
          <TableCell>Balance</TableCell>
          <TableCell>Rank</TableCell>
          <TableCell>Percentage</TableCell>
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
