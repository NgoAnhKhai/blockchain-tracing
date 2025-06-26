import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import ShowChartIcon from "@mui/icons-material/ShowChart";

const COLOR_STEPS = [
  "#202840",
  "#a5b4fc",
  "#818cf8",
  "#6366f1",
  "#4338ca",
  "#312e81",
];

function getColor(val, max) {
  if (!val) return COLOR_STEPS[0];
  if (val > 0.9 * max) return COLOR_STEPS[5];
  if (val > 0.7 * max) return COLOR_STEPS[4];
  if (val > 0.5 * max) return COLOR_STEPS[3];
  if (val > 0.3 * max) return COLOR_STEPS[2];
  return COLOR_STEPS[1];
}

export default function ActivityHeatmapCard({ data }) {
  const matrix =
    data?.matrix ||
    Array(5)
      .fill()
      .map(() => Array(7).fill(0));
  const maxVal = Math.max(...matrix.flat(), 1);

  return (
    <Card
      sx={{
        borderRadius: 4,
        border: "1.5px solid #6366f1",
        width: 300,
        minHeight: 160,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 2,
        background: "rgba(38,40,60,0.91)",
        boxShadow: "none",
      }}
    >
      <CardContent sx={{ width: "100%", p: 0, "&:last-child": { pb: 0 } }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <ShowChartIcon sx={{ color: "#6366f1", mr: 1 }} />
          <Typography variant="subtitle1" fontWeight={700} color="#fff">
            Activity Heatmap
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.6 }}>
          {matrix.map((row, i) => (
            <Box key={i} sx={{ display: "flex", gap: 0.6 }}>
              {row.map((val, j) => (
                <Box
                  key={j}
                  sx={{
                    width: 22,
                    height: 22,
                    borderRadius: 2,
                    bgcolor: getColor(val, maxVal),
                    transition: "0.2s",
                  }}
                  title={`Day ${j + 1}: ${val} tx`}
                />
              ))}
            </Box>
          ))}
        </Box>
        <Box sx={{ mt: 1, display: "flex", justifyContent: "center", gap: 1 }}>
          <Typography variant="caption" color="#a5b4fc">
            Less
          </Typography>
          <Box
            sx={{
              width: 18,
              height: 8,
              bgcolor: COLOR_STEPS[1],
              borderRadius: 2,
              mx: 0.3,
            }}
          />
          <Box
            sx={{
              width: 18,
              height: 8,
              bgcolor: COLOR_STEPS[3],
              borderRadius: 2,
              mx: 0.3,
            }}
          />
          <Box
            sx={{
              width: 18,
              height: 8,
              bgcolor: COLOR_STEPS[5],
              borderRadius: 2,
              mx: 0.3,
            }}
          />
          <Typography variant="caption" color="#818cf8">
            More
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
