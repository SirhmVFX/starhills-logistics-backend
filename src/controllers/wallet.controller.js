import {
  getWalletBalanceService,
  getWalletTransactionsService,
  requestFundService,
} from "../services/wallet.services.js";

const handleResponse = (res, status, message, data) => {
  return res.status(status).json({ status, message, data });
};

export const getWalletBalance = async (req, res) => {
  try {
    const wallet = await getWalletBalanceService(req.user.id);
    handleResponse(res, 200, "Wallet retrieved successfully", wallet);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const requestFund = async (req, res) => {
  try {
    const request = await requestFundService(req.body);
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
