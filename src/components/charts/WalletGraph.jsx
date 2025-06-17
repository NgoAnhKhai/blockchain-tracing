// src/components/WalletGraph.jsx
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useTheme } from "@mui/material";

export default function WalletGraph({ data, width = 800, height = 600 }) {
  const theme = useTheme();
  const ref = useRef();

  useEffect(() => {
    // 1) Clear & init SVG
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .style("background", theme.palette.background.default)
      .style("cursor", "grab");

    const container = svg.append("g");

    svg.call(
      d3
        .zoom()
        .scaleExtent([0.2, 5])
        .on("zoom", (event) => {
          container.attr("transform", event.transform);
        })
    );

    // 2) defs: drop shadow + gradients
    const defs = container.append("defs");

    // 2a) drop shadow, màu theo mode
    defs
      .append("filter")
      .attr("id", "drop-shadow")
      .append("feDropShadow")
      .attr("dx", 0)
      .attr("dy", 4)
      .attr("stdDeviation", 8)
      .attr("flood-color", theme.palette.mode === "dark" ? "#000" : "#333")
      .attr("flood-opacity", 0.5);

    // 2b) gradient trung tâm
    const gradCenter = defs.append("radialGradient").attr("id", "grad-center");
    gradCenter
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#BB86FC");
    gradCenter
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#6200EE");

    // 2c) gradient vệ tinh
    const gradChild = defs.append("radialGradient").attr("id", "grad-child");
    gradChild.append("stop").attr("offset", "0%").attr("stop-color", "#FF77A9");
    gradChild
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#FF006D");

    // 3) Build nodes & links
    const nodesMap = new Map();
    const links = [];
    data.forEach(({ from, to }) => {
      if (!nodesMap.has(from)) nodesMap.set(from, { id: from, isParent: true });
      if (!nodesMap.has(to)) nodesMap.set(to, { id: to, isParent: false });
      links.push({ source: from, target: to });
    });
    const nodes = Array.from(nodesMap.values());
    // random initial position
    nodes.forEach((d) => {
      d.x = Math.random() * width;
      d.y = Math.random() * height;
    });

    // 4) Force simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance(() => 100 + Math.random() * 50)
          .strength(0.6)
      )
      // giữ parent ở giữa
      .force(
        "x",
        d3.forceX(width / 2).strength((d) => (d.isParent ? 1 : 0))
      )
      .force(
        "y",
        d3.forceY(height / 2).strength((d) => (d.isParent ? 1 : 0))
      )
      .force(
        "collide",
        d3
          .forceCollide()
          .radius((d) => (d.isParent ? 40 : 20))
          .strength(0.8)
      );

    // 5) Draw links
    const linkColor =
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.2)"
        : "rgba(0,0,0,0.1)";
    const link = container
      .append("g")
      .attr("stroke", linkColor)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1)
      .attr("stroke-linecap", "round");

    // 6) Draw nodes
    const node = container
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d) => (d.isParent ? 20 : 8))
      .attr("fill", (d) =>
        d.isParent ? "url(#grad-center)" : "url(#grad-child)"
      )
      .attr("filter", "url(#drop-shadow)")
      .call(
        d3
          .drag()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    node
      .on("mouseover", function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", d.isParent ? 26 : 12);
      })
      .on("mouseout", function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", d.isParent ? 20 : 8);
      });

    // 7) Tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    });

    return () => simulation.stop();
  }, [data, width, height, theme]);

  return <svg ref={ref} style={{ width: "100%", height: "100%" }} />;
}
