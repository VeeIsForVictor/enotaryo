import { env } from '$env/dynamic/private';
import strict from 'assert';

strict(typeof env.DATABASE_URL !== 'undefined', 'missing DATABASE_URL');
strict(typeof env.PRIVATE_VAPID_KEY !== 'undefined', 'missing PRIVATE_VAPID_KEY');

export default {
	DATABASE_URL: env.DATABASE_URL,
	PRIVATE_VAPID_KEY: env.PRIVATE_VAPID_KEY
};
