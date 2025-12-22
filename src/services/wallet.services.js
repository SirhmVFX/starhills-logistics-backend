import prisma from "../prismaClient.js";
import { makeShipbubbleRequest } from "./shipbubble.service.js";

export const getWalletBalanceService = async (req, res) => {
  try {
    const userId = req.user.id;
    // Get user's wallet from the database
    const wallet = await prisma.wallet.findUnique({
      where: { userId: userId },
      include: {
        transactions: {
          orderBy: { createdAt: "desc" },
          take: 10, // Last 10 transactions
        },
      },
    });
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found",
      });
    }
    res.json({
      success: true,
      balance: wallet.balance,
      currency: "NGN", // Assuming NGN as default currency
      recentTransactions: wallet.transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch wallet balance",
      error: error.message,
    });
  }
};

export const requestFundService = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.id;

    // Input validation
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid amount to fund",
      });
    }

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { wallet: true },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Create wallet if it doesn't exist
    if (!user.wallet) {
      await prisma.wallet.create({
        data: {
          userId: user.id,
          balance: 0,
        },
      });
    }

    // Call Shipbubble API to create funding request
    const result = await makeShipbubbleRequest(
      "/shipping/wallet/fund",
      "POST",
      { amount: parseFloat(amount) }
    );

    if (!result.success || !result.data?.payment_url) {
      console.error(
        "Shipbubble funding error:",
        result.error || "No payment URL received"
      );
      return res.status(400).json({
        success: false,
        message: result.error || "Failed to create funding request",
      });
    }

    // Record the funding request in our database
    const transaction = await prisma.transaction.create({
      data: {
        wallet: { connect: { userId } },
        amount: parseFloat(amount),
        type: "FUNDING_REQUEST",
        meta: {
          status: "PENDING",
          payment_url: result.data.payment_url,
          reference: `FUND-${Date.now()}-${userId.substring(0, 8)}`,
        },
      },
    });

    // Return the payment URL to the client
    res.json({
      success: true,
      message: "Funding request created successfully",
      data: {
        payment_url: result.data.payment_url,
        transaction_id: transaction.id,
      },
    });
  } catch (error) {
    console.error("Error in requestFundService:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process funding request",
      error: error.message,
    });
  }
};

export const handleFundingWebhookService = async (req, res) => {
  const session = await prisma.$transaction(async (tx) => {
    try {
      const { reference, status, amount } = req.body;
      // Find the pending transaction
      const transactions = await tx.transaction.findMany({
        where: {
          meta: {
            path: ["reference"],
            equals: reference,
          },
          type: "FUNDING_REQUEST",
        },
        include: {
          wallet: true,
        },
      });
      if (transactions.length === 0) {
        throw new Error("Transaction not found");
      }
      const transaction = transactions[0];
      // Only process if transaction is pending
      if (transaction.meta.status !== "PENDING") {
        return {
          success: true,
          message: "Transaction already processed",
        };
      }
      if (status === "successful") {
        // Update wallet balance
        await tx.wallet.update({
          where: { id: transaction.walletId },
          data: {
            balance: {
              increment: parseFloat(amount),
            },
          },
        });
        // Update transaction status
        await tx.transaction.update({
          where: { id: transaction.id },
          data: {
            meta: {
              ...transaction.meta,
              status: "COMPLETED",
              completedAt: new Date(),
            },
          },
        });
        return {
          success: true,
          message: "Wallet funded successfully",
        };
      } else {
        // Update as failed
        await tx.transaction.update({
          where: { id: transaction.id },
          data: {
            meta: {
              ...transaction.meta,
              status: "FAILED",
              failedAt: new Date(),
            },
          },
        });
        return {
          success: false,
          message: "Payment failed",
        };
      }
    } catch (error) {
      console.error("Error processing funding webhook:", error);
      throw error;
    }
  });
  res.json(session);
};

export const getWalletTransactionsService = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    // Get user's wallet
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    });
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found",
      });
    }
    // Get transactions with pagination
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: { walletId: wallet.id },
        orderBy: { createdAt: "desc" },
        skip,
        take: parseInt(limit),
      }),
      prisma.transaction.count({
        where: { walletId: wallet.id },
      }),
    ]);
    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
      error: error.message,
    });
  }
};
