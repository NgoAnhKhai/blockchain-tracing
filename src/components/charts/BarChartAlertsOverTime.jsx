// src/components/Charts/BarChartAlertsOverTime.jsx
import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { useTheme } from "@mui/material";

// Dữ liệu mẫu: Alerts count theo tháng (1→12)
const sampleAlertsOverTime = {
  months: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
  counts: [5, 8, 10, 15, 22, 40, 30, 45, 50, 65, 70, 80],
};

const BarChartAlertsOverTime = () => {
  const theme = useTheme();

  const option = useMemo(() => {
    return {
      backgroundColor: theme.palette.background.paper,
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
      },
      xAxis: {
        type: "category",
        data: sampleAlertsOverTime.months,
        axisLine: { lineStyle: { color: theme.palette.text.primary } },
        axisLabel: { color: theme.palette.text.primary },
      },
      yAxis: {
        type: "value",
        axisLine: { lineStyle: { color: theme.palette.text.primary } },
        axisLabel: { color: theme.palette.text.primary },
        splitLine: { lineStyle: { color: theme.palette.divider } },
      },
      series: [
        {
          name: "Alerts Over Time",
          type: "bar",
          barWidth: "60%",
          data: sampleAlertsOverTime.counts,
          itemStyle: {
            color: theme.palette.error.main,
            borderRadius: [4, 4, 0, 0], // bo góc trên trái + trên phải
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
  }, [theme]);

  return (
    <ReactECharts option={option} style={{ height: 280, width: "100%" }} />
  );
};

export default BarChartAlertsOverTime;
