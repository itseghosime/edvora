"use client";
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/query/hooks';

export default function PaymentReturnVerifier() {
  const cache=useQueryClient();
  const [attempt,setAttempt]=useState(0);
  const [state,setState]=useState<'idle'|'verifying'|'verified'|'unverified'>('idle');
  useEffect(()=>{
    const reference=new URLSearchParams(window.location.search).get('verify');
    if (!reference) return;
    let active=true;
    setState('verifying');
    api<{success:boolean}>('/api/payments/verify',{reference}).then(result=>{
      if (!active) return;
      setState(result.success?'verified':'unverified');
      if (result.success) void cache.invalidateQueries({queryKey:['portal']});
    }).catch(()=>{if(active)setState('unverified');});
    return ()=>{active=false;};
  },[attempt,cache]);
  if(state==='idle')return null;
  return <div role="status" className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4 text-sm">{state==='verifying'?'Verifying your payment…':state==='verified'?'Payment verified. Your balance and receipt have been refreshed.':'Payment has not been verified yet. Your balance has not been changed.'}{state==='unverified'&&<button className="ml-3 font-semibold text-primary underline" onClick={()=>setAttempt(x=>x+1)}>Check again</button>}</div>;
}
