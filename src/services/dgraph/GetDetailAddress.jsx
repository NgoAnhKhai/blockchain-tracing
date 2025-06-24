import apiService from "../../api/apiService";

export const GetDetailAddress = async (address) => {
  try {
    const response = await apiService.post("/api/v1/dgraph/address/sync", {
      address,
    });
    return response;
  } catch (error) {
    console.error("get detail address error: ", error);
    return null;
  }
};
