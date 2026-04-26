import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Clock, ArrowLeft, Crown } from 'lucide-react';
import {
    formatCurrency,
    formatDateTime,
    formatCountdown
} from '../utils/helpers';

export default function AuctionList({ rfqs, simulatedTime }) {

    const navigate = useNavigate();


    const [activeTab, setActiveTab] = useState("UPCOMING");

    const toDate = (value) => {
        if (!value) return null;
        return new Date(value);
    };


    const getStatus = (rfq) => {

        const status = rfq.status;

        if (status === "UPCOMING") {
            return {
                label: "Upcoming",
                key: "UPCOMING",
                classes: "bg-blue-50 text-blue-700 border-blue-200"
            };
        }

        if (status === "ACTIVE") {
            return {
                label: "Live",
                key: "ACTIVE",
                classes: "bg-emerald-50 text-emerald-700 border-emerald-200 animate-pulse"
            };
        }

        if (status === "FORCE_CLOSED" || status === "CLOSED") {
            return {
                label: "Closed",
                key: "CLOSED",
                classes: "bg-slate-100 text-slate-700 border-slate-200"
            };
        }

        return {
            label: "Upcoming",
            key: "UPCOMING",
            classes: "bg-blue-50 text-blue-700 border-blue-200"
        };
    };


    const filteredRfqs = rfqs
        .filter((rfq) => getStatus(rfq).key === activeTab)
        .sort((a, b) => {
            const timeA = new Date(a.createdAt || a.startTime).getTime();
            const timeB = new Date(b.createdAt || b.startTime).getTime();
            return timeB - timeA; // recent first
        });


    const renderLeaderCell = (rfq) => {

        const status = rfq.status;
        const startTime = toDate(rfq.startTime);

        if (status === "UPCOMING") {
            return (
                <span className="text-blue-500 text-sm italic font-medium flex items-center bg-blue-50 px-3 py-1 rounded-full w-max">
                    <Clock size={14} className="mr-1.5" />
                    Starts in {formatCountdown(startTime - simulatedTime)}
                </span>
            );
        }

        if (status === "CLOSED" || status === "FORCE_CLOSED") {

            if (!rfq.winnerSupplierName) {
                return (
                    <span className="text-slate-400 text-sm italic bg-slate-50 px-3 py-1 rounded-full">
                        No bids received
                    </span>
                );
            }

            return (
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-600">
                            {formatCurrency(rfq.winningBidAmount || 0)}
                        </span>

                        <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase flex items-center tracking-wider">
                            <Trophy size={10} className="mr-1" />
                            Winner
                        </span>
                    </div>

                    <div className="text-xs text-slate-500 mt-1 font-medium">
                        {rfq.winnerSupplierName}
                    </div>
                </div>
            );
        }

        if (rfq.leaderSupplierName) {
            return (
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-blue-600">
                            {formatCurrency(rfq.lowestBidAmount || 0)}
                        </span>

                        <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase flex items-center tracking-wider">
                            <Crown size={10} className="mr-1" />
                            Leader
                        </span>
                    </div>

                    <div className="text-xs text-slate-500 mt-1 font-medium">
                        {rfq.leaderSupplierName}
                    </div>
                </div>
            );
        }

        return (
            <span className="text-slate-400 text-sm italic bg-slate-50 px-3 py-1 rounded-full">
                Waiting for bids
            </span>
        );
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                    Active Auctions
                </h1>

                <p className="text-slate-500 mt-2">
                    Upcoming, Live and Closed auctions
                </p>
            </div>


            <div className="flex gap-3 mb-6">

                <button
                    onClick={() => setActiveTab("UPCOMING")}
                    className={`px-5 py-2 rounded-xl font-semibold border transition ${activeTab === "UPCOMING"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-slate-700"
                        }`}
                >
                    Upcoming ({rfqs.filter(r => getStatus(r).key === "UPCOMING").length})
                </button>

                <button
                    onClick={() => setActiveTab("ACTIVE")}
                    className={`px-5 py-2 rounded-xl font-semibold border transition ${activeTab === "ACTIVE"
                        ? "bg-emerald-600 text-white"
                        : "bg-white text-slate-700"
                        }`}
                >
                    Live ({rfqs.filter(r => getStatus(r).key === "ACTIVE").length})
                </button>

                <button
                    onClick={() => setActiveTab("CLOSED")}
                    className={`px-5 py-2 rounded-xl font-semibold border transition ${activeTab === "CLOSED"
                        ? "bg-slate-700 text-white"
                        : "bg-white text-slate-700"
                        }`}
                >
                    Closed ({rfqs.filter(r => getStatus(r).key === "CLOSED").length})
                </button>

            </div>


            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full text-left border-collapse">

                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="p-5 text-sm font-semibold">RFQ Details</th>
                                <th className="p-5 text-sm font-semibold">Leader / Winner</th>
                                <th className="p-5 text-sm font-semibold">Close Time</th>
                                <th className="p-5 text-sm font-semibold">Forced Close</th>
                                <th className="p-5 text-sm font-semibold">Status</th>
                                <th className="p-5 text-sm font-semibold text-right">Action</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">

                            {filteredRfqs.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-10 text-center text-slate-500">
                                        No RFQs Found
                                    </td>
                                </tr>
                            ) : filteredRfqs.map((rfq) => {

                                const status = getStatus(rfq);

                                return (
                                    <tr
                                        key={rfq.id}
                                        onClick={() => navigate(`/rfq/${rfq.id}`)}
                                        className="hover:bg-blue-50/50 transition cursor-pointer"
                                    >
                                        <td className="p-5">
                                            <div className="flex flex-col">
                                                <span className="font-bold">
                                                    {rfq.title}
                                                </span>

                                                <span className="text-sm text-slate-500 font-mono mt-1">
                                                    {rfq.referenceId}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="p-5">
                                            {renderLeaderCell(rfq)}
                                        </td>

                                        <td className="p-5">
                                            {formatDateTime(toDate(rfq.bidCloseTime))}
                                        </td>

                                        <td className="p-5 text-red-600">
                                            {formatDateTime(toDate(rfq.forcedCloseTime))}
                                        </td>

                                        <td className="p-5">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${status.classes}`}>
                                                {status.label}
                                            </span>
                                        </td>

                                        <td className="p-5 text-right">
                                            <button className="p-2 rounded-lg text-blue-600 hover:bg-blue-100">
                                                <ArrowLeft size={20} className="rotate-180" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}