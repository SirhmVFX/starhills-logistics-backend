// src/services/support.services.js
import prisma from "../prismaClient.js";

export const createTicketService = async (req, res) => {
  try {
    const {
      subject,
      message,
      priority = "medium",
      attachments = [],
    } = req.body;

    const ticket = await prisma.supportTicket.create({
      data: {
        userId: req.user.id,
        subject,
        priority,
        status: "open",
        messages: {
          create: [
            {
              sender: "user",
              message,
              attachments,
            },
          ],
        },
      },
      include: {
        messages: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Support ticket created successfully",
      ticket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create ticket",
      error: error.message,
    });
  }
};

export const getTicketsService = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = { userId: req.user.id };
    if (status) where.status = status;

    const [tickets, total] = await Promise.all([
      prisma.supportTicket.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip,
        take: parseInt(limit),
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
            take: 1,
          },
        },
      }),
      prisma.supportTicket.count({ where }),
    ]);

    res.json({
      success: true,
      tickets,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tickets",
      error: error.message,
    });
  }
};

export const getTicketByIdService = async (req, res) => {
  try {
    const ticket = await prisma.supportTicket.findFirst({
      where: {
        id: req.params.ticketId,
        userId: req.user.id,
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    res.json({
      success: true,
      ticket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch ticket",
      error: error.message,
    });
  }
};

export const addMessageService = async (req, res) => {
  try {
    const { message } = req.body;

    // First verify the ticket exists and belongs to the user
    const ticket = await prisma.supportTicket.findFirst({
      where: {
        id: req.params.ticketId,
        userId: req.user.id,
      },
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    // Add the new message
    const newMessage = await prisma.supportMessage.create({
      data: {
        ticketId: req.params.ticketId,
        sender: "user",
        message,
      },
    });

    // Update ticket status and timestamp
    await prisma.supportTicket.update({
      where: { id: req.params.ticketId },
      data: {
        status: "awaiting_response",
        updatedAt: new Date(),
      },
    });

    res.json({
      success: true,
      message: "Message added successfully",
      ticket: {
        ...ticket,
        messages: [newMessage],
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add message",
      error: error.message,
    });
  }
};

export const getFAQsService = async (req, res) => {
  try {
    const { category } = req.query;

    // This would typically come from a database
    const faqs = [
      {
        category: "shipping",
        question: "How do I create a shipment?",
        answer:
          'You can create a shipment by going to the Shipments page and clicking "Create New Shipment".',
      },
      {
        category: "tracking",
        question: "How do I track my shipment?",
        answer:
          "Use your tracking number on the Tracking page to see real-time updates.",
      },
      {
        category: "billing",
        question: "How do I add funds to my wallet?",
        answer: 'Go to Wallet page and click "Fund Wallet" to add funds.',
      },
    ];

    const filteredFaqs = category
      ? faqs.filter((f) => f.category === category)
      : faqs;

    res.json({
      success: true,
      faqs: filteredFaqs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch FAQs",
      error: error.message,
    });
  }
};
