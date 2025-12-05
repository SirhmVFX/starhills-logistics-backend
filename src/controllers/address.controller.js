import {
  createAddressService,
  deleteAddressService,
  getAddressByIdService,
  getAddressesService,
  updateAddressService,
  validateAddressService,
} from "../services/address.services.js";

const handleResponse = (res, status, message, data) => {
  return res.status(status).json({ status, message, data });
};

export const validateAddress = async (req, res) => {
  try {
    await validateAddressService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const getAddresses = async (req, res) => {
  try {
    await getAddressesService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const getAddressById = async (req, res) => {
  try {
    await getAddressByIdService(res, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const createAddress = async (req, res) => {
  try {
    await createAddressService(res, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const updateAddress = async (req, res) => {
  try {
    await updateAddressService(res, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const deleteAddress = async (req, res) => {
  try {
    await deleteAddressService(res, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};
