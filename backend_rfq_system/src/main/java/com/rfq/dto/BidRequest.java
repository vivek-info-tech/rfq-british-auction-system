package com.rfq.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class BidRequest {

    private Long supplierId;
    private Double freightCharges;
    private Double originCharges;
    private Double destinationCharges;
    private Double totalPrice;

    private Integer transitTimeDays;
    private LocalDate quoteValidityDate;
}