import { Link } from 'react-router-dom';
export default function AuctionCard({item}){
 return <div className='bg-white rounded-2xl shadow p-5 border'>
 <h2 className='font-semibold text-lg'>{item.rfqName}</h2>
 <p>Lowest Bid: ₹{item.lowestBid}</p>
 <p>Status: <span className='text-green-600'>{item.status}</span></p>
 <Link to={`/rfq/${item.id}`} className='mt-3 inline-block bg-blue-600 text-white px-4 py-2 rounded-xl'>View</Link>
 </div>
}