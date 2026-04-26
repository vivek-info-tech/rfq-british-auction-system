package com.rfq.service;

import com.rfq.entity.AuctionLog;
import com.rfq.entity.Bid;
import com.rfq.entity.RFQ;
import com.rfq.repository.AuctionLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuctionEngineService {

    private final AuctionLogRepository logRepo;

    public AuctionEngineService(AuctionLogRepository logRepo) {
        this.logRepo = logRepo;
    }

    public void applyExtension(
            RFQ rfq,
            Bid newBid,
            List<Bid> rankedBidsBefore,
            int newBidRank) {

        LocalDateTime now = LocalDateTime.now();

        updateAuctionStatus(rfq);

        if ("CLOSED".equalsIgnoreCase(rfq.getStatus())
                || "FORCE_CLOSED".equalsIgnoreCase(rfq.getStatus())) {
            return;
        }

        if (rfq.getBidCloseTime() == null
                || rfq.getTriggerWindowMinutes() == null
                || rfq.getExtensionMinutes() == null) {
            return;
        }

        LocalDateTime triggerStart = rfq.getBidCloseTime()
                .minusMinutes(rfq.getTriggerWindowMinutes());

        boolean inWindow = (now.isEqual(triggerStart) || now.isAfter(triggerStart))
                && now.isBefore(rfq.getBidCloseTime());

        if (!inWindow) {
            return;
        }

        String triggerType = "ANY_RANK_CHANGE";

        if (rfq.getExtensionTriggerType() != null
                && !rfq.getExtensionTriggerType().trim().isEmpty()) {

            triggerType = rfq.getExtensionTriggerType()
                    .trim()
                    .toUpperCase();
        }

        boolean shouldExtend = false;
        String reason = "";

        if ("BID_RECEIVED".equals(triggerType)) {

            shouldExtend = true;

            reason = "Bid received in last "
                    + rfq.getTriggerWindowMinutes()
                    + " min(s)";
        }

        else if ("ANY_RANK_CHANGE".equals(triggerType)) {

            if (newBidRank <= rankedBidsBefore.size()) {

                shouldExtend = true;
                reason = "Rank changed to L" + newBidRank;
            }
        }

        else if ("L1_RANK_CHANGE".equals(triggerType)) {

            if (newBidRank == 1) {

                shouldExtend = true;

                reason = "New L1 bidder "
                        + newBid.getSupplier().getName();
            }
        }

        if (!shouldExtend) {
            return;
        }

        LocalDateTime proposedClose = rfq.getBidCloseTime()
                .plusMinutes(rfq.getExtensionMinutes());

        boolean capped = false;

        if (rfq.getForcedCloseTime() != null
                && proposedClose.isAfter(rfq.getForcedCloseTime())) {

            proposedClose = rfq.getForcedCloseTime();
            capped = true;
        }

        if (proposedClose.isAfter(rfq.getBidCloseTime())) {

            rfq.setBidCloseTime(proposedClose);
            rfq.setStatus("ACTIVE");

            AuctionLog log = new AuctionLog();

            log.setRfq(rfq);
            log.setEventType("AUCTION_EXTENDED");

            log.setMessage(
                    "Auction extended "
                            + (capped
                                    ? "(capped at forced close)"
                                    : "by " + rfq.getExtensionMinutes() + " min(s)")
                            + ". Reason: "
                            + reason);

            log.setTimestamp(now);

            logRepo.save(log);
        }

        updateAuctionStatus(rfq);
    }

    public void updateAuctionStatus(RFQ rfq) {

        LocalDateTime now = LocalDateTime.now();

        // UPCOMING
        if (rfq.getStartTime() != null
                && now.isBefore(rfq.getStartTime())) {

            rfq.setStatus("UPCOMING");
            return;
        }

        // FORCE CLOSED
        if (rfq.getForcedCloseTime() != null
                && (now.isEqual(rfq.getForcedCloseTime())
                        || now.isAfter(rfq.getForcedCloseTime()))) {

            rfq.setStatus("FORCE_CLOSED");
            setWinner(rfq);
            return;
        }

        // CLOSED
        if (rfq.getBidCloseTime() != null
                && (now.isEqual(rfq.getBidCloseTime())
                        || now.isAfter(rfq.getBidCloseTime()))) {

            rfq.setStatus("CLOSED");
            setWinner(rfq);
            return;
        }
        // ACTIVE
        rfq.setStatus("ACTIVE");
    }

    private void setWinner(RFQ rfq) {

        if (rfq.getLeaderSupplierId() != null) {

            rfq.setWinnerSupplierId(
                    rfq.getLeaderSupplierId());

            rfq.setWinnerSupplierName(
                    rfq.getLeaderSupplierName());

            rfq.setWinningBidAmount(
                    rfq.getLowestBidAmount());
        }
    }
}