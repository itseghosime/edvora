"use client";
import { useId, useState } from "react";
const schedules = {
  nursery: [
    ["Arrival", "Welcome circle", "A calm welcome, conversation and settling-in activities."],
    ["Morning", "Stories & sounds", "Picture books, phonics and guided language play."],
    ["Break", "Snack & outdoor play", "Time to eat, move and play together."],
    ["Late morning", "Numbers & discovery", "Counting, sorting, building and hands-on exploration."],
    ["Afternoon", "Creative play & reflection", "Art, music and a gentle review of the day."],
  ],
  primary: [
    ["Arrival", "Class check-in", "Prepare for the day and discuss shared goals."],
    ["Morning", "Literacy & mathematics", "Focused reading, writing and problem-solving."],
    ["Break", "Snack & movement", "Refresh, play and reconnect with classmates."],
    ["Late morning", "Science & the wider world", "Practical investigation, discussion and group work."],
    ["Afternoon", "Clubs & reflection", "Creative activities, independent practice and feedback."],
  ],
};
export default function DailyRhythm() {
 const [stage, setStage] = useState<keyof typeof schedules>("nursery");
 const id = useId();
 return <div className="space-y-6">
   <div className="flex flex-wrap gap-2" role="group" aria-label="Learning stage">
     {([['nursery','Early Years'],['primary','Primary School']] as const).map(([key,label])=><button key={key} type="button" aria-pressed={stage===key} aria-controls={id} onClick={()=>setStage(key)} className={`rounded-xl px-4 py-3 font-semibold ${stage===key?'bg-primary text-on-primary':'bg-surface-container text-primary'}`}>{label}</button>)}
   </div>
   <p className="text-sm text-on-surface-variant">An example of how learning can flow through the day. Confirm class timetables with the school office.</p>
   <ol id={id} aria-label={`${stage==='nursery'?'Early Years':'Primary School'} daily rhythm`} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
     {schedules[stage].map(([time,title,description])=><li key={title} className="rounded-2xl bg-surface-container-lowest p-5 border border-ink-border"><span className="text-xs font-semibold text-primary">{time}</span><h3 className="font-semibold mt-2 mb-2">{title}</h3><p className="text-sm text-on-surface-variant">{description}</p></li>)}
   </ol>
 </div>;
}
