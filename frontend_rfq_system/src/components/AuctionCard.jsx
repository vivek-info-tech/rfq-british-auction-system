
import React from 'react';          // FIX: was missing
import { Clock, ArrowLeft, Trophy } from 'lucide-react';

export default function AuctionCard({ rfqs, bids, simulatedTime, onView }) {
    const formatCurrency = (amount) =>
        `$${parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;

    const formatDateTime = (timestamp) =>
        new Date(timestamp).toLocaleString('en-US', {
            month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
        });

    const calculateRankings = (bids) =>
        [...bids]
            .sort((a, b) => a.totalAmount === b.totalAmount ? a.submittedAt - b.submittedAt : a.totalAmount - b.totalAmount)
            .map((bid, index) => ({ ...bid, rank: index + 1 }));

    const getStatus = (rfq) => {
        if (simulatedTime >= rfq.currentCloseTime) {
            if (rfq.currentCloseTime === rfq.forcedCloseTime)
                return { label: 'Force Closed', classes: 'bg-red-50 text-red-700 border-red-200' };
            return { label: 'Closed', classes: 'bg-slate-100 text-slate-700 border-slate-200' };
        }
        return { label: 'Active', classes: 'bg-emerald-50 text-emerald-700 border-emerald-200 animate-pulse' };
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Active Sourcing Events</h1>
                    <p className="text-slate-500 mt-2">Manage and monitor live British Auctions.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="p-5 text-sm font-semibold text-slate-600 uppercase tracking-wider">RFQ Details</th>
                                <th className="p-5 text-sm font-semibold text-slate-600 uppercase tracking-wider">Leader / Winner</th>
                                <th className="p-5 text-sm font-semibold text-slate-600 uppercase tracking-wider">Close Time</th>
                                <th className="p-5 text-sm font-semibold text-slate-600 uppercase tracking-wider">Forced Close</th>
                                <th className="p-5 text-sm font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                                <th className="p-5 text-sm font-semibold text-slate-600 uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {rfqs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-10 text-center text-slate-500">
                                        No RFQs found. Create one to get started.
                                    </td>
                                </tr>
                            ) : rfqs.map((rfq) => {
                                const rfqBids = bids.filter(b => b.rfqId === rfq.id);
                                const l1 = calculateRankings(rfqBids)[0];
                                const status = getStatus(rfq);

                                return (
                                    <tr
                                        key={rfq.id}
                                        className="hover:bg-blue-50/50 transition-colors group cursor-pointer"
                                        onClick={() => onView(rfq.id)}
                                    >
                                        <td className="p-5">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{rfq.title}</span>
                                                <span className="text-sm text-slate-500 font-mono mt-1">{rfq.referenceId}</span>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            {l1 ? (
                                                <div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="font-bold text-emerald-600">{formatCurrency(l1.totalAmount)}</span>
                                                        {simulatedTime >= rfq.currentCloseTime && (
                                                            <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase flex items-center tracking-wider shadow-sm">
                                                                <Trophy size={10} className="mr-1" /> Winner
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-slate-500 mt-1">{l1.supplierName}</div>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 text-sm italic bg-slate-50 px-3 py-1 rounded-full">Waiting for bids</span>
                                            )}
                                        </td>
                                        <td className="p-5">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-slate-900">{formatDateTime(rfq.currentCloseTime)}</span>
                                                {rfq.currentCloseTime > rfq.initialCloseTime && (
                                                    <span className="text-xs text-orange-600 font-bold mt-1 flex items-center">
                                                        <Clock size={12} className="mr-1" /> Extended
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <span className="text-sm text-red-600/80 font-medium whitespace-nowrap">
                                                {formatDateTime(rfq.forcedCloseTime)}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide ${status.classes}`}>
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="p-5 text-right">
                                            <button className="inline-flex items-center justify-center p-2 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors">
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
