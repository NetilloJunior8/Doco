package com.doco.catalog.controller;

import com.doco.catalog.dto.checkout.CheckoutRequest;
import com.doco.catalog.dto.checkout.CheckoutSessionResponse;
import com.doco.catalog.service.CheckoutService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/checkout")
public class CheckoutController {

    private final CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @PostMapping
    public ResponseEntity<CheckoutSessionResponse> createCheckout(@Valid @RequestBody CheckoutRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(checkoutService.createCheckout(request));
    }

    @GetMapping("/{orderNumber}")
    public ResponseEntity<CheckoutSessionResponse> getOrderStatus(@PathVariable String orderNumber) {
        return ResponseEntity.ok(checkoutService.getOrderStatus(orderNumber));
    }
}
