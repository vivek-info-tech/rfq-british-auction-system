import { Link } from 'react-router-dom';
export default function Navbar() {
    return <nav className='bg-slate-900 text-white px-6 py-4 flex justify-between'>
        <h1 className='font-bold text-xl'>RFQ Auction</h1>
        <div className='space-x-4'>
            <Link to='/'>Home</Link>
            <Link to='/rfqs'>Auctions</Link>
            <Link to='/create'>Create RFQ</Link>
        </div>
    </nav>
}