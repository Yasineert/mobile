package com.payment.controller;

import com.payment.dto.PaymentResponse;
import com.payment.entity.Trip;
import com.payment.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class TripController {

    private final TripRepository tripRepository;

    @GetMapping("/trips/{userId}")
    public ResponseEntity<PaymentResponse> getTripsByUserId(@PathVariable String userId) {
        log.info("Fetching trips for userId: {}", userId);
        
        List<Trip> trips = tripRepository.findByUserIdOrderByTimeDesc(userId);
        log.info("Found {} trips for userId: {}", trips.size(), userId);
        
        return ResponseEntity.ok(PaymentResponse.success("Trips retrieved successfully", trips));
    }
} 