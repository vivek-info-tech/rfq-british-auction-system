package com.rfq.controller;

import com.rfq.dto.BidRequest;
import com.rfq.dto.LeaderboardRowDto;
import com.rfq.entity.AuctionLog;
import com.rfq.entity.Bid;
import com.rfq.entity.Supplier;
import com.rfq.repository.AuctionLogRepository;
import com.rfq.repository.SupplierRepository;
import com.rfq.service.BidService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "${app.cors.allowedOrigins}")
public class BidController {

    private final BidService service;
    private final SupplierRepository supplierRepo;
    private final AuctionLogRepository logRepo;

    public BidController(BidService service,
            SupplierRepository supplierRepo,
            AuctionLogRepository logRepo) {
        this.service = service;
        this.supplierRepo = supplierRepo;
        this.logRepo = logRepo;
    }

    @PostMapping("/api/bid/{rfqId}")
    public ResponseEntity<?> placeBid(@PathVariable Long rfqId, @RequestBody BidRequest req) {
        try {
            Bid savedBid = service.place(rfqId, req);
            return ResponseEntity.ok(savedBid);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/api/bid/ranking/{rfqId}")
    public ResponseEntity<List<LeaderboardRowDto>> getLeaderboard(@PathVariable Long rfqId) {
        return ResponseEntity.ok(service.getLeaderboard(rfqId));
    }

    @GetMapping("/api/supplier/all")
    public ResponseEntity<List<Supplier>> getAllSuppliers() {
        return ResponseEntity.ok(supplierRepo.findAll());
    }

    @GetMapping("/api/rfq/{rfqId}/logs")
    public ResponseEntity<List<AuctionLog>> getLogs(@PathVariable Long rfqId) {
        return ResponseEntity.ok(logRepo.findByRfqIdOrderByTimestampDesc(rfqId));
    }
}
