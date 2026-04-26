import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
    Activity,
    Trophy,
    ArrowLeft,
    ShieldAlert,
    Calendar,
    Clock,
    Plus,
    Send,
    Crown
} from 'lucide-react';

import {
    formatCurrency,
    formatDateTime,
    formatCountdown
} from '../utils/helpers';

import BidForm from '../components/BidForm';

export default function AuctionDetails({
    rfqs,
    simulatedTime,
    onSubmitBid
}) {
    const navigate = useNavigate();
    const { id } = useParams();

    const [rankedBids, setRankedBids] = useState([]);
    const [auctionLogs, setAuctionLogs] = useState([]);


    const rfq = rfqs.find((r) => String(r.id) === id);


    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                const [rankRes, logRes] = await Promise.all([
                    api.get(`/bid/ranking/${id}`),
                    api.get(`/rfq/${id}/logs`)
                ]);

                setRankedBids(rankRes.data || []);
                setAuctionLogs(logRes.data || []);
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();

        const interval = setInterval(fetchData, 1000);

        return () => clearInterval(interval);
    }, [id]);


    if (!rfq) {
        return (
            <div className="text-center py-20">
                <ShieldAlert size={48} className="mx-auto mb-4 text-red-400" />
                <h2 className="text-2xl font-bold">RFQ Not Found</h2>
            </div>
        );
    }


    const isStarted = simulatedTime >= rfq.startTime;
    const isClosed = simulatedTime >= rfq.bidCloseTime;

    const timeRemaining = rfq.bidCloseTime - simulatedTime;

    let timerText = "Closed";

    if (!isStarted) {
        timerText = formatCountdown(rfq.startTime - simulatedTime);
    } else if (!isClosed) {
        timerText = formatCountdown(timeRemaining);
    }

    const leader = rankedBids.length > 0 ? rankedBids[0] : null;

    return (
        <div className="animate-in fade-in duration-500">


            <button
                onClick={() => navigate('/rfqs')}
                className="mb-6 inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-800"
            >
                <ArrowLeft size={16} className="mr-2" />
                Back
            </button>


            <div className="bg-white rounded-2xl shadow-sm border p-8 mb-8">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-black">
                                {rfq.title}
                            </h1>

                            <span className="px-3 py-1 rounded-lg bg-slate-100 text-sm font-mono">
                                {rfq.referenceId}
                            </span>
                        </div>

                        <p className="text-slate-500 flex items-center">
                            <Calendar size={16} className="mr-2" />
                            Pickup: {rfq.pickupDate || 'TBD'}
                        </p>
                    </div>

                    <div className="bg-slate-50 rounded-xl px-6 py-4 border min-w-[220px]">
                        <p className="text-xs font-bold uppercase text-slate-500 mb-1">
                            {!isStarted
                                ? 'Starts In'
                                : isClosed
                                    ? 'Status'
                                    : 'Time Remaining'}
                        </p>

                        <p className="text-3xl font-black text-blue-700 font-mono">
                            {timerText}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                <div className="lg:col-span-4 space-y-6">

                    <BidForm
                        rfqId={rfq.id}
                        isClosed={isClosed}
                        isStarted={isStarted}
                        startTime={rfq.startTime}
                        simulatedTime={simulatedTime}
                        onSubmit={onSubmitBid}
                    />

                    <div className="bg-white rounded-2xl shadow-sm border p-6">
                        <h3 className="font-bold mb-4 flex items-center">
                            <ShieldAlert size={18} className="mr-2 text-blue-600" />
                            Auction Rules
                        </h3>

                        <div className="space-y-4 text-sm text-slate-600">

                            <div className="flex items-start">
                                <Clock size={15} className="mr-2 mt-1 text-blue-500" />
                                Trigger Window:
                                <span className="ml-1 font-bold">
                                    {rfq.triggerWindowMins} mins
                                </span>
                            </div>

                            <div className="flex items-start">
                                <Plus size={15} className="mr-2 mt-1 text-green-500" />
                                Extend By:
                                <span className="ml-1 font-bold">
                                    {rfq.extensionDurationMins} mins
                                </span>
                            </div>

                            <div className="flex items-start">
                                <ShieldAlert size={15} className="mr-2 mt-1 text-red-500" />
                                Hard Stop:
                                <span className="ml-1 font-bold text-red-600">
                                    {formatDateTime(rfq.forcedCloseTime)}
                                </span>
                            </div>

                        </div>
                    </div>
                </div>


                <div className="lg:col-span-8 space-y-6">


                    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

                        <div className="p-5 border-b bg-slate-50 flex justify-between items-center">
                            <h3 className="font-bold text-lg flex items-center">
                                <Trophy size={18} className="mr-2 text-amber-500" />
                                Live Leaderboard
                            </h3>

                            <span className="text-xs font-bold bg-slate-200 px-2 py-1 rounded">
                                {rankedBids.length} Suppliers
                            </span>
                        </div>

                        <table className="w-full">

                            <thead className="text-left text-xs uppercase text-slate-500 border-b">
                                <tr>
                                    <th className="p-4">Rank</th>
                                    <th className="p-4">Supplier</th>
                                    <th className="p-4">Transit</th>
                                    <th className="p-4 text-right">Quote</th>
                                </tr>
                            </thead>

                            <tbody>
                                {rankedBids.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="p-10 text-center text-slate-400">
                                            No bids yet
                                        </td>
                                    </tr>
                                ) : rankedBids.map((bid, index) => {

                                    const isTop = index === 0;

                                    return (
                                        <tr
                                            key={bid.supplierId}
                                            className={isTop ? 'bg-emerald-50' : 'border-t'}
                                        >
                                            <td className="p-4">
                                                {isClosed && isTop ? (
                                                    <span className="px-3 py-1 rounded bg-amber-500 text-white text-xs font-bold">
                                                        WINNER
                                                    </span>
                                                ) : isTop ? (
                                                    <span className="px-3 py-1 rounded bg-blue-600 text-white text-xs font-bold flex items-center w-max">
                                                        <Crown size={12} className="mr-1" />
                                                        L1
                                                    </span>
                                                ) : (
                                                    <span className="font-bold">
                                                        {bid.rank}
                                                    </span>
                                                )}
                                            </td>

                                            <td className="p-4">
                                                <div className="font-bold">
                                                    {bid.supplierName}
                                                </div>

                                                <div className="text-xs text-slate-400">
                                                    Bids: {bid.totalBids}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">    <span className="inline-flex items-center text-sm font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">        {bid.transitTimeDays} Days    </span>    {bid.quoteValidityDate && (<span className="mt-1 inline-flex items-center text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100 w-max">            Valid till: {bid.quoteValidityDate}        </span>)}</td><td className="px-6 py-4 text-right">    <p className="text-xl font-black">        {formatCurrency(bid.lowestPrice)}    </p>    <p className="text-xs text-slate-400 mt-1">        F: ${bid.freightCharges?.toFixed(2)} / O: ${bid.originCharges?.toFixed(2)} / D: ${bid.destinationCharges?.toFixed(2)}    </p></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>


                    {!isClosed && isStarted && (
                        <Link
                            to={`/bid?rfqId=${rfq.id}`}
                            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold flex justify-center items-center hover:bg-blue-700"
                        >
                            Submit Full Screen Bid
                            <Send size={16} className="ml-2" />
                        </Link>
                    )}

                    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

                        <div className="p-4 border-b bg-slate-50">
                            <h3 className="font-bold flex items-center">
                                <Activity size={18} className="mr-2 text-blue-600" />
                                Event Stream
                            </h3>
                        </div>

                        <div className="p-5 max-h-[280px] overflow-y-auto space-y-4">

                            {auctionLogs.length === 0 ? (
                                <p className="text-slate-400 text-center">
                                    No events
                                </p>
                            ) : auctionLogs.map((log) => (
                                <div key={log.id} className="text-sm border-b pb-3">

                                    <p className="font-medium">
                                        {log.message}
                                    </p>

                                    <p className="text-xs text-slate-400 mt-1">
                                        {formatDateTime(
                                            new Date(log.timestamp).getTime()
                                        )}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}