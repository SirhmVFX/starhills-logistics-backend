// src/controllers/support.controller.js
import {
  addMessageService,
  createTicketService,
  getFAQsService,
  getTicketByIdService,
  getTicketsService,
} from "../services/support.services.js";

const handleResponse = (res, status, message, data) => {
  return res.status(status).json({ status, message, data });
};

export const createTicket = async (req, res) => {
  try {
    await createTicketService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const getTickets = async (req, res) => {
  try {
    await getTicketsService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const getTicketById = async (req, res) => {
  try {
    await getTicketByIdService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const addMessage = async (req, res) => {
  try {
    await addMessageService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const getFAQs = async (req, res) => {
  try {
    await getFAQsService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};
