
import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { useTheme } from "@mui/material";

// Dữ liệu mẫu cho Alerts Types
const sampleAlertTypes = [
  { value: 35, name: "Large Transaction" },
  { value: 24, name: "Surge in Activity" },
  { value: 10, name: "Other Alerts" },
];

const DonutChartAlerts = () => {
  const theme = useTheme();

  const option = useMemo(() => {
    return {
      backgroundColor: theme.palette.background.paper,
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} ({d}%)",
      },
      legend: {
        top: "5%",
        left: "center",
        textStyle: { color: theme.palette.text.primary },
        data: sampleAlertTypes.map((item) => item.name),
      },
      series: [
        {
          name: "Alerts Types",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          center: ["50%", "55%"],
          itemStyle: {
            borderRadius: 10, // bo góc cho từng múi
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
          labelLine: {
            show: false,
          },
          data: sampleAlertTypes,
        },
      ],
      color: [
        theme.palette.primary.main,
        theme.palette.success.main,
        theme.palette.warning.main,
        theme.palette.info.main,
        theme.palette.error.main,
      ],
    };
  }, [theme]);

  return (
    <ReactECharts option={option} style={{ height: 280, width: "100%" }} />
  );
};

export default DonutChartAlerts;
