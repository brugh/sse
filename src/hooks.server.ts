import { REDISURL, REDISTOKEN } from '$env/static/private';
import type { Handle } from '@sveltejs/kit';

import { Redis } from '@upstash/redis'

const redis = new Redis({ url: REDISURL, token: REDISTOKEN });
export const handle: Handle = async ({ event, resolve }) => {
  event.locals.redis = redis;
  return resolve(event);
};
