package com.omsairam.juice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

/** Request / response shapes of the REST API (the React app reads exactly these fields). */
public final class Dtos {
    private Dtos() {}

    private static final String MOBILE = "^[6-9]\\d{9}$";
    private static final String MOBILE_MSG = "Enter a valid 10-digit mobile number.";

    /* ------------------------------ auth ------------------------------ */
    public record RegisterRequest(
            @NotBlank(message = "Full name is required.") @Size(max = 100) String fullName,
            @NotBlank(message = MOBILE_MSG) @Pattern(regexp = MOBILE, message = MOBILE_MSG) String mobile,
            @NotBlank(message = "Email is required.") @Email(message = "Enter a valid email address.") @Size(max = 150) String email,
            @NotBlank(message = "Password is required.") @Size(min = 6, max = 100, message = "Password must be at least 6 characters.") String password,
            @NotBlank(message = "Address is required.") @Size(max = 500) String address) {}

    public record LoginRequest(
            @NotBlank(message = "Email / mobile is required.") String identifier,
            @NotBlank(message = "Password is required.") String password) {}

    public record ProfileRequest(
            @NotBlank(message = "Full name is required.") @Size(max = 100) String fullName,
            @NotBlank(message = "Email is required.") @Email(message = "Enter a valid email address.") @Size(max = 150) String email,
            @NotBlank(message = MOBILE_MSG) @Pattern(regexp = MOBILE, message = MOBILE_MSG) String mobile,
            @NotBlank(message = "Address is required.") @Size(max = 500) String address) {}

    public record UserDto(Long id, String fullName, String email, String mobile, String address, String role) {}

    public record AuthResponse(String token, UserDto user) {}

    /* ----------------------------- catalogue ----------------------------- */
    public record CategoryDto(String id, String name, String icon) {}

    public record CategoryRequest(
            @NotBlank(message = "Category name is required.") @Size(max = 80) String name,
            @Size(max = 40) String icon) {}

    public record ProductDto(
            Long id,
            String name,
            String category,
            String categoryName,
            BigDecimal price,
            String description,
            String imageType,
            String color,
            String brand,
            Double rating,
            boolean available,
            boolean featured,
            String imageUrl) {}

    public record ProductRequest(
            @NotBlank(message = "Product name is required.") @Size(max = 120) String name,
            @NotBlank(message = "Choose a category.") String category,
            @NotNull(message = "Price is required.")
                    @DecimalMin(value = "0.01", message = "Price must be more than 0.")
                    @DecimalMax(value = "100000", message = "Price is too large.")
                    BigDecimal price,
            @Size(max = 600) String description,
            @Pattern(regexp = "juice|lassi|shake|faluda|icecream|combo", message = "Invalid picture style.") String imageType,
            @Pattern(regexp = "^#[0-9a-fA-F]{6}$", message = "Colour must look like #FF9800.") String color,
            @Size(max = 60) String brand,
            @DecimalMin(value = "0", message = "Rating must be between 0 and 5.")
                    @DecimalMax(value = "5", message = "Rating must be between 0 and 5.")
                    BigDecimal rating,
            Boolean available,
            Boolean featured) {}

    /* ------------------------------ orders ------------------------------ */
    public record OrderLineRequest(
            @NotNull(message = "Product is required.") Long productId,
            @Min(value = 1, message = "Quantity must be at least 1.") @Max(value = 20, message = "Maximum quantity per item is 20.") int quantity) {}

    public record ContactRequest(
            @NotBlank(message = "Full name is required.") @Size(max = 100) String fullName,
            @NotBlank(message = MOBILE_MSG) @Pattern(regexp = MOBILE, message = MOBILE_MSG) String mobile,
            @Size(max = 500) String address,
            @Size(max = 150) String landmark,
            @Pattern(regexp = "^$|^\\d{6}$", message = "Enter a valid 6-digit pincode.") String pincode) {}

    public record OrderRequest(
            @NotBlank @Pattern(regexp = "delivery|pickup", message = "Invalid order type.") String fulfilment,
            @NotEmpty(message = "Your cart is empty.") @Size(max = 30, message = "Too many items in one order.") List<@Valid OrderLineRequest> items,
            @NotNull(message = "Contact details are required.") @Valid ContactRequest contact,
            @NotBlank @Pattern(regexp = "cod|upi|online", message = "Invalid payment method.") String paymentMethod,
            @Size(max = 40) String utr,
            Double latitude,
            Double longitude) {}

    public record OrderItemDto(Long id, String name, BigDecimal price, int quantity) {}

    public record DeliveryInfoDto(String fullName, String mobile, String address, String landmark, String pincode) {}

    public record PaymentDto(String method, String status, String paymentId, String mode) {}

    public record CustomerDto(String name, String mobile, String email) {}

    public record OrderDto(
            String id,
            String status,
            String fulfilment,
            List<OrderItemDto> items,
            DeliveryInfoDto deliveryInfo,
            PaymentDto payment,
            BigDecimal subtotal,
            BigDecimal deliveryFee,
            BigDecimal total,
            Instant createdAt,
            CustomerDto customer) {}

    public record RazorpayInfo(String keyId, String orderId, long amount) {}

    public record PlaceOrderResponse(OrderDto order, RazorpayInfo razorpay) {}

    public record VerifyPaymentRequest(
            @NotBlank String orderId,
            @NotBlank @JsonProperty("razorpay_order_id") String razorpayOrderId,
            @NotBlank @JsonProperty("razorpay_payment_id") String razorpayPaymentId,
            @NotBlank @JsonProperty("razorpay_signature") String razorpaySignature) {}

    public record StatusRequest(@NotBlank(message = "Status is required.") String status) {}

    public record StatsDto(
            long ordersToday,
            BigDecimal salesToday,
            long pendingOrders,
            long awaitingVerification,
            BigDecimal totalPaid,
            long totalOrders,
            long products) {}
}
