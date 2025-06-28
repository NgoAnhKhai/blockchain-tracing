import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { useTheme } from "@mui/material";

function groupAlertsByMonth(alerts) {
  const monthMap = Array(12).fill(0);
  alerts.forEach((alert) => {
    if (alert.analyzed_at) {
      const d = new Date(alert.analyzed_at);

      const month = d.getMonth();
      monthMap[month]++;
    }
  });
  return {
    months: Array.from({ length: 12 }, (_, i) => (i + 1).toString()),
    counts: monthMap,
  };
}

const BarChartAlertsOverTime = ({ alerts = [] }) => {
  const theme = useTheme();

  // Xử lý dữ liệu động
  const data = useMemo(() => groupAlertsByMonth(alerts), [alerts]);

  const option = useMemo(
    () => ({
      backgroundColor: theme.palette.background.paper,
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
      },
      xAxis: {
        type: "category",
        data: data.months,
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
          data: data.counts,
          itemStyle: {
            color: theme.palette.error.main,
            borderRadius: [4, 4, 0, 0],
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
    }),
    [theme, data]
  );

  return (
    <ReactECharts option={option} style={{ height: 280, width: "100%" }} />
  );
};

export default BarChartAlertsOverTime;
