import apiService from "../../api/apiService";

export const GetAllSubscribeWallet = async () => {
  try {
    const response = await apiService.get("/api/v1/wallets/observations");
    return response;
  } catch (error) {
    console.log("subscribe wallet error:", error);
    throw error;
  }
};
