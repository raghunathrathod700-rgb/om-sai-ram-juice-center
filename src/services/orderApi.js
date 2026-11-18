/** ORDERS against the Spring Boot backend. The server recalculates every price itself. */
import { http } from './http';

const mapOrder = (o) => ({
  id: o.id,
  status: o.status,
  fulfilment: o.fulfilment,
  items: o.items.map((i) => ({ id: i.id, name: i.name, price: Number(i.price), quantity: i.quantity })),
  deliveryInfo: o.deliveryInfo,
  payment: o.payment,
  subtotal: Number(o.subtotal),
  deliveryFee: Number(o.deliveryFee),
  total: Number(o.total),
  createdAt: o.createdAt,
  customer: o.customer || null,
});

export const mapServerOrder = mapOrder;

/** payload: { fulfilment, items:[{productId, quantity}], contact:{...}, paymentMethod, utr, latitude, longitude } */
export const placeOrder = async (payload) => {
  const res = await http.post('/api/orders', payload);
  return { order: mapOrder(res.order), razorpay: res.razorpay || null };
};

export const getMyOrders = async () => (await http.get('/api/orders/mine')).map(mapOrder);

/** Razorpay details to retry an unpaid online order. */
export const payAgain = (orderId) => http.post(`/api/orders/${encodeURIComponent(orderId)}/pay`);

export const verifyPayment = async (body) => mapOrder(await http.post('/api/payments/verify', body));
