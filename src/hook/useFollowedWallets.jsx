// import { useEffect, useState } from "react";

// import { SubscribeWallet } from "../services/follow/SubscribeWallet";
// import { UnsubscribeWallet } from "../services/follow/UnsubscribeWallet";
// import { GetAllSubscribeWallet } from "../services/follow/GetAllSubscribeWallet";

// export default function useFollowedWallets() {
//   const [followed, setFollowed] = useState({});
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     async function fetchFollowed() {
//       try {
//         const res = await GetAllSubscribeWallet();
//         const followedMap = {};
//         (res?.data || []).forEach((wallet) => {
//           if (wallet.address) {
//             followedMap[wallet.address.toLowerCase()] = true;
//           }
//         });
//         setFollowed(followedMap);
//       } catch (err) {
//         console.error("Failed to fetch followed wallets", err);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//     fetchFollowed();
//   }, []);

//   const toggleFollow = async (address) => {
//     const addr = address.toLowerCase();
//     try {
//       if (followed[addr]) {
//         await UnsubscribeWallet(addr);
//         setFollowed((prev) => {
//           const copy = { ...prev };
//           delete copy[addr];
//           return copy;
//         });
//       } else {
//         await SubscribeWallet(addr);
//         setFollowed((prev) => ({ ...prev, [addr]: true }));
//       }
//     } catch (err) {
//       console.error("Follow/unfollow failed", err);
//     }
//   };

//   return { followed, toggleFollow, isLoading };
// }
