import apiService from "../../api/apiService";

export const UnsubscribeWallet = async (address) => {
  try {
    const response = await apiService.delete(
      `/api/v1/wallets/${address}/unsubscribe`
    );
    return response;
  } catch (error) {
    console.log("subscribe wallet error:", error);
    throw error;
  }
};
