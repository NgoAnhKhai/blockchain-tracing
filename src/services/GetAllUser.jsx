import apiService from "../api/apiService";

export const getUserProfile = async () => {
  try {
    const response = await apiService.get("/api/v1/wallets/featured");
    return response.data;
  } catch (error) {
    console.log("Error fetching user profile:", error);
    throw error;
  }
};
