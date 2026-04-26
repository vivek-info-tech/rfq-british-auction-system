import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import api from './utils/api';
import { formatCurrency } from './utils/helpers';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import CreateRFQ from './pages/CreateRFQ';
import AuctionList from './pages/AuctionList';
import AuctionDetails from './pages/AuctionDetails';
import SupplierBid from './pages/SupplierBid';

// ============================================
// NORMALIZE BACKEND DATA
// ============================================
const normalizeRfq = (raw) => ({
    ...raw,

    // convert string date -> timestamp
    startTime: raw.startTime ? new Date(raw.startTime).getTime() : null,
    bidCloseTime: raw.bidCloseTime ? new Date(raw.bidCloseTime).getTime() : null,
    forcedCloseTime: raw.forcedCloseTime
        ? new Date(raw.forcedCloseTime).getTime()
        : null,

    // keep old names for existing pages
    currentCloseTime: raw.bidCloseTime
        ? new Date(raw.bidCloseTime).getTime()
        : null,

    initialCloseTime: raw.bidCloseTime
        ? new Date(raw.bidCloseTime).getTime()
        : null,

    triggerWindowMins: raw.triggerWindowMinutes,
    extensionDurationMins: raw.extensionMinutes,
    triggerType: raw.extensionTriggerType,
});

export default function App() {
    const [simulatedTime, setSimulatedTime] = useState(Date.now());
    const [timeOffset, setTimeOffset] = useState(0);

    const [rfqs, setRfqs] = useState([]);
    const [bids, setBids] = useState([]);
    const [logs, setLogs] = useState([]);

    // ============================================
    // FETCH RFQS
    // ============================================
    const fetchRfqs = async () => {
        try {
            const res = await api.get('/rfq/all');
            setRfqs(res.data.map(normalizeRfq));
        } catch (err) {
            console.error('RFQ fetch failed:', err);
        }
    };

    // ============================================
    // AUTO REFRESH RFQ DATA (LIVE UPDATE)
    // ============================================
    useEffect(() => {
        fetchRfqs();

        const interval = setInterval(() => {
            fetchRfqs();
        }, 1000); // every second live refresh

        return () => clearInterval(interval);
    }, []);

    // ============================================
    // LIVE CLOCK
    // ============================================
    useEffect(() => {
        const timer = setInterval(() => {
            setSimulatedTime(Date.now() + timeOffset);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeOffset]);

    // ============================================
    // FAST FORWARD
    // ============================================
    const handleFastForward = (minutes) => {
        setTimeOffset((prev) => prev + minutes * 60 * 1000);
    };

    // ============================================
    // CREATE RFQ
    // ============================================
    const handleCreateRfq = (rfqData) => {
        fetchRfqs();

        setLogs((prev) => [
            ...prev,
            {
                id: Date.now(),
                rfqId: rfqData.id,
                eventType: 'SYSTEM',
                message: `Auction "${rfqData.referenceId}" created.`,
                timestamp: Date.now(),
            },
        ]);
    };

    // ============================================
    // BID SUBMIT
    // ============================================
    const handleBidSubmit = (bidData) => {
        fetchRfqs(); // refresh instantly after bid

        const newBid = {
            ...bidData,
            id: Date.now(),
            submittedAt: Date.now(),
        };

        setBids((prev) => [...prev, newBid]);

        setLogs((prev) => [
            ...prev,
            {
                id: Date.now() + '-bid',
                rfqId: bidData.rfqId,
                eventType: 'BID_SUBMITTED',
                message: `${bidData.supplierName} placed bid of ${formatCurrency(
                    bidData.totalAmount
                )}`,
                timestamp: Date.now(),
            },
        ]);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <BrowserRouter>
                <Navbar
                    simulatedTime={simulatedTime}
                    handleFastForward={handleFastForward}
                />

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Routes>
                        <Route path="/" element={<Home />} />

                        <Route
                            path="/create"
                            element={
                                <CreateRFQ
                                    simulatedTime={simulatedTime}
                                    onSave={handleCreateRfq}
                                />
                            }
                        />

                        <Route
                            path="/rfqs"
                            element={
                                <AuctionList
                                    rfqs={rfqs}
                                    bids={bids}
                                    simulatedTime={simulatedTime}
                                />
                            }
                        />

                        <Route
                            path="/rfq/:id"
                            element={
                                <AuctionDetails
                                    rfqs={rfqs}
                                    bids={bids}
                                    logs={logs}
                                    simulatedTime={simulatedTime}
                                    onSubmitBid={handleBidSubmit}
                                />
                            }
                        />

                        <Route
                            path="/bid"
                            element={
                                <SupplierBid
                                    rfqs={rfqs}
                                    simulatedTime={simulatedTime}
                                    onSubmitBid={handleBidSubmit}
                                />
                            }
                        />
                    </Routes>
                </main>
            </BrowserRouter>
        </div>
    );
}