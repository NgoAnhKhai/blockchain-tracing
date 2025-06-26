import React, { useMemo } from "react";
import { Box } from "@mui/material";
import WalletGraph from "./WalletGraph";

export default function D3GraphView({ data, onNodeClick }) {
  const d3Data = useMemo(() => {
    if (!data) return [];
    const sent = data.sent ?? [];
    const received = data.received ?? [];
    const edges = [];
    sent.forEach((tx) => {
      if (tx.to?.address)
        edges.push({ from: data.address, to: tx.to.address, type: "sent" });
    });
    received.forEach((tx) => {
      if (tx.from?.address)
        edges.push({
          from: tx.from.address,
          to: data.address,
          type: "received",
        });
    });
    return edges;
  }, [data]);

  const nodeSet = useMemo(() => {
    const set = new Set();
    d3Data.forEach(({ from, to }) => {
      set.add(from);
      set.add(to);
    });
    return set;
  }, [d3Data]);
  console.log("[D3GraphView] Tổng số node:", nodeSet.size);
  return (
    <Box sx={{ flex: 1 }}>
      <WalletGraph
        data={d3Data}
        onNodeClick={onNodeClick}
        center={data?.address}
      />
    </Box>
  );
}
