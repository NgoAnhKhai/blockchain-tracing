import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useTheme } from "@mui/material";

export default function WalletGraph({
  data,
  center,
  width = 800,
  height = 600,
  onNodeClick,
}) {
  const theme = useTheme();
  const ref = useRef();

  useEffect(() => {
    // Xây node/link từ edges
    const nodesMap = new Map();
    const links = [];
    data.forEach(({ from, to }) => {
      if (!nodesMap.has(from))
        nodesMap.set(from, { id: from, isCenter: from === center });
      if (!nodesMap.has(to))
        nodesMap.set(to, { id: to, isCenter: to === center });
      links.push({ source: from, target: to });
    });
    const nodes = Array.from(nodesMap.values());
    nodes.forEach((d) => {
      d.x = Math.random() * width;
      d.y = Math.random() * height;
    });

    // Init SVG
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .style("background", theme.palette.background.default)
      .style("cursor", "grab");

    const container = svg.append("g");

    // Zoom + Pan
    const zoomBehavior = d3
      .zoom()
      .scaleExtent([0.2, 5])
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
      })
      .on("start", () => {
        svg.style("cursor", "grabbing");
      })
      .on("end", () => {
        svg.style("cursor", "grab");
      });
    svg.call(zoomBehavior);

    // 2) defs: drop shadow + gradients
    const defs = container.append("defs");
    defs
      .append("filter")
      .attr("id", "drop-shadow")
      .append("feDropShadow")
      .attr("dx", 0)
      .attr("dy", 4)
      .attr("stdDeviation", 12)
      .attr("flood-color", "#111")
      .attr("flood-opacity", 0.5);

    // Node trung tâm (cha) - gradient tím xanh neon
    const gradCenter = defs.append("radialGradient").attr("id", "grad-center");
    gradCenter.append("stop").attr("offset", "0%").attr("stop-color", "#fff");
    gradCenter
      .append("stop")
      .attr("offset", "80%")
      .attr("stop-color", "#bb86fc");
    gradCenter
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#6d21ff");

    // Node con - gradient xanh dương neon/cam
    const gradChild = defs.append("radialGradient").attr("id", "grad-child");
    gradChild.append("stop").attr("offset", "0%").attr("stop-color", "#ffeedd");
    gradChild
      .append("stop")
      .attr("offset", "70%")
      .attr("stop-color", "#00ffe7");
    gradChild
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#33c6ff");

    // Link màu neon xanh nhạt
    const linkColor = "#00ffe799";

    // Draw links
    container
      .append("g")
      .attr("stroke", linkColor)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 2)
      .attr("stroke-linecap", "round");

    // Draw nodes
    const node = container
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d) => (d.isCenter ? 26 : 12))
      .attr("fill", (d) =>
        d.isCenter ? "url(#grad-center)" : "url(#grad-child)"
      )
      .attr("filter", "url(#drop-shadow)")
      .attr("stroke", (d) => (d.isCenter ? "#fff" : "#00ffe7"))
      .attr("stroke-width", (d) => (d.isCenter ? 4 : 2))
      .on("click", (e, d) => onNodeClick?.(d.id));

    node
      .on("mouseover", function (event, d) {
        d3.select(this)
          .transition()
          .duration(160)
          .attr("r", d.isCenter ? 32 : 16);
      })
      .on("mouseout", function (event, d) {
        d3.select(this)
          .transition()
          .duration(160)
          .attr("r", d.isCenter ? 26 : 12);
      });

    // Tick
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance(180)
          .strength(0.8)
      )
      .force("x", d3.forceX(width / 2).strength(0.1))
      .force("y", d3.forceY(height / 2).strength(0.1))
      .force(
        "collide",
        d3
          .forceCollide()
          .radius((d) => (d.isCenter ? 40 : 24))
          .strength(1)
      );
    simulation.on("tick", () => {
      container
        .selectAll("line")
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    });

    return () => simulation.stop();
  }, [data, center, width, height, theme, onNodeClick]);

  return <svg ref={ref} style={{ width: "100%", height: "100%" }} />;
}
