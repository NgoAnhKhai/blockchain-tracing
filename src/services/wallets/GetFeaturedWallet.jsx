import apiService from "../../api/apiService";

export const GetFeaturedWallet = async () => {
  try {
    const response = await apiService.get("/api/v1/wallets/featured");
    return response;
  } catch (error) {
    console.error("Get featured wallet error", error);
  }
};
