// src/routes/support.routes.js
import express from "express";
import {
  addMessage,
  createTicket,
  getFAQs,
  getTicketById,
  getTickets,
} from "../controllers/support.controller.js";

const router = express.Router();

router.get("/tickets", getTickets);
router.post("/tickets", createTicket);
router.get("/tickets/:ticketId", getTicketById);
router.post("/tickets/:ticketId/messages", addMessage);
router.get("/faqs", getFAQs);

export default router;
