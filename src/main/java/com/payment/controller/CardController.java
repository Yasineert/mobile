package com.payment.controller;

import com.payment.dto.PaymentRequest;
import com.payment.dto.PaymentResponse;
import com.payment.entity.Card;
import com.payment.exception.ResourceNotFoundException;
import com.payment.repository.CardRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class CardController {

    private final CardRepository cardRepository;

    @GetMapping("/card/{userId}")
    public ResponseEntity<PaymentResponse> getCardByUserId(@PathVariable String userId) {
        log.info("Fetching card for userId: {}", userId);
        
        Card card = cardRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Card not found for userId: " + userId));
        
        log.info("Card found: {}", card);
        return ResponseEntity.ok(PaymentResponse.success("Card details retrieved successfully", card));
    }

    @PostMapping("/payment")
    public ResponseEntity<PaymentResponse> addCredit(@Valid @RequestBody PaymentRequest paymentRequest) {
        log.info("Processing payment request: {}", paymentRequest);
        
        Card card = cardRepository.findByUserId(paymentRequest.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Card not found for userId: " + paymentRequest.getUserId()));
        
        // Update balance
        double newBalance = card.getBalance() + paymentRequest.getAmount();
        card.setBalance(newBalance);
        
        // Save updated card
        Card updatedCard = cardRepository.save(card);
        log.info("Payment processed successfully. New balance: {}", newBalance);
        
        return ResponseEntity.ok(PaymentResponse.success("Payment processed successfully", updatedCard));
    }
} 