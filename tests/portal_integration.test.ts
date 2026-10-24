import { afterEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { api } from '../src/lib/query/hooks';
import { pupilScope } from '../src/lib/services/portalService';
import { DatabaseRepository } from '../src/lib/db/supabaseRepository';
import { createSessionToken, verifySessionToken } from '../src/lib/auth/session';
import { GET as readPortal } from '../src/app/api/portal/route';

const teacher = {type:'staff' as const,userId:'teacher',staffId:'teacher',role:'teacher' as const,email:'teacher@example.com',name:'Teacher',assignedClassIds:[],exp:Math.floor(Date.now()/1000)+60};
afterEach(()=>vi.unstubAllGlobals());
describe('Portal integration boundary',()=>{
  it('rejects unsigned portal reads before accessing school data',async()=>{
    const response=await readPortal(new NextRequest('http://localhost/api/portal'));
    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({error:'Authentication required'});
  });
  it('does not let teachers with no assigned classes inherit school-wide pupil access',async()=>{
    expect(pupilScope(teacher)).toEqual({classIds:[]});
    expect(await new DatabaseRepository().listPupils(pupilScope(teacher))).toEqual([]);
  });
  it('scopes student reads to the signed-in pupil rather than a browser-selected identity',()=>{
    expect(pupilScope({type:'student',userId:'child-a',pupilId:'child-a',admissionNumber:'A',name:'A',className:'1',exp:teacher.exp})).toEqual({pupilId:'child-a'});
  });
  it('propagates failed payment initialization without inventing success data',async()=>{
    vi.stubGlobal('fetch',vi.fn().mockResolvedValue(Response.json({error:'Checkout unavailable'},{status:503})));
    await expect(api('/api/payments/initialize',{amountMinor:10000})).rejects.toThrow('Checkout unavailable');
  });
  it('does not create a response when the application cannot reach the backend',async()=>{
    vi.stubGlobal('fetch',vi.fn().mockRejectedValue(new Error('offline')));
    await expect(api('/api/portal')).rejects.toThrow('offline');
  });
  it('rejects extra segments appended to an otherwise valid signed session',()=>{
    const token=createSessionToken(teacher);
    expect(verifySessionToken(token)?.type).toBe('staff');
    expect(verifySessionToken(token+'.extra')).toBeNull();
  });
});
