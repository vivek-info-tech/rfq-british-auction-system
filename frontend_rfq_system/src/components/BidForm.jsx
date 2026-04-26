import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { DollarSign, Send, Clock, Hourglass } from 'lucide-react';
import { formatCurrency, formatCountdown, formatDateTime } from '../utils/helpers';

export default function BidForm({ rfqId, isClosed, isStarted, startTime, simulatedTime, onSubmit }) {

    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        api.get('/supplier/all')
            .then(res => setSuppliers(res.data))
            .catch(err => console.error('Failed to fetch suppliers:', err));
    }, []);

    const [form, setForm] = useState({
        supplierId: '',
        freightCharges: '',
        originCharges: '',
        destinationCharges: '',
        transitTimeDays: '',
        quoteValidityDate: '',
    });

    const total =
        (parseFloat(form.freightCharges) || 0) +
        (parseFloat(form.originCharges) || 0) +
        (parseFloat(form.destinationCharges) || 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isClosed || !isStarted) return;


        if (!form.supplierId) {
            alert('Please select a supplier.');
            return;
        }

        const payload = {
            supplierId: parseInt(form.supplierId, 10),
            freightCharges: parseFloat(form.freightCharges) || 0,
            originCharges: parseFloat(form.originCharges) || 0,
            destinationCharges: parseFloat(form.destinationCharges) || 0,
            totalPrice: total,
            transitTimeDays: parseInt(form.transitTimeDays, 10),
            quoteValidityDate: form.quoteValidityDate,
        };

        try {
            const response = await api.post(`/bid/${rfqId}`, payload);


            setForm({
                supplierId: '',
                freightCharges: '',
                originCharges: '',
                destinationCharges: '',
                transitTimeDays: '',
                quoteValidityDate: '',
            });

            if (onSubmit) onSubmit(response.data);
        } catch (error) {
            const errorMessage = error.response?.data || error.message;
            console.error('Failed to submit bid:', errorMessage);
        }
    };

    if (isClosed) {
        return (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-center items-center min-h-[300px]">
                <Clock className="text-slate-400 mb-3" size={32} />
                <p className="text-slate-600 font-bold text-lg">Bidding Concluded</p>
                <p className="text-slate-400 text-sm mt-1">This auction is no longer accepting bids.</p>
            </div>
        );
    }

    if (!isStarted) {
        return (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-indigo-200 text-center flex flex-col justify-center items-center h-full min-h-[300px]">
                <div className="bg-indigo-50 p-4 rounded-full mb-4">
                    <Hourglass className="text-indigo-500 animate-pulse" size={40} />
                </div>
                <p className="text-indigo-900 font-extrabold text-xl mb-2">Auction Not Started</p>
                <p className="text-indigo-600 text-sm flex flex-col items-center">
                    Bidding opens in
                    <span className="font-mono font-black text-2xl text-indigo-800 mt-1">{formatCountdown(startTime - simulatedTime)}</span>
                </p>
                <p className="text-slate-500 text-xs mt-3 bg-slate-50 inline-block px-3 py-1 rounded-full border border-slate-100">
                    {formatDateTime(startTime)}
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-200 shadow-blue-50">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                <DollarSign className="mr-2 text-blue-600 bg-blue-50 rounded-lg p-1" size={24} />
                Submit New Quote
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        Supplier
                    </label>
                    <select

                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        value={form.supplierId}
                        onChange={e => setForm({ ...form, supplierId: e.target.value })}
                    >
                        <option value="">— Select supplier —</option>
                        {suppliers.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Freight ($)</label>
                        <input required type="number" step="0.01" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                            value={form.freightCharges} onChange={e => setForm({ ...form, freightCharges: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Origin ($)</label>
                        <input required type="number" step="0.01" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                            value={form.originCharges} onChange={e => setForm({ ...form, originCharges: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Dest ($)</label>
                        <input required type="number" step="0.01" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                            value={form.destinationCharges} onChange={e => setForm({ ...form, destinationCharges: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Transit (Days)</label>
                        <input required type="number" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                            value={form.transitTimeDays} onChange={e => setForm({ ...form, transitTimeDays: e.target.value })} />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Quote Valid Until</label>
                        <input required type="date" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                            value={form.quoteValidityDate} onChange={e => setForm({ ...form, quoteValidityDate: e.target.value })} />
                    </div>
                </div>

                <div className="pt-4 mt-2 border-t border-slate-100">
                    <div className="flex justify-between items-center mb-4 px-4 py-3 bg-slate-800 rounded-xl text-white shadow-inner">
                        <span className="text-sm font-bold uppercase tracking-wider text-slate-300">Total</span>
                        <span className="text-2xl font-black">{formatCurrency(total)}</span>
                    </div>
                    <button type="submit" className="w-full py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-200 transition-all flex justify-center items-center group">
                        Submit Binding Quote <Send size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </form>
        </div>
    );
}
