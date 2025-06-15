import React, { useMemo } from "react";

import { Box } from "@mui/material";
import { generateClusteredWallets } from "../../utils/generateClusteredWallets";
import WalletGraph from "./WalletGraph";

export default function D3GraphView() {
  const data = useMemo(() => generateClusteredWallets(5, 20), []);
  return (
    <Box sx={{ flex: 1 }}>
      <WalletGraph data={data} />
    </Box>
  );
}
