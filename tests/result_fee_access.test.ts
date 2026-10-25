import { beforeEach, describe, expect, it, vi } from "vitest";
const state=vi.hoisted(()=>({locked:true,overridden:false,published:true,error:false}));
vi.mock("../src/lib/auth/currentActor",()=>({currentActor:vi.fn(async(actor)=>actor)}));
vi.mock("../src/lib/db/supabaseRepository",()=>({db:{listPupils:vi.fn(async()=>[{id:"child",firstName:"Test",lastName:"Pupil",classId:"class",className:"Primary 1",gender:"female",status:"active"}])}}));
vi.mock("../src/lib/supabase/client",()=>{
 const tables:Record<string,unknown[]>={
  academic_terms:[{id:"term",name:"First Term",academic_sessions:{name:"2026/2027"}}],
  academic_results:[{id:"report",pupil_id:"child",subjects:[{subject:"Private grade",ca:35,exam:55,total:90,grade:"A"}],total_score:90,max_score:100,average_score:90,status:"published"}],
  fee_assignments:[{id:"fee",pupil_id:"child",adjusted_amount_minor:10000,base_amount_minor:10000}],
  fee_ledger_entries:[],payment_intents:[],payment_transactions:[],school_settings:[],school_classes:[],reminder_rules:[],reminder_attempts:[],fee_plans:[],
 };
 const query=(data:unknown,error:unknown=null)=>{
  const q:Record<string,any>={};for(const name of ["select","eq","in","limit","order"])q[name]=()=>q;
  q.then=(resolve:any)=>Promise.resolve({data,error}).then(resolve);return q;
 };
 return{getSupabaseAdmin:()=>({from:(name:string)=>query(tables[name]??[]),rpc:vi.fn(()=>query([{pupil_id:"child",balance_minor:state.locked?10000:0,locked:state.locked,overridden:state.overridden,has_published:state.published}],state.error?{message:"Access lookup unavailable"}:null))})};
});
import { readPortal } from "../src/lib/services/portalService";
import { db } from "../src/lib/db/supabaseRepository";
import type { SessionActor } from "../src/lib/auth/session";
const student={type:"student",pupilId:"child",userId:"child",name:"Test",admissionNumber:"EDV/001",className:"Primary 1",exp:9999999999} as SessionActor;
beforeEach(()=>Object.assign(state,{locked:true,overridden:false,published:true,error:false}));
describe("Result fee access at the portal boundary",()=>{
 it("returns lock metadata but no marks, comments or printable report for an unpaid pupil",async()=>{
  const response=await readPortal(student);
  expect(response.results).toEqual([]);
  expect(JSON.stringify(response)).not.toContain("Private grade");
  expect(response.resultAccess?.[0]).toMatchObject({locked:true,balance:100});
  expect(db.listPupils).toHaveBeenCalledWith({pupilId:"child"});
 });
 it("returns published grades after fee clearance",async()=>{
  state.locked=false;const response=await readPortal(student);
  expect(response.results[0].percentage).toBe(90);
 });
 it("returns a published report with an explicit override",async()=>{
  state.locked=false;state.overridden=true;
  expect((await readPortal(student)).results).toHaveLength(1);
 });
 it("does not reveal a draft even with an access override",async()=>{
  state.locked=false;state.overridden=true;state.published=false;
  expect((await readPortal(student)).results).toEqual([]);
 });
 it("fails closed when the authoritative fee lookup fails",async()=>{
  state.error=true;await expect(readPortal(student)).rejects.toThrow("Access lookup unavailable");
 });
 it("keeps administrator academic review available while the pupil is locked",async()=>{
  const actor={...student,type:"staff",staffId:"admin",role:"admin",assignedClassIds:[],email:"admin@test.invalid"} as SessionActor;
  expect((await readPortal(actor)).results).toHaveLength(1);
 });
});
