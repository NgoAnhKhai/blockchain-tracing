import React, { useEffect, useRef, useMemo, useState } from "react";
import * as d3 from "d3";
import { useTheme } from "@mui/material";

function randomPastelColor() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 75%, 72%)`;
}
function getHue(hsl) {
  return parseInt(hsl.match(/hsl\((\d+),/)[1], 10);
}
function generate2DistinctPastel() {
  let color1 = randomPastelColor();
  let color2 = randomPastelColor();
  while (Math.abs(getHue(color1) - getHue(color2)) < 70) {
    color2 = randomPastelColor();
  }
  return [color1, color2];
}

export default function WalletGraph({
  data,
  center,
  width = 800,
  height = 600,
  onNodeClick,
}) {
  const theme = useTheme();
  const ref = useRef();

  const [sentColor, receivedColor] = useMemo(generate2DistinctPastel, [center]);

  const [hoveredNode, setHoveredNode] = useState(null);

  useEffect(() => {
    const nodesMap = new Map();
    const links = [];
    data.forEach(({ from, to }) => {
      if (!nodesMap.has(center))
        nodesMap.set(center, { id: center, isCenter: true, type: "center" });
      if (from === center && !nodesMap.has(to)) {
        nodesMap.set(to, { id: to, isCenter: false, type: "sent" });
      }
      if (to === center && !nodesMap.has(from)) {
        nodesMap.set(from, { id: from, isCenter: false, type: "received" });
      }
      links.push({ source: from, target: to });
    });
    const nodes = Array.from(nodesMap.values());
    nodes.forEach((d) => {
      d.x = Math.random() * width;
      d.y = Math.random() * height;
    });

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .style("background", theme.palette.background.default)
      .style("cursor", "grab");

    const container = svg.append("g");

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

    const linkColor = "#00ffe799";
    container
      .append("g")
      .attr("stroke", linkColor)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 2)
      .attr("stroke-linecap", "round");
    const node = container
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d) => (d.isCenter ? 26 : 14))
      .attr("fill", (d) =>
        d.isCenter
          ? "url(#grad-center)"
          : d.type === "sent"
          ? sentColor
          : receivedColor
      )
      .attr("filter", "url(#drop-shadow)")
      .attr("stroke", (d) => (d.isCenter ? "#fff" : "#444"))
      .attr("stroke-width", (d) => (d.isCenter ? 4 : 2))
      .style("cursor", "pointer")
      .on("click", (e, d) => onNodeClick?.(d.id));

    node
      .on("mouseover", function (event, d) {
        d3.select(this)
          .transition()
          .duration(160)
          .attr("r", d.isCenter ? 32 : 18);
        const matrix = this.getScreenCTM();
        if (!matrix) return;
        const { x, y } = this;
        const svgRect = ref.current.getBoundingClientRect();
        const cx = +this.getAttribute("cx");
        const cy = +this.getAttribute("cy");
        const point = ref.current.createSVGPoint();
        point.x = cx;
        point.y = cy;
        const transformed = point.matrixTransform(
          this.ownerSVGElement.getScreenCTM()
        );
        setHoveredNode({
          address: d.id,
          x: transformed.x - svgRect.left,
          y: transformed.y - svgRect.top,
        });
      })
      .on("mousemove", function (event, d) {
        const svgRect = ref.current.getBoundingClientRect();
        setHoveredNode({
          address: d.id,
          x: event.clientX - svgRect.left,
          y: event.clientY - svgRect.top,
        });
      })
      .on("mouseout", function (event, d) {
        d3.select(this)
          .transition()
          .duration(160)
          .attr("r", d.isCenter ? 26 : 14);
        setHoveredNode(null);
      });

    node.call(
      d3
        .drag()
        .on("start", function (event, d) {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", function (event, d) {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", function (event, d) {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
    );

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
          .radius((d) => (d.isCenter ? 40 : 22))
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
  }, [
    data,
    center,
    width,
    height,
    theme,
    onNodeClick,
    sentColor,
    receivedColor,
  ]);

  return (
    <div style={{ width: "100%", height: "80vh", position: "relative" }}>
      <svg ref={ref} style={{ width: "100%", height: "100%" }} />
      {/* ===== POPUP HIỆN ADDRESS KHI HOVER ===== */}
      {hoveredNode && (
        <div
          style={{
            position: "absolute",
            left: hoveredNode.x,
            top: hoveredNode.y - 34,
            transform: "translate(-50%,-100%)",
            pointerEvents: "none",
            padding: "8px 18px",
            background: "linear-gradient(120deg,#24214a 60%,#792b99 120%)",
            color: "#fff",
            borderRadius: 9,
            fontFamily: "monospace",
            fontSize: 14,
            fontWeight: 700,
            boxShadow: "0 2px 12px #6d21ff2a",
            zIndex: 22,
            whiteSpace: "nowrap",
            maxWidth: 320,
            overflow: "hidden",
            textOverflow: "ellipsis",
            border: "1.5px solid #8463e0",
            opacity: 0.97,
            transition: "opacity 0.12s",
            letterSpacing: 0.6,
          }}
        >
          {hoveredNode.address}
        </div>
      )}
      {/* Legend dưới cùng giữ nguyên */}
      <div
        style={{
          position: "absolute",
          right: 18,
          bottom: 18,
          background: "rgba(28,24,45,0.93)",
          borderRadius: 12,
          boxShadow: "0 2px 16px #6d21ff24",
          padding: "10px 20px",
          fontSize: 15,
          color: "#eee",
          zIndex: 9,
          minWidth: 140,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
          <span
            style={{
              display: "inline-block",
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: "linear-gradient(120deg,#bb86fc,#6d21ff 80%)",
              marginRight: 9,
              border: "2.5px solid #fff",
            }}
          />
          Main node (center)
        </div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
          <span
            style={{
              display: "inline-block",
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: sentColor,
              marginRight: 9,
              border: "2px solid #444",
            }}
          />
          Sent node (sent)
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{
              display: "inline-block",
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: receivedColor,
              marginRight: 9,
              border: "2px solid #444",
            }}
          />
          Received node (received)
        </div>
      </div>
    </div>
  );
}
