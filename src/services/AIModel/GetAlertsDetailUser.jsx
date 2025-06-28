import apiService from "../../api/apiService";

export const GetAlertsDetailUser = async (address, page = 1, limit = 20) => {
  try {
    const response = await apiService.get(
      `/api/ai-analysis/alerts/${address}`,
      {
        params: { page, limit },
      }
    );
    return response;
  } catch (error) {
    console.log("Get alerts error", error);
    throw error;
  }
};
