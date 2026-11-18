package com.omsairam.juice.web;

import com.omsairam.juice.dto.Dtos.OrderDto;
import com.omsairam.juice.dto.Dtos.VerifyPaymentRequest;
import com.omsairam.juice.security.UserPrincipal;
import com.omsairam.juice.service.OrderService;
import com.omsairam.juice.service.PaymentService;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    private final PaymentService payments;
    private final OrderService orders;

    public PaymentController(PaymentService payments, OrderService orders) {
        this.payments = payments;
        this.orders = orders;
    }

    /** The website asks this to know whether the "Online Payment" option can be offered. */
    @GetMapping("/config")
    public Map<String, Object> config() {
        return Map.of("enabled", payments.enabled());
    }

    @PostMapping("/verify")
    public OrderDto verify(@AuthenticationPrincipal UserPrincipal me, @Valid @RequestBody VerifyPaymentRequest req) {
        return orders.verifyPayment(me, req);
    }
}
