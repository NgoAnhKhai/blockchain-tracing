import apiService from "../../api/apiService";

export const GetObservations = async () => {
  try {
    const response = await apiService.get("/api/v1/wallets/observations");
    return response;
  } catch (error) {
    console.log("get observations error :", error);

    throw error;
  }
};
