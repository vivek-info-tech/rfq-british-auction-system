package com.rfq.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "auction_logs")
public class AuctionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rfq_id", nullable = false)
    private RFQ rfq;

    private String eventType; // "SYSTEM", "BID_SUBMITTED", "AUCTION_EXTENDED"
    private String message;

    private LocalDateTime timestamp;
}