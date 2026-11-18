package com.omsairam.juice.service;

import com.omsairam.juice.config.Props;
import com.omsairam.juice.dto.Dtos.ContactRequest;
import com.omsairam.juice.dto.Dtos.CustomerDto;
import com.omsairam.juice.dto.Dtos.DeliveryInfoDto;
import com.omsairam.juice.dto.Dtos.OrderDto;
import com.omsairam.juice.dto.Dtos.OrderItemDto;
import com.omsairam.juice.dto.Dtos.OrderLineRequest;
import com.omsairam.juice.dto.Dtos.OrderRequest;
import com.omsairam.juice.dto.Dtos.PaymentDto;
import com.omsairam.juice.dto.Dtos.PlaceOrderResponse;
import com.omsairam.juice.dto.Dtos.RazorpayInfo;
import com.omsairam.juice.dto.Dtos.StatsDto;
import com.omsairam.juice.dto.Dtos.VerifyPaymentRequest;
import com.omsairam.juice.model.AppUser;
import com.omsairam.juice.model.CustomerOrder;
import com.omsairam.juice.model.OrderItem;
import com.omsairam.juice.model.Product;
import com.omsairam.juice.repo.OrderRepository;
import com.omsairam.juice.repo.ProductRepository;
import com.omsairam.juice.repo.UserRepository;
import com.omsairam.juice.security.UserPrincipal;
import com.omsairam.juice.web.ApiException;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Orders. The server NEVER trusts prices sent by the browser: it reads every price from the
 * database and calculates the totals itself.
 */
@Service
public class OrderService {
    public static final String PAY_ON_DELIVERY = "Pay on delivery";
    public static final String AWAITING_VERIFICATION = "Awaiting verification";
    public static final String AWAITING_PAYMENT = "Awaiting payment";
    public static final String PAID = "Paid";
    private static final Set<String> PAYMENT_STATUSES = Set.of(PAY_ON_DELIVERY, AWAITING_VERIFICATION, AWAITING_PAYMENT, PAID);

    private static final List<String> DELIVERY_FLOW = List.of("Order Placed", "Preparing", "Ready", "Out for Delivery", "Delivered");
    private static final List<String> PICKUP_FLOW = List.of("Order Placed", "Preparing", "Ready", "Picked Up");
    private static final String CANCELLED = "Cancelled";
    private static final ZoneId SHOP_ZONE = ZoneId.of("Asia/Kolkata");

    private final OrderRepository orders;
    private final ProductRepository products;
    private final UserRepository users;
    private final DeliveryService delivery;
    private final PaymentService payments;
    private final Props.Shop shop;

    public OrderService(
            OrderRepository orders,
            ProductRepository products,
            UserRepository users,
            DeliveryService delivery,
            PaymentService payments,
            Props.Shop shop) {
        this.orders = orders;
        this.products = products;
        this.users = users;
        this.delivery = delivery;
        this.payments = payments;
        this.shop = shop;
    }

    /* ------------------------------ customer ------------------------------ */
    @Transactional
    public PlaceOrderResponse place(UserPrincipal me, OrderRequest req) {
        AppUser user = users.findById(me.id()).orElseThrow(() -> ApiException.unauthorized("Please login again."));
        boolean isDelivery = "delivery".equals(req.fulfilment());
        ContactRequest contact = req.contact();

        if (isDelivery) {
            if (isBlank(contact.address())) {
                throw ApiException.badRequest("Delivery address is required.");
            }
            if (isBlank(contact.pincode())) {
                throw ApiException.badRequest("Enter a valid 6-digit pincode.");
            }
            delivery.verify(req.latitude(), req.longitude());
        }

        // merge duplicate lines of the same product
        Map<Long, Integer> quantities = new LinkedHashMap<>();
        for (OrderLineRequest line : req.items()) {
            quantities.merge(line.productId(), line.quantity(), Integer::sum);
        }
        List<Product> found = products.findAllById(quantities.keySet());
        if (found.size() != quantities.size()) {
            throw ApiException.badRequest("Some items in your cart are no longer on the menu. Please refresh your cart.");
        }

        CustomerOrder order = new CustomerOrder();
        order.setId(newOrderId());
        order.setUser(user);
        order.setFulfilment(req.fulfilment());
        order.setContactName(contact.fullName().trim());
        order.setContactMobile(contact.mobile().trim());
        order.setAddress(isDelivery ? contact.address().trim() : "Self pickup at the shop");
        order.setLandmark(isDelivery && contact.landmark() != null ? contact.landmark().trim() : null);
        order.setPincode(isDelivery ? contact.pincode().trim() : null);

        BigDecimal subtotal = BigDecimal.ZERO;
        for (Product p : found) {
            if (!p.isAvailable()) {
                throw ApiException.badRequest(p.getName() + " is sold out right now. Please remove it from your cart.");
            }
            int qty = quantities.get(p.getId());
            OrderItem item = new OrderItem();
            item.setProductId(p.getId());
            item.setName(p.getName());
            item.setPrice(p.getPrice());
            item.setQuantity(qty);
            order.addItem(item);
            subtotal = subtotal.add(p.getPrice().multiply(BigDecimal.valueOf(qty)));
        }
        BigDecimal fee = isDelivery ? shop.deliveryFee() : BigDecimal.ZERO;
        order.setSubtotal(subtotal);
        order.setDeliveryFee(fee);
        order.setTotal(subtotal.add(fee));

        order.setPaymentMethod(req.paymentMethod());
        switch (req.paymentMethod()) {
            case "cod" -> order.setPaymentStatus(PAY_ON_DELIVERY);
            case "upi" -> {
                String utr = req.utr() == null ? "" : req.utr().trim();
                if (!utr.matches("^[A-Za-z0-9]{8,22}$")) {
                    throw ApiException.badRequest("Enter the UPI transaction / UTR number shown in your payment app.");
                }
                order.setPaymentStatus(AWAITING_VERIFICATION); // never auto-paid: the shop verifies it
                order.setPaymentRef(utr);
            }
            default -> {
                order.setPaymentStatus(AWAITING_PAYMENT);
                order.setRazorpayOrderId(payments.createRazorpayOrder(order));
            }
        }

        orders.save(order);
        RazorpayInfo info = "online".equals(req.paymentMethod()) ? payments.infoFor(order) : null;
        return new PlaceOrderResponse(toDto(order, false), info);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> myOrders(UserPrincipal me) {
        return orders.findByUserIdOrderByCreatedAtDesc(me.id()).stream().map(o -> toDto(o, false)).toList();
    }

    /** Retry of an online payment that was cancelled or failed. */
    @Transactional
    public RazorpayInfo payAgain(UserPrincipal me, String orderId) {
        CustomerOrder order = ownOrder(me, orderId);
        if (!"online".equals(order.getPaymentMethod()) || !AWAITING_PAYMENT.equals(order.getPaymentStatus())) {
            throw ApiException.badRequest("This order does not need an online payment.");
        }
        if (CANCELLED.equals(order.getStatus())) {
            throw ApiException.badRequest("This order was cancelled.");
        }
        if (order.getRazorpayOrderId() == null) {
            order.setRazorpayOrderId(payments.createRazorpayOrder(order));
            orders.save(order);
        }
        return payments.infoFor(order);
    }

    @Transactional
    public OrderDto verifyPayment(UserPrincipal me, VerifyPaymentRequest req) {
        CustomerOrder order = ownOrder(me, req.orderId());
        if (PAID.equals(order.getPaymentStatus())) {
            return toDto(order, false); // already confirmed (idempotent)
        }
        if (order.getRazorpayOrderId() == null || !order.getRazorpayOrderId().equals(req.razorpayOrderId())) {
            throw ApiException.badRequest("This payment does not belong to the order.");
        }
        if (!payments.verifySignature(req.razorpayOrderId(), req.razorpayPaymentId(), req.razorpaySignature())) {
            throw ApiException.badRequest("Payment could not be verified. If money was deducted, please contact the shop.");
        }
        order.setPaymentStatus(PAID);
        order.setPaymentRef(req.razorpayPaymentId());
        return toDto(orders.save(order), false);
    }

    private CustomerOrder ownOrder(UserPrincipal me, String orderId) {
        return orders.findById(orderId)
                .filter(o -> o.getUser().getId().equals(me.id()))
                .orElseThrow(() -> ApiException.notFound("Order not found."));
    }

    /* ------------------------------ admin ------------------------------ */
    @Transactional(readOnly = true)
    public List<OrderDto> adminList(String status) {
        List<CustomerOrder> list = isBlank(status) ? orders.findAllByOrderByCreatedAtDesc() : orders.findByStatusOrderByCreatedAtDesc(status);
        return list.stream().map(o -> toDto(o, true)).toList();
    }

    @Transactional
    public OrderDto updateStatus(String orderId, String status) {
        CustomerOrder order = orders.findById(orderId).orElseThrow(() -> ApiException.notFound("Order not found."));
        List<String> flow = "pickup".equals(order.getFulfilment()) ? PICKUP_FLOW : DELIVERY_FLOW;
        if (!flow.contains(status) && !CANCELLED.equals(status)) {
            throw ApiException.badRequest("Invalid status for this order.");
        }
        order.setStatus(status);
        return toDto(orders.save(order), true);
    }

    @Transactional
    public OrderDto updatePaymentStatus(String orderId, String status) {
        if (!PAYMENT_STATUSES.contains(status)) {
            throw ApiException.badRequest("Invalid payment status.");
        }
        CustomerOrder order = orders.findById(orderId).orElseThrow(() -> ApiException.notFound("Order not found."));
        order.setPaymentStatus(status);
        return toDto(orders.save(order), true);
    }

    @Transactional(readOnly = true)
    public StatsDto stats() {
        Instant startOfToday = LocalDate.now(SHOP_ZONE).atStartOfDay(SHOP_ZONE).toInstant();
        long pending = orders.countByStatus("Order Placed") + orders.countByStatus("Preparing");
        return new StatsDto(
                orders.countByCreatedAtGreaterThanEqual(startOfToday),
                zeroIfNull(orders.sumTotalSince(startOfToday)),
                pending,
                orders.countByPaymentStatus(AWAITING_VERIFICATION),
                zeroIfNull(orders.sumPaid()),
                orders.count(),
                products.count());
    }

    /* ------------------------------ mapping ------------------------------ */
    private OrderDto toDto(CustomerOrder o, boolean withCustomer) {
        List<OrderItemDto> items = o.getItems().stream()
                .map(i -> new OrderItemDto(i.getProductId(), i.getName(), i.getPrice(), i.getQuantity()))
                .toList();
        CustomerDto customer = null;
        if (withCustomer) {
            AppUser u = o.getUser();
            customer = new CustomerDto(u.getFullName(), u.getMobile(), u.getEmail());
        }
        return new OrderDto(
                o.getId(),
                o.getStatus(),
                o.getFulfilment(),
                items,
                new DeliveryInfoDto(o.getContactName(), o.getContactMobile(), o.getAddress(), o.getLandmark(), o.getPincode()),
                new PaymentDto(o.getPaymentMethod(), o.getPaymentStatus(), o.getPaymentRef(), "server"),
                o.getSubtotal(),
                o.getDeliveryFee(),
                o.getTotal(),
                o.getCreatedAt(),
                customer);
    }

    private static String newOrderId() {
        return "OSR-" + Long.toString(System.currentTimeMillis(), 36).toUpperCase() + (int) (100 + Math.random() * 900);
    }

    private static BigDecimal zeroIfNull(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

    private static boolean isBlank(String s) {
        return s == null || s.isBlank();
    }
}
