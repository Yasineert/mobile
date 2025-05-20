package com.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    private boolean success;
    private String message;
    private Object data;
    
    public static PaymentResponse success(String message, Object data) {
        return new PaymentResponse(true, message, data);
    }
    
    public static PaymentResponse error(String message) {
        return new PaymentResponse(false, message, null);
    }
} 