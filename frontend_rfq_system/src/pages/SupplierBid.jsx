export default function SupplierBid(){
 return <div className='p-8 max-w-2xl mx-auto'>
 <h1 className='text-3xl font-bold mb-6'>Place Bid</h1>
 <div className='space-y-4'>
 <input className='w-full border p-3 rounded-xl' placeholder='Supplier Name'/>
 <input className='w-full border p-3 rounded-xl' placeholder='Freight Charges'/>
 <input className='w-full border p-3 rounded-xl' placeholder='Origin Charges'/>
 <input className='w-full border p-3 rounded-xl' placeholder='Destination Charges'/>
 <button className='bg-green-600 text-white px-6 py-3 rounded-xl'>Submit Bid</button>
 </div></div>
}
