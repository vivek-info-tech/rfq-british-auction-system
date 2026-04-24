import { useEffect, useState } from 'react';
export default function CountdownTimer({target}){
 const [time,setTime]=useState('');
 useEffect(()=>{const t=setInterval(()=>{
 const diff=new Date(target)-new Date();
 if(diff<=0){setTime('Closed');return;}
 const h=Math.floor(diff/3600000),m=Math.floor(diff%3600000/60000),s=Math.floor(diff%60000/1000);
 setTime(`${h}h ${m}m ${s}s`);
 },1000); return ()=>clearInterval(t)},[target]);
 return <div className='text-2xl font-bold text-red-600'>{time}</div>
}