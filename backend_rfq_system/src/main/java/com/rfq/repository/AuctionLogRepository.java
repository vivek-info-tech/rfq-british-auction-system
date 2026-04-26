package com.rfq.repository;

import com.rfq.entity.AuctionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuctionLogRepository extends JpaRepository<AuctionLog, Long> {

    List<AuctionLog> findByRfqIdOrderByTimestampDesc(Long rfqId);
}