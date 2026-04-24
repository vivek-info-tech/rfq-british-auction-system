export default function BidTable({bids}){
 return <table className='w-full bg-white rounded-2xl overflow-hidden'>
 <thead className='bg-slate-100'><tr><th className='p-3'>Rank</th><th>Supplier</th><th>Price</th></tr></thead>
 <tbody>
 {bids.map((b,i)=><tr key={i} className='border-t text-center'>
 <td className='p-3'>L{i+1}</td><td>{b.name}</td><td>₹{b.price}</td>
 </tr>)}
 </tbody></table>
}