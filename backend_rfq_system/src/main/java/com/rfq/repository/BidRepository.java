package com.rfq.repository;

import com.rfq.entity.Bid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BidRepository extends JpaRepository<Bid, Long> {

    List<Bid> findByRfqIdOrderByTotalPriceAscSubmittedAtAsc(Long rfqId);

    List<Bid> findByRfqIdOrderByTotalPriceAsc(Long rfqId);
}