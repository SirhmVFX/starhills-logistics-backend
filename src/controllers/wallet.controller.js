const handleResponse = (res, status, message, data) => {
  return res.status(status).json({ status, message, data });
};

export const topupWallet = async (req, res) => {
  try {
    const { amount } = req.body;
    const topup = await topupWalletService(amount);
    handleResponse(res, 200, "Wallet topped up successfully", topup);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const walletWebhook = async (req, res) => {
  try {
    const webhook = await walletWebhookService(req.body);
    handleResponse(res, 200, "Webhook received successfully", webhook);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const getWallet = async (req, res) => {
  try {
    const wallet = await getWalletService(req.user.id);
    handleResponse(res, 200, "Wallet retrieved successfully", wallet);
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
