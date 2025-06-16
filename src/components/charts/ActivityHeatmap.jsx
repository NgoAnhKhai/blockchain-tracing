// src/components/ActivityHeatmap.jsx
import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { useTheme } from "@mui/material";

export default function ActivityHeatmap({ data }) {
  const theme = useTheme();

  // Nếu không có data truyền vào, sinh ngẫu nhiên 3 tuần × 10 ngày
  const raw = useMemo(() => {
    const weeks = 3,
      days = 10;
    const arr = [];
    for (let w = 0; w < weeks; w++) {
      for (let d = 0; d < days; d++) {
        arr.push([d, w, Math.floor(Math.random() * 5)]);
      }
    }
    return arr;
  }, []);

  const option = useMemo(
    () => ({
      grid: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
        containLabel: false,
      },
      xAxis: {
        type: "category",
        data: Array.from({ length: 10 }, (_, i) => i + 1), // 1→10
        show: false,
      },
      yAxis: {
        type: "category",
        data: ["W3", "W2", "W1"], // thứ tự W3 trên cùng
        show: false,
      },
      visualMap: {
        min: 0,
        max: 4,
        show: false,
        inRange: {
          color:
            theme.palette.mode === "dark"
              ? ["#1e1e1e", "#ff4d88"]
              : ["#f5f5f5", "#ff4d88"],
        },
      },
      series: [
        {
          type: "heatmap",
          data: data || raw,
          coordinateSystem: "cartesian2d",
          cellSize: [12, 12], // mỗi ô 12×12px
          // tách ô bằng border mảnh
          itemStyle: {
            borderColor: theme.palette.background.default,
            borderWidth: 1,
          },
          emphasis: {
            itemStyle: {
              borderColor: theme.palette.text.primary,
              borderWidth: 1,
            },
          },
        },
      ],
    }),
    [raw, data, theme]
  );

  return (
    <ReactECharts
      option={option}
      style={{ width: "100%", height: 50 }}
      notMerge
      lazyUpdate
    />
  );
}
