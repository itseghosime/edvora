import { afterEach, describe, expect, it, vi } from 'vitest';
const { from, select, eq, within } = vi.hoisted(() => ({ from: vi.fn(), select: vi.fn(), eq: vi.fn(), within: vi.fn() }));
vi.mock('../src/lib/supabase/client', () => ({ getSupabaseAdmin: () => ({ from }) }));
import { DatabaseRepository } from '../src/lib/db/supabaseRepository';
afterEach(() => vi.clearAllMocks());
describe('Pupil primary guardian query', () => {
  it('disambiguates the primary guardian from the many-to-many link and preserves pupil scoping', async () => {
    const row = { id:'child-a', admission_number:'EDV/DEMO/001',first_name:'Demo',last_name:'Pupil',gender:'female',class_id:'class-a',status:'active',date_of_birth:'2021-01-01',guardian_id:'guardian-a',school_classes:{name:'Primary 1'},guardians:{full_name:'Primary guardian',phone_number:'',telegram_chat_id:null} };
    const query = { select, eq, in: within, then: (resolve: (value: unknown) => unknown) => Promise.resolve(resolve({data:[row],error:null})) };
    from.mockReturnValue(query);
    select.mockReturnValue(query); eq.mockReturnValue(query); within.mockReturnValue(query);
    const rows = await new DatabaseRepository().listPupils({pupilId:'child-a'});
    expect(select).toHaveBeenCalledWith('*, school_classes(name), guardians!pupils_guardian_id_fkey(full_name, phone_number, telegram_chat_id)');
    expect(eq).toHaveBeenCalledWith('id','child-a');
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({id:'child-a',guardianId:'guardian-a',guardianName:'Primary guardian',className:'Primary 1'});
  });
  it('does not request school-wide pupil data for an unassigned teacher', async () => {
    expect(await new DatabaseRepository().listPupils({classIds:[]})).toEqual([]);
    expect(from).not.toHaveBeenCalled();
  });
});
