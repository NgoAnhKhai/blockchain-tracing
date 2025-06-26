import apiService from "../../api/apiService";

export const GetDetailWallet = async (wallet, page = 1, limit = 50) => {
  try {
    const response = await apiService.get(`/api/v1/wallets/${wallet}`, {
      params: { page, limit },
    });
    return response;
  } catch (error) {
    throw new Error(
      `Error fetching wallet details for ID ${wallet}: ${error.message}`
    );
  }
};
