import { REDISURL, REDISTOKEN } from '$env/static/private';

import { Redis } from '@upstash/redis'

const redis = new Redis({ url: REDISURL, token: REDISTOKEN });
export const handle = async ({ event, resolve }) => {
  event.locals.redis = redis;
  return resolve(event);
};
