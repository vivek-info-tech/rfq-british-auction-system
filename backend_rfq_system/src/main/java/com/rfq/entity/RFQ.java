package com.rfq.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "rfqs")
public class RFQ {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 100)
    private String referenceId;

    @Column(nullable = false, length = 255)
    private String title;

    private LocalDate pickupDate;

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private LocalDateTime bidCloseTime;

    @Column(nullable = false)
    private LocalDateTime forcedCloseTime;

    @Column(nullable = false)
    private Integer triggerWindowMinutes = 3;

    @Column(nullable = false)
    private Integer extensionMinutes = 5;

    @Column(nullable = false, length = 50)
    private String extensionTriggerType = "ANY_RANK_CHANGE";

    @Column(nullable = false, length = 30)
    private String status = "UPCOMING";

    private Long leaderSupplierId;

    @Column(length = 255)
    private String leaderSupplierName;

    private Double lowestBidAmount;

    private Long winnerSupplierId;

    @Column(length = 255)
    private String winnerSupplierName;

    private Double winningBidAmount;

    @Column(nullable = false)
    private Integer totalBids = 0;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();

        if (createdAt == null) {
            createdAt = now;
        }

        if (updatedAt == null) {
            updatedAt = now;
        }

        if (status == null || status.isBlank()) {
            status = "UPCOMING";
        }

        if (triggerWindowMinutes == null) {
            triggerWindowMinutes = 3;
        }

        if (extensionMinutes == null) {
            extensionMinutes = 5;
        }

        if (extensionTriggerType == null || extensionTriggerType.isBlank()) {
            extensionTriggerType = "ANY_RANK_CHANGE";
        }

        if (totalBids == null) {
            totalBids = 0;
        }
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}