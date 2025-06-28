import apiService from "../../api/apiService";

export const GetAlertFromAllUser = async ({ page = 1, limit = 10 } = {}) => {
  try {
    const response = await apiService.get("/api/ai-analysis/alerts", {
      params: { page, limit },
    });

    return response;
  } catch (error) {
    console.log("get alert from all user error", error);
    throw error;
  }
};
