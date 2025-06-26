import apiService from "../../api/apiService";

export const SubscribeWallet = async (wallet_address) => {
  try {
    const response = await apiService.post("/api/v1/wallets/subscribe", {
      wallet_address,
    });
    return response;
  } catch (error) {
    console.log("subscribe wallet error:", error);
    throw error;
  }
};
