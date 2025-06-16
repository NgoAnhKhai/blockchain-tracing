import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";

const Sparkline = ({ data, color = "#ff4d88" }) => {
  // gradient từ đậm → nhạt
  const areaColor = useMemo(
    () =>
      new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color },
        { offset: 1, color: `${color}22` }, // mờ dần
      ]),
    [color]
  );

  const option = useMemo(
    () => ({
      xAxis: {
        type: "category",
        show: false,
        data: data.map((_, i) => i),
      },
      yAxis: { type: "value", show: false },
      grid: { left: 0, right: 0, top: 0, bottom: 0 },
      series: [
        {
          type: "line",
          data,
          smooth: true, // bo tròn sóng
          showSymbol: false, // ẩn điểm
          lineStyle: { width: 1, color },
          areaStyle: { color: areaColor },
        },
      ],
    }),
    [data, color, areaColor]
  );

  return (
    <ReactECharts
      option={option}
      style={{ width: 100, height: 30 }}
      notMerge={true}
      lazyUpdate={true}
    />
  );
};

export default Sparkline;
