import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import { useTheme } from "@mui/material";

const LargeAreaChart = ({ txList }) => {
  const theme = useTheme();

  // --- 1. Lọc chỉ 1 năm gần nhất
  const oneYearAgo = Date.now() - 365 * 24 * 3600 * 1000;
  const recentTx = useMemo(
    () => txList.filter((tx) => tx.timeStamp * 1000 >= oneYearAgo),
    [txList]
  );

  // --- 2. Gom nhóm theo ngày → dates[] & counts[]
  const { dates, counts } = useMemo(() => {
    const map = {};
    recentTx.forEach((tx) => {
      const day = new Date(tx.timeStamp * 1000).toISOString().slice(0, 10);
      map[day] = (map[day] || 0) + 1;
    });
    const sortedDays = Object.keys(map).sort();
    return {
      dates: sortedDays,
      counts: sortedDays.map((d) => map[d]),
    };
  }, [recentTx]);

  // --- 3. Tạo gradient giống sóng âm
  const gradient = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    { offset: 0, color: "#ff4d88" }, // top: đậm hồng
    { offset: 1, color: "rgba(255,77,136,0.2)" }, // bottom: mờ dần
  ]);

  // --- 4. Option cho ECharts
  const option = useMemo(
    () => ({
      backgroundColor: theme.palette.background.paper,
      title: {
        text: "Transaction Overview (Count)",
        left: "center",
        textStyle: { color: theme.palette.text.primary },
      },
      tooltip: { trigger: "axis" },
      toolbox: {
        feature: {
          dataZoom: { yAxisIndex: "none" },
          restore: {},
          saveAsImage: {},
        },
        iconStyle: { borderColor: theme.palette.text.primary },
      },
      xAxis: {
        type: "category",
        data: dates,
        axisLine: { lineStyle: { color: theme.palette.text.primary } },
        axisLabel: { color: theme.palette.text.primary, rotate: 45 },
      },
      yAxis: {
        type: "value",
        axisLine: { lineStyle: { color: theme.palette.text.primary } },
        axisLabel: { color: theme.palette.text.primary },
        splitLine: { lineStyle: { color: theme.palette.divider } },
      },
      dataZoom: [
        {
          show: true,
          type: "slider",
          start: 0,
          end: 100,
          height: 20,
          bottom: 10,
          handleIcon:
            "M8.3,0.8L8.3,0.8c-0.4,0-0.8,0.4-0.8,0.8v320c0,0.4,0.4,0.8,0.8,0.8h0c0.4,0,0.8-0.4,0.8-0.8v-320C9.1,1.2,8.7,0.8,8.3,0.8z",
          handleSize: "100%",
          handleStyle: { color: "#999" },
          textStyle: { color: theme.palette.text.primary },
          borderColor: theme.palette.divider,
        },
      ],
      series: [
        {
          name: "Count",
          type: "line",
          symbol: "none",
          smooth: false,
          sampling: "none",
          lineStyle: {
            width: 2,
            color: "#ff4d88",
          },
          areaStyle: {
            color: gradient,
          },
          data: counts,
        },
      ],
      grid: { left: 10, right: 10, top: 60, bottom: 60, containLabel: true },
    }),
    [dates, counts, gradient, theme]
  );

  return (
    <ReactECharts option={option} style={{ height: 300, width: "100%" }} />
  );
};

export default LargeAreaChart;
