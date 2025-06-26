import apiService from "../../api/apiService";

export const GetWalletTransaction = async (wallet) => {
  try {
    const response = await apiService.get(
      `/api/v1/wallets/${wallet}/transactions`
    );
    return response;
  } catch (error) {
    throw new Error(`Failed to get wallet transaction: ${error.message}`);
  }
};
