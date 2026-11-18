/**
 * ORDER SERVICE — DEMO (localStorage). Replace with POST /api/orders, GET /api/orders …
 */
import { generateId, getStatusFlow } from '../utils/helpers';
import { KEYS, readJSON, writeJSON } from './storage';

const readAll = () => readJSON(KEYS.orders, []);

export const createOrder = ({ id, userId, items, fulfilment, deliveryInfo, payment, totals }) => {
  const order = {
    id: id || generateId('OSR'),
    userId,
    // snapshot — later price changes must not rewrite history
    items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
    fulfilment,
    deliveryInfo,
    payment, // { method, status, paymentId, mode }
    subtotal: totals.subtotal,
    deliveryFee: totals.deliveryFee,
    total: totals.total,
    status: 'Order Placed',
    createdAt: new Date().toISOString(),
  };
  writeJSON(KEYS.orders, [order, ...readAll()]);
  return order;
};

export const getOrdersForUser = (userId) => readAll().filter((o) => o.userId === userId);

const update = (orderId, userId, mutate) => {
  const orders = readAll();
  const idx = orders.findIndex((o) => o.id === orderId && o.userId === userId);
  if (idx === -1) return null;
  orders[idx] = mutate({ ...orders[idx] });
  writeJSON(KEYS.orders, orders);
  return orders[idx];
};

/** DEMO helper: the shop would normally change this from an admin panel. */
export const advanceOrderStatus = (orderId, userId) =>
  update(orderId, userId, (order) => {
    const flow = getStatusFlow(order.fulfilment);
    const next = Math.min(flow.indexOf(order.status) + 1, flow.length - 1);
    order.status = flow[next];
    return order;
  });

/** DEMO helper: simulates the shop confirming a UPI-QR payment manually. */
export const markPaymentVerified = (orderId, userId, paidLabel) =>
  update(orderId, userId, (order) => {
    order.payment = { ...order.payment, status: paidLabel };
    return order;
  });
