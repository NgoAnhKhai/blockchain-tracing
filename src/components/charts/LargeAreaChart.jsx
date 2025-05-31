import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { useTheme } from "@mui/material";

// Hàm helper để sinh dữ liệu area chart (ngày và giá trị) giống ví dụ ECharts
function generateLargeAreaData(numPoints) {
  // Bắt đầu từ ngày 3/10/1968 (mỗi lần cộng thêm oneDay)
  let baseTimestamp = new Date(1968, 9, 3).getTime(); // Tháng 9 = tháng 10 vì JS đếm 0-based
  const oneDay = 24 * 3600 * 1000;
  const dates = [];
  const values = [];

  // Giá trị khởi tạo ban đầu (random)
  let prev = Math.round(Math.random() * 300);

  for (let i = 0; i < numPoints; i++) {
    const now = new Date(baseTimestamp + i * oneDay);
    const y = now.getFullYear();
    const m = now.getMonth() + 1; // +1 vì JS đếm 0–11
    const d = now.getDate();
    dates.push(`${y}/${m}/${d}`);

    // Tạo giá trị “leo-lắc” dựa trên prev
    const randomFactor = (Math.random() - 0.5) * 20;
    const newVal = Math.round(prev + randomFactor);
    values.push(newVal);
    prev = newVal;
  }

  return { dates, values };
}

const LargeAreaChart = () => {
  const theme = useTheme();

  // Sinh dữ liệu 20.000 điểm 1 lần bằng useMemo
  const { dates: largeDates, values: largeValues } = useMemo(
    () => generateLargeAreaData(20000),
    []
  );

  // Cấu hình option cho Large Area Chart
  const option = useMemo(() => {
    return {
      backgroundColor: theme.palette.background.paper,
      title: {
        text: "Large Area Chart",
        left: "center",
        textStyle: {
          color: theme.palette.text.primary,
        },
      },
      tooltip: {
        trigger: "axis",
        position: function (pt) {
          return [pt[0], "10%"];
        },
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: "none",
          },
          restore: {},
          saveAsImage: {},
        },
        iconStyle: {
          borderColor: theme.palette.text.primary,
        },
      },
      xAxis: {
        type: "category",
        data: largeDates,
        boundaryGap: false,
        axisLine: {
          lineStyle: { color: theme.palette.text.primary },
        },
        axisLabel: {
          color: theme.palette.text.primary,
          interval: 1000,
          rotate: 45,
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
      dataZoom: [
        {
          type: "inside",
          start: 0,
          end: 10,
        },
        {
          show: true,
          type: "slider",
          bottom: 20,
          start: 0,
          end: 10,
          handleIcon:
            "M8.3,0.8L8.3,0.8c-0.4,0-0.8,0.4-0.8,0.8v320c0,0.4,0.4,0.8,0.8,0.8h0c0.4,0,0.8-0.4,0.8-0.8v-320C9.1,1.2,8.7,0.8,8.3,0.8z",
          handleSize: "100%",
          handleStyle: {
            color: "#999",
          },
          textStyle: {
            color: theme.palette.text.primary,
          },
          borderColor: theme.palette.divider,
        },
      ],
      series: [
        {
          name: "Random Data",
          type: "line",
          smooth: false,
          symbol: "none",
          sampling: "lttb",
          itemStyle: {
            color: "#ff4d88",
          },
          areaStyle: {
            color:
              theme.palette.mode === "dark"
                ? "rgba(255, 77, 136, 0.3)"
                : "rgba(255, 77, 136, 0.4)",
          },
          data: largeValues,
        },
      ],
      grid: {
        left: 10,
        right: 10,
        bottom: 80,
        top: 60,
        containLabel: true,
      },
    };
  }, [largeDates, largeValues, theme]);

  return (
    <ReactECharts option={option} style={{ height: 300, width: "100%" }} />
  );
};

export default LargeAreaChart;
