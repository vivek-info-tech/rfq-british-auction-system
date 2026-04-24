import AuctionCard from '../components/AuctionCard';
const data=[{id:1,rfqName:'Mysore to Bangalore',lowestBid:9800,status:'ACTIVE'}];
export default function AuctionList(){
 return <div className='p-8 bg-slate-50 min-h-screen'>
 <h1 className='text-3xl font-bold mb-6'>Live Auctions</h1>
 <div className='grid md:grid-cols-3 gap-5'>
 {data.map(x=><AuctionCard key={x.id} item={x}/>)}
 </div></div>
}