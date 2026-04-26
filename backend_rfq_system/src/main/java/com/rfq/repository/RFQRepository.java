package com.rfq.repository;

import com.rfq.entity.RFQ;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RFQRepository extends JpaRepository<RFQ, Long> {
}