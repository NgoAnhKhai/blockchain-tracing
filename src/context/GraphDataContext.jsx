import React, { createContext, useContext, useState } from "react";

const GraphDataContext = createContext();

export function useGraphData() {
  return useContext(GraphDataContext);
}

export function GraphDataProvider({ children }) {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  return (
    <GraphDataContext.Provider value={{ graphData, setGraphData }}>
      {children}
    </GraphDataContext.Provider>
  );
}
