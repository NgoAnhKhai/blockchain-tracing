import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { useTheme } from "@mui/material";

const WeeklyAreaChart = () => {
  const theme = useTheme();

  // Dữ liệu mẫu cho 7 ngày (Mon→Sun)
  const dates = useMemo(
    () => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    []
  );
  const values = useMemo(() => [10, 15, 30, 40, 60, 50, 70], []);

  const option = useMemo(() => {
    return {
      backgroundColor: theme.palette.background.paper,
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        data: dates,
        boundaryGap: false,
        axisLine: {
          lineStyle: { color: theme.palette.text.primary },
        },
        axisLabel: {
          color: theme.palette.text.primary,
        },
      },
      yAxis: {
        type: "value",
        axisLine: {
          lineStyle: { color: theme.palette.text.primary },
        },
        axisLabel: {
          color: theme.palette.text.primary,
        },
        splitLine: {
          lineStyle: { color: theme.palette.divider },
        },
      },
      series: [
        {
          data: values,
          type: "line",
          smooth: true,
          symbol: "none",
          lineStyle: {
            color: "#ff4d88",
          },
          areaStyle: {
            color:
              theme.palette.mode === "dark"
                ? "rgba(255, 77, 136, 0.3)"
                : "rgba(255, 77, 136, 0.4)",
          },
        },
      ],
      grid: {
        left: 10,
        right: 10,
        bottom: 20,
        top: 30,
        containLabel: true,
      },
    };
  }, [dates, values, theme]);

  return (
    <ReactECharts option={option} style={{ height: 300, width: "100%" }} />
  );
};

export default WeeklyAreaChart;
