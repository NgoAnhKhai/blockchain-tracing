// src/components/NetworkGraph.jsx
import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { useTheme } from "@mui/material";

export default function NetworkGraph({ centerId = "Me", count = 12 }) {
  const theme = useTheme();

  // nodes: 1 viên trung tâm + count vệ tinh
  const { nodes, links } = useMemo(() => {
    const n = [
      {
        id: centerId,
        name: "You",
        symbolSize: 40,
        itemStyle: { color: "#bb86fc" },
      },
    ];
    const l = [];
    for (let i = 0; i < count; i++) {
      const id = `F${i}`;
      n.push({
        id,
        name: id,
        symbolSize: 10 + Math.random() * 10,
        itemStyle: { color: "#ff4d88" },
      });
      l.push({ source: centerId, target: id });
    }
    return { nodes: n, links: l };
  }, [centerId, count]);

  const option = useMemo(
    () => ({
      tooltip: { show: false },
      series: [
        {
          type: "graph",
          layout: "circular",
          circular: { rotateLabel: true },
          roam: false,
          itemStyle: {
            borderColor: theme.palette.background.paper,
            borderWidth: 1,
          },
          lineStyle: { color: "#888", width: 1 },
          label: { show: false },
          data: nodes,
          links,
          emphasis: {
            focus: "adjacency",
            itemStyle: { borderColor: "#fff", borderWidth: 2 },
          },
        },
      ],
    }),
    [nodes, links, theme]
  );

  return (
    <ReactECharts
      option={option}
      style={{ width: "100%", height: 200 }}
      notMerge
      lazyUpdate
    />
  );
}
