package com.payment.controller;

import com.payment.dto.PaymentRequest;
import com.payment.dto.PaymentResponse;
import com.payment.entity.Payment;
import com.payment.repository.PaymentRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentRepository paymentRepository;

    @PostMapping("/payment")
    public ResponseEntity<PaymentResponse> createPayment(@Valid @RequestBody PaymentRequest request) {
        Payment payment = new Payment();
        payment.setFirstName(request.getFirstName());
        payment.setLastName(request.getLastName());
        payment.setCardNumber(request.getCardNumber());
        payment.setCvc(request.getCvc());
        payment.setExpiryDate(request.getExpiryDate());
        payment.setAmount(request.getAmount());
        payment.setPaymentMethod(request.getPaymentMethod());

        Payment savedPayment = paymentRepository.save(payment);
        return ResponseEntity.ok(PaymentResponse.success("Payment processed successfully", savedPayment));
    }

    @GetMapping("/payments")
    public ResponseEntity<PaymentResponse> getAllPayments() {
        List<Payment> payments = paymentRepository.findAll();
        return ResponseEntity.ok(PaymentResponse.success("Payments retrieved successfully", payments));
    }
} 