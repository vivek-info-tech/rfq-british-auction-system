export default function CreateRFQ(){
 return <div className='p-8 max-w-3xl mx-auto'>
 <h1 className='text-3xl font-bold mb-6'>Create RFQ</h1>
 <div className='grid grid-cols-2 gap-4'>
 <input className='border p-3 rounded-xl' placeholder='RFQ Name'/>
 <input className='border p-3 rounded-xl' placeholder='Reference ID'/>
 <input type='datetime-local' className='border p-3 rounded-xl'/>
 <input type='datetime-local' className='border p-3 rounded-xl'/>
 <input type='datetime-local' className='border p-3 rounded-xl'/>
 <input className='border p-3 rounded-xl' placeholder='Trigger Window Minutes'/>
 </div>
 <button className='mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl'>Create</button>
 </div>
}