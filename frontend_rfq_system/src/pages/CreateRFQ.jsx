import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { Package, Calendar, Clock, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function CreateRFQ({ onSave, simulatedTime }) {
    const navigate = useNavigate();

    const formatInputDate = (date) =>
        new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

    const [form, setForm] = useState({
        title: '',
        referenceId: `RFQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        pickupDate: '',
        startTime: formatInputDate(new Date(simulatedTime)),
        closeTime: formatInputDate(new Date(simulatedTime + 5 * 60000)),
        forcedCloseTime: formatInputDate(new Date(simulatedTime + 15 * 60000)),
        triggerWindowMins: 3,
        extensionDurationMins: 5,
        triggerType: 'ANY_RANK_CHANGE',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const sTime = new Date(form.startTime).getTime();
        const cTime = new Date(form.closeTime).getTime();
        const fTime = new Date(form.forcedCloseTime).getTime();

        if (sTime >= cTime) return alert('Start Time must be before Initial Close Time.');
        if (cTime >= fTime) return alert('Initial Close Time must be before Forced Close Time.');

        const payload = {
            title: form.title,
            referenceId: form.referenceId,
            pickupDate: form.pickupDate,
            startTime: form.startTime + ':00',
            bidCloseTime: form.closeTime + ':00',
            forcedCloseTime: form.forcedCloseTime + ':00',
            triggerWindowMinutes: parseInt(form.triggerWindowMins, 10),
            extensionMinutes: parseInt(form.extensionDurationMins, 10),
            extensionTriggerType: form.triggerType,
            status: 'UPCOMING',
        };

        try {
            const response = await api.post('/rfq/create', payload);
            alert(`Auction created successfully in Database! Assigned ID: ${response.data.id}`);

            if (typeof onSave === 'function') {
                onSave(response.data);
            }

            navigate('/rfqs');
        } catch (error) {
            console.error('Database save failed:', error);
            const errorMsg = error.response?.data?.message || error.response?.data || error.message;
            alert('Failed to save auction: ' + errorMsg);
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="mb-6 flex items-center">
                <button onClick={() => navigate('/rfqs')} className="mr-4 p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-2xl font-bold text-slate-900">Create British Auction RFQ</h2>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-8 space-y-8">

                    <div>
                        <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4 flex items-center">
                            <Package className="mr-2 text-blue-600" size={20} /> Basic Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">RFQ Title</label>
                                <input required type="text"
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                    value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                                    placeholder="e.g. Ocean Freight - Shanghai to LA" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Reference ID</label>
                                <input required type="text"
                                    className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl outline-none text-slate-500 font-mono"
                                    value={form.referenceId} readOnly />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Pickup Date</label>
                                <input required type="date"
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                    value={form.pickupDate} onChange={e => setForm({ ...form, pickupDate: e.target.value })} />
                            </div>
                        </div>
                    </div>


                    <div>
                        <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4 flex items-center">
                            <Calendar className="mr-2 text-blue-600" size={20} /> Auction Timeline
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Auction Start Time</label>
                                <input required type="datetime-local"
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                    value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Initial Bid Close Time</label>
                                <input required type="datetime-local"
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                    value={form.closeTime} onChange={e => setForm({ ...form, closeTime: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Forced Bid Close Time</label>
                                <input required type="datetime-local"
                                    className="w-full p-3 bg-red-50 border border-red-200 text-red-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 transition-all outline-none"
                                    value={form.forcedCloseTime} onChange={e => setForm({ ...form, forcedCloseTime: e.target.value })} />
                                <p className="text-xs text-red-600 mt-2 font-medium">Hard stop. Bidding cannot extend past this time.</p>
                            </div>
                        </div>
                    </div>


                    <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                            <Clock className="mr-2 text-blue-600" size={20} /> Extension Rules
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Trigger Window (X mins)</label>
                                <input required type="number" min="1"
                                    className="w-full p-3 bg-white border border-blue-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                    value={form.triggerWindowMins} onChange={e => setForm({ ...form, triggerWindowMins: Number(e.target.value) })} />
                                <p className="text-xs text-slate-500 mt-2">Monitor activity in the final X minutes.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Extension Duration (Y mins)</label>
                                <input required type="number" min="1"
                                    className="w-full p-3 bg-white border border-blue-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                    value={form.extensionDurationMins} onChange={e => setForm({ ...form, extensionDurationMins: Number(e.target.value) })} />
                                <p className="text-xs text-slate-500 mt-2">Add Y minutes if triggered.</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-3">Extension Trigger Condition</label>
                            <div className="space-y-3">
                                {[
                                    { id: 'BID_RECEIVED', title: 'Any Bid Received', desc: 'Extend if ANY new bid is placed in the trigger window.' },
                                    { id: 'ANY_RANK_CHANGE', title: 'Any Supplier Rank Change', desc: 'Extend if a bid causes any existing supplier to drop in rank.' },
                                    { id: 'L1_RANK_CHANGE', title: 'Lowest Bidder (L1) Rank Change', desc: 'Extend ONLY if a new bid becomes the #1 lowest price.' },
                                ].map(type => (
                                    <label
                                        key={type.id}
                                        className={`flex items-start p-4 rounded-xl cursor-pointer border-2 transition-all ${form.triggerType === type.id ? 'bg-white border-blue-600 shadow-sm' : 'bg-white/60 border-transparent hover:border-blue-300 hover:bg-white'}`}
                                    >
                                        <input type="radio" name="triggerType" value={type.id}
                                            className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
                                            checked={form.triggerType === type.id}
                                            onChange={e => setForm({ ...form, triggerType: e.target.value })} />
                                        <div className="ml-3">
                                            <span className="block text-sm font-bold text-slate-900">{type.title}</span>
                                            <span className="block text-sm text-slate-500 mt-0.5">{type.desc}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 p-6 border-t border-slate-200 flex justify-end space-x-4">
                    <button type="button" onClick={() => navigate('/rfqs')}
                        className="px-6 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors">
                        Cancel
                    </button>
                    <button type="submit"
                        className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-200 transition-all flex items-center">
                        <CheckCircle2 size={18} className="mr-2" /> Launch Auction
                    </button>
                </div>
            </form>
        </div>
    );
}
