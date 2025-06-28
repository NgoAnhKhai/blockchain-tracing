import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { useTheme } from "@mui/material";

function groupByType(alerts, key = "prediction") {
  const map = {};
  alerts.forEach((a) => {
    const type = (a[key] || "Other").toUpperCase();
    map[type] = (map[type] || 0) + 1;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

const DonutChartAlerts = ({ alerts = [] }) => {
  const theme = useTheme();

  const data = useMemo(() => groupByType(alerts, "prediction"), [alerts]);

  const option = useMemo(
    () => ({
      backgroundColor: theme.palette.background.paper,
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} ({d}%)",
      },
      legend: {
        top: "5%",
        left: "center",
        textStyle: { color: theme.palette.text.primary },
        data: data.map((item) => item.name),
      },
      series: [
        {
          name: "Alerts Types",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          center: ["50%", "55%"],
          itemStyle: {
            borderRadius: 10,
            borderColor: theme.palette.background.paper,
            borderWidth: 2,
          },
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: "bold",
              color: theme.palette.text.primary,
            },
          },
          labelLine: { show: false },
          data,
        },
      ],
      color: [
        theme.palette.primary.main,
        theme.palette.success.main,
        theme.palette.warning.main,
        theme.palette.info.main,
        theme.palette.error.main,
      ],
    }),
    [theme, data]
  );

  return (
    <ReactECharts option={option} style={{ height: 280, width: "100%" }} />
  );
};

export default DonutChartAlerts;
