import axios from "axios";

const SHIPBUBBLE_BASE_URL = "https://api.shipbubble.com/v1"; // Update with actual base URL

export const shipbubbleRequest = async (
  endpoint,
  method = "GET",
  data = null
) => {
  try {
    const config = {
      method,
      url: `${SHIPBUBBLE_BASE_URL}${endpoint}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SHIPBUBBLE_API_KEY}`,
      },
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to make request to Shipbubble API",
      error: error.message,
    };
  }
};
