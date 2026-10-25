"use client";
import { useState } from "react";
export default function CollectionVisual({ classes }: { classes: { className: string; charges: number; paid: number; balance: number }[] }) {
 const [mode,setMode]=useState<"paid"|"balance">("paid");
 return <section className="edvora-collection edvora-panel" aria-label="Fee collection visual">
 <div className="edvora-collection-heading"><div><span className="edvora-eyebrow">A clearer picture</span><h2>Every class, at a glance.</h2><p>Explore verified collections and outstanding balances.</p></div><div className="edvora-segment" aria-label="Collection display"><button type="button" aria-pressed={mode==="paid"} onClick={()=>setMode("paid")}>Collected</button><button type="button" aria-pressed={mode==="balance"} onClick={()=>setMode("balance")}>Outstanding</button></div></div>
 <div className="edvora-bars">{classes.map(c=>{const value=mode==="paid"?c.paid:c.balance;const percent=c.charges>0?Math.max(0,Math.min(100,Math.round(value/c.charges*100))):0;return <div key={c.className} className="edvora-bar-row"><span>{c.className}</span><div role="meter" aria-label={c.className+" "+(mode==="paid"?"collected":"outstanding")} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}><span style={{width:percent+"%",background:mode==="paid"?"#51826a":"#c29960"}}/></div><strong>{percent}%</strong></div>;})}</div></section>;
}
