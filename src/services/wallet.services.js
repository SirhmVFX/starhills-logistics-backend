import prisma from "../prismaClient.js";
import axios from "axios";
import crypto from "crypto";

export const topupWalletService = async (req, res) => {
  try {
    const userId = req.user.id; // Authenticated user
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Valid amount is required" });
    }

    const response = await axios.post(
      "https://api.shipbubble.com/v1/shipping/wallet/fund",
      { amount },
      {
        headers: {
          Authorization: `Bearer ${process.env.SHIPBUBBLE_API_KEY}`,
        },
      }
    );

    const paymentUrl = response.data?.data?.payment_url;

    // Save a pending transaction
    const trx = await prisma.walletTransaction.create({
      data: {
        userId,
        amount,
        status: "pending",
        provider: "shipbubble",
        reference: paymentUrl, // use payment url as reference placeholder
      },
    });

    return res.status(200).json({
      message: "Funding link created successfully",
      payment_url: paymentUrl,
      transaction: trx,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Wallet topup request failed",
      error: error?.response?.data || error.message,
    });
  }
};

export const walletWebhookService = async (req, res) => {
  try {
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      return res.status(401).json({ message: "Invalid signature" });
    }

    const event = req.body;
    const reference = event?.data?.reference;
    const amountPaid = event?.data?.amount / 100; // Paystack uses kobo

    const transaction = await prisma.walletTransaction.findFirst({
      where: { reference },
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Update status
    await prisma.walletTransaction.update({
      where: { id: transaction.id },
      data: {
        status: "success",
        confirmedAmount: amountPaid,
      },
    });

    // Update User Wallet
    await prisma.wallet.update({
      where: { userId: transaction.userId },
      data: {
        balance: { increment: amountPaid },
      },
    });

    return res.status(200).json({ message: "Webhook received" });
  } catch (error) {
    return res.status(500).json({
      message: "Webhook error",
      error: error.message,
    });
  }
};

export const getWalletService = async (req, res) => {
  try {
    const userId = req.user.id;

    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    // Optional: Get Shipbubble Naira balance
    const shipbubble = await axios.get(
      "https://api.shipbubble.com/v1/shipping/wallet/balance",
      {
        headers: {
          Authorization: `Bearer ${process.env.SHIPBUBBLE_API_KEY}`,
        },
      }
    );

    return res.status(200).json({
      walletBalance: wallet?.balance || 0,
      shippingBalance: shipbubble.data?.data?.balance || 0,
      currency: "NGN",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load wallet",
      error: error?.response?.data || error.message,
    });
  }
};

export const getWalletTransactionsService = async (req, res) => {
  try {
    const userId = req.user.id;

    const transactions = await prisma.walletTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      message: "Transactions retrieved successfully",
      transactions,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch transactions",
      error,
    });
  }
};
