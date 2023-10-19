// @ts-nocheck
import { error as svelteKitError, type Actions, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { APIKEY } from '$env/static/private';
import Ably, { type Types } from 'ably';

const ably: Types.RealtimePromise = new Ably.Realtime.Promise(APIKEY);

export const actions = {
  disconnect: ({ cookies }: import('./$types').RequestEvent) => {
    const session = cookies.get('session');
    if (session) cookies.delete('session', { path: '/' });
    throw redirect(303, '/offline');
  },
  
  connect: async ({ cookies, request }: import('./$types').RequestEvent) => {
    const form = await request.formData();
    console.log(form.get('name'))
    const name = form.get('name');
    const clientId = crypto.randomUUID();
    const expires = new Date();
    expires.setTime(expires.getTime() + 2000 * 3600);
console.log({clientId, name})
    cookies.set('session', JSON.stringify({ clientId, name }), {
      path: '/', expires: expires, sameSite: 'lax', httpOnly: false
    });
    // throw redirect(303, '/');
  }
};

export const load = async function load({ cookies, url }: Parameters<PageServerLoad>[0]) {
  try {
    const session = cookies.get('session');
    if (session) {
      const { clientId, name } = JSON.parse(session);
      const token = await ably.auth.requestToken({ clientId });
      return { name, token };
    }
  } catch (error: unknown) {
    const { pathname } = url;
    const message = `Error in server load function for ${pathname}: ${error as string}`;
    throw svelteKitError(500, message);
  }
};;null as any as Actions;