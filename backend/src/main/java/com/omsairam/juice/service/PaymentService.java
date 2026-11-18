package com.omsairam.juice.service;

import com.omsairam.juice.config.Props;
import com.omsairam.juice.dto.Dtos.RazorpayInfo;
import com.omsairam.juice.model.CustomerOrder;
import com.omsairam.juice.web.ApiException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.Map;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

/** Razorpay: creates payment orders (server-to-server) and verifies the signature of a finished payment. */
@Service
public class PaymentService {
    private static final String ORDERS_URL = "https://api.razorpay.com/v1/orders";

    private final Props.Razorpay props;
    private final RestClient http = RestClient.create();

    public PaymentService(Props.Razorpay props) {
        this.props = props;
    }

    public boolean enabled() {
        return props.enabled();
    }

    public long toPaise(BigDecimal rupees) {
        return rupees.movePointRight(2).setScale(0, RoundingMode.HALF_UP).longValueExact();
    }

    /** Creates the Razorpay order for our order and returns its id. */
    public String createRazorpayOrder(CustomerOrder order) {
        if (!enabled()) {
            throw ApiException.badRequest("Online payment is not available right now.");
        }
        Map<String, Object> body = Map.of("amount", toPaise(order.getTotal()), "currency", "INR", "receipt", order.getId());
        try {
            Map<?, ?> response = http.post()
                    .uri(ORDERS_URL)
                    .headers(h -> h.setBasicAuth(props.keyId(), props.keySecret()))
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(Map.class);
            Object id = response == null ? null : response.get("id");
            if (id == null) {
                throw new ApiException(HttpStatus.BAD_GATEWAY, "Could not start the payment. Please try again.");
            }
            return id.toString();
        } catch (RestClientException e) {
            throw new ApiException(HttpStatus.BAD_GATEWAY, "Could not start the payment. Please try again.");
        }
    }

    public RazorpayInfo infoFor(CustomerOrder order) {
        return new RazorpayInfo(props.keyId(), order.getRazorpayOrderId(), toPaise(order.getTotal()));
    }

    /** signature = HMAC_SHA256(razorpay_order_id + "|" + razorpay_payment_id, key_secret) */
    public boolean verifySignature(String razorpayOrderId, String paymentId, String signature) {
        if (!enabled()) {
            return false;
        }
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(props.keySecret().getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] expected = mac.doFinal((razorpayOrderId + "|" + paymentId).getBytes(StandardCharsets.UTF_8));
            String expectedHex = HexFormat.of().formatHex(expected);
            return MessageDigest.isEqual(expectedHex.getBytes(StandardCharsets.UTF_8), signature.getBytes(StandardCharsets.UTF_8));
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new IllegalStateException("HMAC not available", e);
        }
    }
}
