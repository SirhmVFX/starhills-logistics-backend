// src/services/shipbubble.service.js
import { shipbubbleRequest } from "../utils/shipbubble.js";

export const makeShipbubbleRequest = async (
  endpoint,
  method = "GET",
  data = null
) => {
  return shipbubbleRequest(
    endpoint,
    method,
    data,
    process.env.SHIPBUBBLE_API_KEY
  );
};
