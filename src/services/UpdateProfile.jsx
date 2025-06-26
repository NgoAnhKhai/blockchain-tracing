import apiService from "../api/apiService";

export const updateProfile = async (data) => {
  try {
    const response = await apiService.put("/api/v1/auth/update-profile", data);
    return response;
  } catch (error) {
    console.log("Error updating profile:", error);
    throw error;
  }
};
