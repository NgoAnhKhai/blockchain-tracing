import apiService from "../api/apiService";

export const getUserProfile = async () => {
  try {
    const response = await apiService.get("/api/v1/auth/profile");
    return response;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};
