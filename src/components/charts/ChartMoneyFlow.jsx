import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { useTheme } from "@mui/material";

// Mình sẽ chuẩn bị dữ liệu mẫu cho 12 tháng: Incoming, Outgoing, NetFlow
// Sau này bạn chỉ cần thay giá trị trong mảng 3 series này từ API trả về.
// Ở đây mình hardcode tạm để demo.
const sampleData = {
  months: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  incoming: [500, 800, 600, 1000, 1200, 1500, 2000, 1800, 1600, 1400, 900, 700], // Ví dụ $ incoming
  outgoing: [400, 600, 550, 900, 1000, 1300, 1700, 1600, 1500, 1200, 800, 600], // Ví dụ $ outgoing
  // NetFlow = incoming - outgoing
  get netFlow() {
    return this.incoming.map((val, idx) => val - this.outgoing[idx]);
  },
};

const ChartMoneyFlow = () => {
  const theme = useTheme();

  // Dùng useMemo để chỉ tính lại nếu theme hoặc sampleData đổi
  const option = useMemo(() => {
    return {
      backgroundColor: theme.palette.background.paper,
      color: [
        theme.palette.primary.main,
        theme.palette.secondary.main,
        "#EE6666",
      ],
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross" },
      },
      legend: {
        data: ["Incoming", "Outgoing", "Net Flow"],
        textStyle: { color: theme.palette.text.primary },
        top: 10,
      },
      grid: {
        top: 50,
        right: "20%", // dành không gian cho axis phụ
        left: "5%",
        bottom: 50,
        containLabel: true,
      },
      toolbox: {
        feature: {
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true },
        },
        iconStyle: {
          borderColor: theme.palette.text.primary,
        },
      },
      xAxis: [
        {
          type: "category",
          axisTick: { alignWithLabel: true },
          axisLine: { lineStyle: { color: theme.palette.text.primary } },
          axisLabel: { color: theme.palette.text.primary },
          data: sampleData.months,
        },
      ],
      yAxis: [
        {
          type: "value",
          name: "Amount ($)",
          axisLine: { lineStyle: { color: theme.palette.text.primary } },
          axisLabel: {
            formatter: "${value}",
            color: theme.palette.text.primary,
          },
          splitLine: { lineStyle: { color: theme.palette.divider } },
        },
        {
          type: "value",
          name: "Net Flow ($)",
          position: "right",
          offset: 0,
          axisLine: { lineStyle: { color: "#EE6666" } },
          axisLabel: {
            formatter: "${value}",
            color: "#EE6666",
          },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: "Incoming",
          type: "bar",
          barWidth: "25%",
          data: sampleData.incoming,
          itemStyle: {
            color: theme.palette.primary.main,
          },
        },
        {
          name: "Outgoing",
          type: "bar",
          barWidth: "25%",
          data: sampleData.outgoing,
          itemStyle: {
            color: theme.palette.secondary.main,
          },
        },
        {
          name: "Net Flow",
          type: "line",
          yAxisIndex: 1, // vẽ trên trục thứ 2 (phải)
          symbol: "circle",
          symbolSize: 8,
          smooth: true,
          lineStyle: {
            color: "#EE6666",
            width: 2,
          },
          itemStyle: {
            color: "#EE6666",
            borderColor: "#fff",
            borderWidth: 2,
          },
          data: sampleData.netFlow,
        },
      ],
    };
  }, [theme]);

  return (
    <ReactECharts option={option} style={{ height: 250, width: "100%" }} />
  );
};

export default ChartMoneyFlow;
