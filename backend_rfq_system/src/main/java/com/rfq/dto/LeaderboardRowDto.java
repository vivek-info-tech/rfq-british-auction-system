package com.rfq.dto;

import com.rfq.entity.Bid;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class LeaderboardRowDto {

    private String rank;
    private Integer rankPosition;

    private Long supplierId;
    private String supplierName;

    private Double lowestPrice;

    private Double freightCharges;
    private Double originCharges;
    private Double destinationCharges;

    private Integer transitTimeDays;
    private LocalDate quoteValidityDate;

    private LocalDateTime submittedAt;
    private Integer totalBids;

    public LeaderboardRowDto() {
    }

    public LeaderboardRowDto(Bid bid) {

        this.supplierId = bid.getSupplier().getId();
        this.supplierName = bid.getSupplier().getName();

        this.lowestPrice = bid.getTotalPrice();

        this.freightCharges = bid.getFreightCharges();
        this.originCharges = bid.getOriginCharges();
        this.destinationCharges = bid.getDestinationCharges();

        this.transitTimeDays = bid.getTransitTimeDays();
        this.quoteValidityDate = bid.getQuoteValidityDate();

        this.submittedAt = bid.getSubmittedAt();

        this.totalBids = 1;
    }
}