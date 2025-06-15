import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const WalletGraph = ({ data }) => {
  const ref = useRef();

  useEffect(() => {
    const width = 1400;
    const height = 900;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove(); // clear old

    const container = svg
      .attr("width", width)
      .attr("height", height)
      .append("g");

    svg.call(
      d3
        .zoom()
        .scaleExtent([0.1, 8])
        .on("zoom", (event) => {
          container.attr("transform", event.transform);
        })
    );

    // === Build nodes & links ===
    const nodesMap = new Map();
    const links = [];

    data.forEach(({ from, to }) => {
      if (!nodesMap.has(from))
        nodesMap.set(from, { id: from, isParent: true, group: from });
      if (!nodesMap.has(to)) nodesMap.set(to, { id: to, group: from });
      links.push({ source: from, target: to });
    });

    const nodes = Array.from(nodesMap.values());

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance(80)
      )
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = container
      .append("g")
      .attr("stroke", "#ccc")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-opacity", 0.4);

    const node = container
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d) => (d.isParent ? 16 : 6))
      .attr("fill", (d) => colorScale(d.group))
      .call(drag(simulation));

    const label = container
      .append("g")
      .selectAll("text")
      .data(nodes.filter((n) => n.isParent))
      .join("text")
      .text((d) => d.id.slice(0, 6) + "...")
      .attr("font-size", 10)
      .attr("fill", "#444")
      .attr("x", 10)
      .attr("y", 4);

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

      label.attr("x", (d) => d.x + 10).attr("y", (d) => d.y);
    });

    function drag(simulation) {
      return d3
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
        });
    }
  }, [data]);

  return <svg ref={ref} />;
};

export default WalletGraph;
