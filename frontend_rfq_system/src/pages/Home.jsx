import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingDown, Package, Activity } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-[80vh] flex flex-col justify-center items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-blue-100 p-4 rounded-full mb-6">
                <TrendingDown size={48} className="text-blue-600" />
            </div>
            <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                Welcome to RFQ Auction
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mb-10">
                The ultimate platform for managing live British Auctions and global sourcing events with real-time bidding extensions.
            </p>

            <div className="flex space-x-4">
                <Link to="/rfqs" className="flex items-center px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md">
                    <Activity className="mr-2" size={20} /> View Active Auctions
                </Link>
                <Link to="/create" className="flex items-center px-6 py-3 bg-white text-slate-700 font-bold border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors">
                    <Package className="mr-2" size={20} /> Create New RFQ
                </Link>
            </div>
        </div>
    );
}