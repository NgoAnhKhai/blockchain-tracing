import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { useTheme } from "@mui/material";
import dayjs from "dayjs";

function groupTxByMonth(transactions, walletAddress) {
  const grouped = {};
  walletAddress = walletAddress?.toLowerCase?.() || "";

  transactions.forEach((tx) => {
    if (!tx.timestamp) return;
    const month = dayjs(tx.timestamp).format("YYYY-MM");
    const value = Number(tx.value) / 1e18;
    const isIn = tx.to_address?.toLowerCase() === walletAddress;
    const isOut = tx.from_address?.toLowerCase() === walletAddress;
    if (!grouped[month]) grouped[month] = { incoming: 0, outgoing: 0 };
    if (isIn) grouped[month].incoming += value;
    if (isOut) grouped[month].outgoing += value;
  });

  const months = [];
  for (let i = 11; i >= 0; --i) {
    months.push(dayjs().subtract(i, "month").format("YYYY-MM"));
  }

  return {
    months: months.map((m) => dayjs(m).format("MMM")),
    incoming: months.map((m) => grouped[m]?.incoming || 0),
    outgoing: months.map((m) => grouped[m]?.outgoing || 0),
    netFlow: months.map(
      (m) => (grouped[m]?.incoming || 0) - (grouped[m]?.outgoing || 0)
    ),
  };
}

const ChartMoneyFlow = ({ transactions = [], walletAddress }) => {
  const theme = useTheme();

  const chartData = useMemo(
    () => groupTxByMonth(transactions, walletAddress),
    [transactions, walletAddress]
  );

  const option = useMemo(
    () => ({
      backgroundColor: theme.palette.background.paper,
      color: [
        theme.palette.primary.main,
        theme.palette.secondary.main,
        "#EE6666",
      ],
      tooltip: { trigger: "axis", axisPointer: { type: "cross" } },
      legend: {
        data: ["Incoming", "Outgoing", "Net Flow"],
        textStyle: { color: theme.palette.text.primary },
        top: 10,
      },
      grid: {
        top: 50,
        right: "18%",
        left: "6%",
        bottom: 40,
        containLabel: true,
      },
      toolbox: {
        feature: {
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true },
        },
        iconStyle: { borderColor: theme.palette.text.primary },
      },
      xAxis: [
        {
          type: "category",
          axisTick: { alignWithLabel: true },
          axisLine: { lineStyle: { color: theme.palette.text.primary } },
          axisLabel: { color: theme.palette.text.primary },
          data: chartData.months,
        },
      ],
      yAxis: [
        {
          type: "value",
          name: "Amount (ETH)",
          axisLine: { lineStyle: { color: theme.palette.text.primary } },
          axisLabel: {
            formatter: "{value} ETH",
            color: theme.palette.text.primary,
          },
          splitLine: { lineStyle: { color: theme.palette.divider } },
        },
        {
          type: "value",
          name: "Net Flow (ETH)",
          position: "right",
          offset: 0,
          axisLine: { lineStyle: { color: "#EE6666" } },
          axisLabel: {
            formatter: "{value} ETH",
            color: "#EE6666",
          },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: "Incoming",
          type: "bar",
          barWidth: "24%",
          data: chartData.incoming,
          itemStyle: { color: theme.palette.primary.main },
        },
        {
          name: "Outgoing",
          type: "bar",
          barWidth: "24%",
          data: chartData.outgoing,
          itemStyle: { color: theme.palette.secondary.main },
        },
        {
          name: "Net Flow",
          type: "line",
          yAxisIndex: 1,
          symbol: "circle",
          symbolSize: 9,
          smooth: true,
          lineStyle: { color: "#EE6666", width: 2 },
          itemStyle: { color: "#EE6666", borderColor: "#fff", borderWidth: 2 },
          data: chartData.netFlow,
        },
      ],
    }),
    [theme, chartData]
  );

  return (
    <ReactECharts option={option} style={{ height: 270, width: "100%" }} />
  );
};

export default ChartMoneyFlow;
