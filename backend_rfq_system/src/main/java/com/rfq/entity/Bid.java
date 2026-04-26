package com.rfq.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "bids")
public class Bid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rfq_id", nullable = false)
    private RFQ rfq;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;

    private Double freightCharges;
    private Double originCharges;
    private Double destinationCharges;
    private Double totalPrice;

    private Integer transitTimeDays;
    private LocalDate quoteValidityDate;
    private LocalDateTime submittedAt;

    private Integer rankPosition;
}