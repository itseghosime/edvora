import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSession } from './session';

export async function requirePageSession(type: 'staff' | 'student') {
  const jar = await cookies();
  const actor = await getSession(new Request('http://localhost', {
    headers: { cookie: jar.toString() },
  }));
  if (!actor) redirect('/login');
  if (actor.type !== type) redirect(actor.type === 'staff' ? '/admin' : '/student');
  return actor;
}
