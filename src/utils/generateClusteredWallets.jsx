import { randomHexAddress } from "./generateNodes";

/**
 * Sinh dữ liệu gồm nhiều cụm (n cluster), mỗi cụm có 1 node cha và nhiều node con.
 */
export function generateClusteredWallets(
  clusterCount = 5,
  childrenPerCluster = 100
) {
  const data = [];

  for (let i = 0; i < clusterCount; i++) {
    const parent = randomHexAddress();
    for (let j = 0; j < childrenPerCluster; j++) {
      const child = randomHexAddress();
      data.push({ from: parent, to: child });
    }
  }

  return data;
}
