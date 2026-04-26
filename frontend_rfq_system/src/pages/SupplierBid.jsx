import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    Send,
    ArrowLeft,
    Hourglass,
    Trophy,
    Crown,
    Clock
} from 'lucide-react';

import api from '../utils/api';
import { formatCurrency, formatDateTime, formatCountdown } from '../utils/helpers';

export default function SupplierBid() {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const rfqId = searchParams.get('rfqId');

    const [suppliers, setSuppliers] = useState([]);
    const [rfq, setRfq] = useState(null);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        supplierId: '',
        freightCharges: '',
        originCharges: '',
        destinationCharges: '',
        transitTimeDays: '',
        quoteValidityDate: '',
    });


    const loadRfq = async () => {
        try {
            const res = await api.get(`/rfq/${rfqId}`);
            setRfq(res.data);
        } catch (err) {
            console.error(err);
        }
    };


    useEffect(() => {
        const loadData = async () => {
            try {
                const supplierRes = await api.get('/supplier/all');
                setSuppliers(supplierRes.data);

                await loadRfq();
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadData();


        const interval = setInterval(loadRfq, 1000);

        return () => clearInterval(interval);

    }, [rfqId]);


    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(Date.now());
        }, 1000);

        return () => clearInterval(timer);
    }, []);


    const total =
        (parseFloat(form.freightCharges) || 0) +
        (parseFloat(form.originCharges) || 0) +
        (parseFloat(form.destinationCharges) || 0);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!rfq) return;

        const payload = {
            supplierId: parseInt(form.supplierId),
            freightCharges: parseFloat(form.freightCharges),
            originCharges: parseFloat(form.originCharges),
            destinationCharges: parseFloat(form.destinationCharges),
            totalPrice: total,
            transitTimeDays: parseInt(form.transitTimeDays),
            quoteValidityDate: form.quoteValidityDate,
        };

        try {
            await api.post(`/bid/${rfqId}`, payload);

            setForm({
                supplierId: '',
                freightCharges: '',
                originCharges: '',
                destinationCharges: '',
                transitTimeDays: '',
                quoteValidityDate: '',
            });

            loadRfq();

        } catch (error) {
            alert(error.response?.data || 'Bid failed');
        }
    };


    if (loading) {
        return (
            <div className="text-center py-20 text-slate-500">
                Loading...
            </div>
        );
    }

    if (!rfq) {
        return (
            <div className="text-center py-20 text-red-500">
                RFQ Not Found
            </div>
        );
    }


    const isUpcoming = rfq.status === 'UPCOMING';
    const isClosed =
        rfq.status === 'CLOSED' ||
        rfq.status === 'FORCE_CLOSED';

    const closeMs = new Date(rfq.bidCloseTime).getTime();
    const startMs = new Date(rfq.startTime).getTime();

    let countdown = '';

    if (isUpcoming) {
        countdown = formatCountdown(startMs - now);
    } else if (!isClosed) {
        countdown = formatCountdown(closeMs - now);
    }

    return (
        <div className="max-w-3xl mx-auto">


            <button
                onClick={() => navigate(-1)}
                className="mb-6 inline-flex items-center text-sm font-bold text-slate-500 hover:text-blue-600"
            >
                <ArrowLeft size={16} className="mr-2" />
                Back
            </button>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">


                <h1 className="text-2xl font-bold text-slate-900 mb-2">
                    Submit Bid for {rfq.referenceId}
                </h1>

                <p className="text-slate-500 mb-6">
                    {rfq.title}
                </p>


                <div className="grid md:grid-cols-3 gap-4 mb-6">

                    <div className="p-4 rounded-xl border bg-slate-50">
                        <div className="text-sm text-slate-500">Status</div>
                        <div className="font-bold text-lg">
                            {rfq.status}
                        </div>
                    </div>

                    <div className="p-4 rounded-xl border bg-slate-50">
                        <div className="text-sm text-slate-500">
                            Close Time
                        </div>
                        <div className="font-bold">
                            {formatDateTime(rfq.bidCloseTime)}
                        </div>
                    </div>

                    <div className="p-4 rounded-xl border bg-slate-50">
                        <div className="text-sm text-slate-500 flex items-center gap-1">
                            <Clock size={14} />
                            Countdown
                        </div>

                        <div className="font-bold text-blue-600 text-lg">
                            {isClosed ? 'Closed' : countdown}
                        </div>
                    </div>

                </div>


                {rfq.leaderSupplierName && !isClosed && (
                    <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-100">
                        <div className="flex items-center gap-2 text-blue-700 font-bold">
                            <Crown size={18} />
                            Current Leader
                        </div>

                        <div className="mt-2 text-lg font-bold">
                            {rfq.leaderSupplierName}
                        </div>

                        <div className="text-blue-600">
                            {formatCurrency(rfq.lowestBidAmount)}
                        </div>
                    </div>
                )}


                {rfq.winnerSupplierName && isClosed && (
                    <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
                        <div className="flex items-center gap-2 text-amber-700 font-bold">
                            <Trophy size={18} />
                            Winner
                        </div>

                        <div className="mt-2 text-lg font-bold">
                            {rfq.winnerSupplierName}
                        </div>

                        <div className="text-amber-700">
                            {formatCurrency(rfq.winningBidAmount)}
                        </div>
                    </div>
                )}


                {isUpcoming && (
                    <div className="text-center py-10 rounded-xl bg-blue-50 border border-blue-100">
                        <Hourglass
                            className="mx-auto mb-3 text-blue-500 animate-pulse"
                            size={36}
                        />

                        <p className="font-bold text-blue-900 text-lg">
                            Auction Not Started Yet
                        </p>

                        <p className="text-blue-600 mt-1">
                            Starts In {countdown}
                        </p>
                    </div>
                )}


                {isClosed && (
                    <div className="text-center py-10 rounded-xl bg-slate-50 border">
                        <p className="font-bold text-slate-700 text-xl">
                            Auction Closed
                        </p>
                    </div>
                )}


                {!isUpcoming && !isClosed && (
                    <form onSubmit={handleSubmit} className="space-y-5 mt-6">

                        <div>
                            <label className="block text-sm font-bold mb-1">
                                Supplier
                            </label>

                            <select
                                required
                                className="w-full p-3 border rounded-lg"
                                value={form.supplierId}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        supplierId: e.target.value
                                    })
                                }
                            >
                                <option value="">Select Supplier</option>

                                {suppliers.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">

                            <input
                                required
                                type="number"
                                step="0.01"
                                placeholder="Freight Charges"
                                className="p-3 border rounded-lg"
                                value={form.freightCharges}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        freightCharges: e.target.value
                                    })
                                }
                            />

                            <input
                                required
                                type="number"
                                step="0.01"
                                placeholder="Origin Charges"
                                className="p-3 border rounded-lg"
                                value={form.originCharges}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        originCharges: e.target.value
                                    })
                                }
                            />

                            <input
                                required
                                type="number"
                                step="0.01"
                                placeholder="Destination Charges"
                                className="p-3 border rounded-lg"
                                value={form.destinationCharges}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        destinationCharges: e.target.value
                                    })
                                }
                            />

                            <input
                                required
                                type="number"
                                placeholder="Transit Days"
                                className="p-3 border rounded-lg"
                                value={form.transitTimeDays}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        transitTimeDays: e.target.value
                                    })
                                }
                            />

                            <input
                                required
                                type="date"
                                className="p-3 border rounded-lg md:col-span-2"
                                value={form.quoteValidityDate}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        quoteValidityDate: e.target.value
                                    })
                                }
                            />

                        </div>

                        <div className="bg-slate-900 text-white p-4 rounded-xl flex justify-between">
                            <span>Total Amount</span>
                            <span className="font-bold text-xl">
                                {formatCurrency(total)}
                            </span>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex justify-center items-center"
                        >
                            Submit Bid
                            <Send size={18} className="ml-2" />
                        </button>

                    </form>
                )}

            </div>

        </div>
    );
}