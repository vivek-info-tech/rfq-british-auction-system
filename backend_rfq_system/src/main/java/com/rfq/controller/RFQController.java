package com.rfq.controller;

import com.rfq.entity.RFQ;
import com.rfq.service.AuctionEngineService;
import com.rfq.service.RFQService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rfq")
@CrossOrigin(origins = "http://localhost:5173")
public class RFQController {

    private final RFQService service;

    private final AuctionEngineService engine;

    public RFQController(
            RFQService service,
            AuctionEngineService engine) {
        this.service = service;
        this.engine = engine;
    }

    // CREATE RFQ

    @PostMapping("/create")
    public ResponseEntity<RFQ> create(@RequestBody RFQ rfq) {
        return ResponseEntity.ok(service.save(rfq));
    }

    // GET ALL RFQS WITH LIVE STATUS

    @GetMapping("/all")
    public ResponseEntity<List<RFQ>> getAll() {

        List<RFQ> rfqs = service.all();

        for (RFQ rfq : rfqs) {
            engine.updateAuctionStatus(rfq);
            service.save(rfq); // persist CLOSED / WINNER / ACTIVE
        }

        return ResponseEntity.ok(rfqs);
    }

    // GET SINGLE RFQ WITH LIVE STATUS

    @GetMapping("/{id}")
    public ResponseEntity<?> getOne(@PathVariable Long id) {

        try {
            RFQ rfq = service.get(id);

            engine.updateAuctionStatus(rfq);
            service.save(rfq);

            return ResponseEntity.ok(rfq);

        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}