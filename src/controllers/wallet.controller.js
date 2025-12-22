import {
  getWalletBalanceService,
  getWalletTransactionsService,
  handleFundingWebhookService,
  requestFundService,
} from "../services/wallet.services.js";

const handleResponse = (res, status, message, data) => {
  return res.status(status).json({ status, message, data });
};

export const getWalletBalance = async (req, res) => {
  try {
    await getWalletBalanceService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const requestFund = async (req, res) => {
  try {
    await requestFundService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const handleFundingWebhook = async (req, res) => {
  try {
    const request = await handleFundingWebhookService(req.body);
    handleResponse(res, 200, "Request created successfully", request);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const getWalletTransactions = async (req, res) => {
  try {
    const transactions = await getWalletTransactionsService(req.user.id);
    handleResponse(
      res,
      200,
      "Transactions retrieved successfully",
      transactions
    );
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};
