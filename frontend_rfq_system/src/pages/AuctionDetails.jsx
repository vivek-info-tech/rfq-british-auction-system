import CountdownTimer from '../components/CountdownTimer';
import BidTable from '../components/BidTable';
const bids=[{name:'Blue Dart',price:9800},{name:'DHL',price:10000},{name:'Delhivery',price:10500}];
export default function AuctionDetails(){
 return <div className='p-8 bg-slate-50 min-h-screen space-y-6'>
 <div className='bg-white rounded-2xl p-6 shadow'>
 <h1 className='text-3xl font-bold'>Mysore to Bangalore</h1>
 <p className='text-gray-500'>Auction closes in:</p>
 <CountdownTimer target='2026-04-24T18:20:00'/>
 </div>
 <BidTable bids={bids}/>
 </div>
}