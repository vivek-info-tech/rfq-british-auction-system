package com.rfq.service;

import com.rfq.dto.BidRequest;
import com.rfq.dto.LeaderboardRowDto;
import com.rfq.entity.AuctionLog;
import com.rfq.entity.Bid;
import com.rfq.entity.RFQ;
import com.rfq.entity.Supplier;
import com.rfq.repository.AuctionLogRepository;
import com.rfq.repository.BidRepository;
import com.rfq.repository.RFQRepository;
import com.rfq.repository.SupplierRepository;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class BidService {

    private final RFQRepository rfqRepo;
    private final SupplierRepository supRepo;
    private final AuctionEngineService engine;
    private final AuctionLogRepository logRepo;
    private final BidRepository bidRepo;
    private final SimpMessagingTemplate messagingTemplate; // UPDATED

    public BidService(
            BidRepository bidRepo,
            RFQRepository rfqRepo,
            SupplierRepository supRepo,
            AuctionEngineService engine,
            AuctionLogRepository logRepo,
            SimpMessagingTemplate messagingTemplate // UPDATED
    ) {
        this.bidRepo = bidRepo;
        this.rfqRepo = rfqRepo;
        this.supRepo = supRepo;
        this.engine = engine;
        this.logRepo = logRepo;
        this.messagingTemplate = messagingTemplate; // UPDATED
    }

    public Bid place(Long rfqId, BidRequest req) {

        RFQ rfq = rfqRepo.findById(rfqId)
                .orElseThrow(() -> new RuntimeException("RFQ Not Found"));

        Supplier sup = supRepo.findById(req.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier Not Found"));

        LocalDateTime now = LocalDateTime.now();

        if (rfq.getStartTime() != null && now.isBefore(rfq.getStartTime())) {
            throw new RuntimeException("Auction has not started yet!");
        }

        if (rfq.getBidCloseTime() != null && now.isAfter(rfq.getBidCloseTime())) {
            throw new RuntimeException("Auction is closed!");
        }

        // OLD RANKS
        List<Bid> oldRanks = bidRepo.findByRfqIdOrderByTotalPriceAscSubmittedAtAsc(rfqId);

        // SAVE BID
        Bid bid = new Bid();

        bid.setRfq(rfq);
        bid.setSupplier(sup);
        bid.setFreightCharges(req.getFreightCharges());
        bid.setOriginCharges(req.getOriginCharges());
        bid.setDestinationCharges(req.getDestinationCharges());
        bid.setTotalPrice(req.getTotalPrice());
        bid.setTransitTimeDays(req.getTransitTimeDays());
        bid.setQuoteValidityDate(req.getQuoteValidityDate());
        bid.setSubmittedAt(now);

        bidRepo.save(bid);

        if (rfq.getTotalBids() == null) {
            rfq.setTotalBids(0);
        }

        rfq.setTotalBids(rfq.getTotalBids() + 1);

        if (rfq.getLowestBidAmount() == null
                || req.getTotalPrice() < rfq.getLowestBidAmount()) {

            rfq.setLowestBidAmount(req.getTotalPrice());
            rfq.setLeaderSupplierId(sup.getId());
            rfq.setLeaderSupplierName(sup.getName());
        }

        List<LeaderboardRowDto> board = getLeaderboard(rfqId);

        int newRank = 1;

        for (LeaderboardRowDto row : board) {
            if (row.getSupplierId().equals(sup.getId())) {
                newRank = row.getRankPosition();
                break;
            }
        }

        engine.applyExtension(rfq, bid, oldRanks, newRank);

        if (now.isBefore(rfq.getStartTime())) {

            rfq.setStatus("UPCOMING");

        } else if (now.isAfter(rfq.getBidCloseTime())) {

            rfq.setStatus("CLOSED");

            rfq.setWinnerSupplierId(rfq.getLeaderSupplierId());
            rfq.setWinnerSupplierName(rfq.getLeaderSupplierName());
            rfq.setWinningBidAmount(rfq.getLowestBidAmount());

        } else {

            rfq.setStatus("ACTIVE");
        }

        rfqRepo.save(rfq);

        AuctionLog log = new AuctionLog();

        log.setRfq(rfq);
        log.setEventType("BID_SUBMITTED");
        log.setMessage(
                sup.getName()
                        + " submitted a bid of $"
                        + String.format("%.2f", req.getTotalPrice())
                        + " (Rank L" + newRank + ")");
        log.setTimestamp(now);

        logRepo.save(log);

        messagingTemplate.convertAndSend(
                "/topic/auction",
                rfqRepo.findAll());

        return bid;
    }

    public List<LeaderboardRowDto> getLeaderboard(Long rfqId) {

        List<Bid> allBids = bidRepo.findByRfqIdOrderByTotalPriceAscSubmittedAtAsc(rfqId);

        Map<Long, LeaderboardRowDto> supplierMap = new LinkedHashMap<>();

        for (Bid bid : allBids) {

            Long supplierId = bid.getSupplier().getId();

            if (!supplierMap.containsKey(supplierId)) {

                supplierMap.put(
                        supplierId,
                        new LeaderboardRowDto(bid));

            } else {

                LeaderboardRowDto row = supplierMap.get(supplierId);

                row.setTotalBids(row.getTotalBids() + 1);

                if (bid.getTotalPrice() < row.getLowestPrice()) {

                    row.setLowestPrice(bid.getTotalPrice());
                    row.setFreightCharges(bid.getFreightCharges());
                    row.setOriginCharges(bid.getOriginCharges());
                    row.setDestinationCharges(bid.getDestinationCharges());
                    row.setTransitTimeDays(bid.getTransitTimeDays());
                    row.setQuoteValidityDate(bid.getQuoteValidityDate());
                    row.setSubmittedAt(bid.getSubmittedAt());
                }
            }
        }

        List<LeaderboardRowDto> leaderboard = new ArrayList<>(supplierMap.values());

        leaderboard.sort((a, b) -> {

            int compare = Double.compare(
                    a.getLowestPrice(),
                    b.getLowestPrice());

            if (compare == 0
                    && a.getSubmittedAt() != null
                    && b.getSubmittedAt() != null) {

                return a.getSubmittedAt()
                        .compareTo(b.getSubmittedAt());
            }

            return compare;
        });

        for (int i = 0; i < leaderboard.size(); i++) {

            leaderboard.get(i).setRank("L" + (i + 1));
            leaderboard.get(i).setRankPosition(i + 1);
        }

        return leaderboard;
    }
}