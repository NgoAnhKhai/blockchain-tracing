import apiService from "../../api/apiService";

export const getTraceWallet = async (address) => {
  try {
    const response = await apiService.get(`/api/v1/dgraph/trace/${address}`);
    return response;
  } catch (error) {
    console.error("Error fetching trace wallet:", error);
    throw error;
  }
};
