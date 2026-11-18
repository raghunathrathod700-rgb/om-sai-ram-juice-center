/**
 * ORDER SERVICE — one interface, two engines:
 *   local demo (orderLocal.js)  or  Spring Boot backend (orderApi.js).
 */
import { USE_API } from '../config/shop';
import * as api from './orderApi';
import * as local from './orderLocal';

export const supportsDemoControls = !USE_API; // "Next status" buttons only make sense without a backend

/** local demo only */
export const createOrder = (data) => local.createOrder(data);
export const advanceOrderStatus = (orderId, userId) => local.advanceOrderStatus(orderId, userId);
export const markPaymentVerified = (orderId, userId, label) => local.markPaymentVerified(orderId, userId, label);

/** both modes */
export const getOrdersForUser = async (userId) => (USE_API ? api.getMyOrders() : local.getOrdersForUser(userId));

/** backend only */
export const placeOrder = (payload) => api.placeOrder(payload);
export const payAgain = (orderId) => api.payAgain(orderId);
export const verifyPayment = (body) => api.verifyPayment(body);
