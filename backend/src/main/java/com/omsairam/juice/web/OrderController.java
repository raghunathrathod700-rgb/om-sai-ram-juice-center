package com.omsairam.juice.web;

import com.omsairam.juice.dto.Dtos.OrderDto;
import com.omsairam.juice.dto.Dtos.OrderRequest;
import com.omsairam.juice.dto.Dtos.PlaceOrderResponse;
import com.omsairam.juice.dto.Dtos.RazorpayInfo;
import com.omsairam.juice.security.UserPrincipal;
import com.omsairam.juice.service.OrderService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orders;

    public OrderController(OrderService orders) {
        this.orders = orders;
    }

    @PostMapping
    public PlaceOrderResponse place(@AuthenticationPrincipal UserPrincipal me, @Valid @RequestBody OrderRequest req) {
        return orders.place(me, req);
    }

    @GetMapping("/mine")
    public List<OrderDto> mine(@AuthenticationPrincipal UserPrincipal me) {
        return orders.myOrders(me);
    }

    @PostMapping("/{id}/pay")
    public RazorpayInfo payAgain(@AuthenticationPrincipal UserPrincipal me, @PathVariable String id) {
        return orders.payAgain(me, id);
    }
}
