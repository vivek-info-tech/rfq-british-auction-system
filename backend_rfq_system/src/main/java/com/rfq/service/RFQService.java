package com.rfq.service;

import com.rfq.entity.RFQ;
import com.rfq.repository.RFQRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RFQService {

    private final RFQRepository repo;

    public RFQService(RFQRepository repo) {
        this.repo = repo;
    }

    public RFQ save(RFQ r) {
        return repo.save(r);
    }

    public List<RFQ> all() {
        return repo.findAll();
    }

    public RFQ get(Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("RFQ Not Found"));
    }
}