"use client";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { PortalSnapshot, SchoolSettings } from '../types/portal';
import type { Pupil, TermResultRecord } from '../mockData';
import type { SessionActor } from '../auth/session';

export async function api<T>(url: string, body?: unknown, method = 'POST'): Promise<T> {
  const response = await fetch(url, { method: body === undefined ? 'GET' : method, credentials: 'same-origin', cache: 'no-store', ...(body === undefined ? {} : { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }) });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Unable to complete this request.');
  return data as T;
}
export function useActorQuery() { return useQuery({queryKey:['actor'],queryFn:()=>api<{actor:SessionActor}>('/api/auth/session'),retry:false}); }
export const usePortalQuery=()=>usePortal(p=>p);
function usePortal<T>(select:(data:PortalSnapshot)=>T) { return useQuery({queryKey:['portal'],queryFn:()=>api<PortalSnapshot>('/api/portal'),select,retry:false,staleTime:15000}); }
export const useSchoolSummaryQuery=()=>usePortal(p=>p.summary);
export const useClassesQuery=()=>usePortal(p=>p.classes);
export const useClassStatsQuery=()=>usePortal(p=>p.classStats);
export const usePupilsQuery=()=>usePortal(p=>p.pupils);
export const usePupilQuery=(id?:string)=>usePortal(p=>id?p.pupils.find(x=>x.id===id):p.pupils[0]);
export const useFeeBreakdownQuery=()=>usePortal(p=>p.feeItems);
export const usePaymentsQuery=()=>usePortal(p=>p.payments);
export const useRemindersQuery=()=>usePortal(p=>p.rules);
export const useReminderLogsQuery=()=>usePortal(p=>p.logs);
export const useStudentResultQuery=(pupilId?:string)=>usePortal(p=>p.results.find(r=>r.pupilId===(pupilId??p.pupils[0]?.id)));
export const useAllResultsQuery=()=>usePortal(p=>p.results);
export const useSettingsQuery=()=>usePortal(p=>p.settings);
export const useTermQuery=()=>usePortal(p=>p.termId);
function useRefresh(){ const cache=useQueryClient();return ()=>{void cache.invalidateQueries({queryKey:['portal']});}; }
export function useAddPupilMutation(){const refresh=useRefresh();return useMutation({mutationFn:(pupil:Omit<Pupil,'id'>)=>api('/api/pupils',{firstName:pupil.fullName.split(' ')[0],lastName:pupil.fullName.split(' ').slice(1).join(' '),classId:pupil.classGrade,dateOfBirth:pupil.dateOfBirth,gender:pupil.gender.toLowerCase(),guardianName:pupil.guardianName,guardianPhone:pupil.guardianPhone,guardianEmail:pupil.guardianEmail}),onSuccess:refresh});}
export function useUpdatePupilMutation(){const refresh=useRefresh();return useMutation({mutationFn:(pupil:Pupil)=>api('/api/portal/actions',{action:'update_pupil',pupil}),onSuccess:refresh});}
export function useRecordPaymentMutation(){return useMutation({mutationFn:async(params:{pupilId:string;amount:number;payerEmail:string;channel?:string;notes?:string})=>{
 if(!Number.isFinite(params.amount)||params.amount<=0||!Number.isSafeInteger(params.amount*100))throw new Error('Enter a valid payment amount.');
 const portal=await api<PortalSnapshot>('/api/portal');if(!portal.termId)throw new Error('The school has not opened an academic term.');
 return api<{authorization_url:string;reference:string}>('/api/payments/initialize',{pupilId:params.pupilId,termId:portal.termId,amountMinor:params.amount*100,payerEmail:params.payerEmail});
}});}
export function useToggleReminderRuleMutation(){const refresh=useRefresh();return useMutation({mutationFn:(body:{ruleId:string;isActive:boolean})=>api('/api/portal/actions',{action:'toggle_reminder',...body}),onSuccess:refresh});}
export function useTriggerReminderBatchMutation(){const refresh=useRefresh();return useMutation({mutationFn:(body:{ruleId:string})=>api('/api/portal/actions',{action:'queue_reminders',...body}),onSuccess:refresh});}
export function useUpdateResultStatusMutation(){const refresh=useRefresh();return useMutation({mutationFn:async({status,resultId}:{status:TermResultRecord['status'];resultId?:string})=>{if(!resultId)throw new Error('Select the result to update.');return api('/api/results/publish',{resultId,status:status.toLowerCase().replaceAll(' ','_')});},onSuccess:refresh});}
export function useUpdateSettingsMutation(){const refresh=useRefresh();return useMutation({mutationFn:(settings:Partial<SchoolSettings>)=>api('/api/portal/actions',{action:'update_settings',settings}),onSuccess:refresh});}
