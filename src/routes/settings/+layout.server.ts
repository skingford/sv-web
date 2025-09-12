import { requireAuth } from '$lib/auth';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	// Require authentication for settings pages
	const user = await requireAuth(event, event.url.pathname);

	return {
		user,
		sections: [
			{ slug: 'profile', title: 'Profile' },
			{ slug: 'notifications', title: 'Notifications' }
		]
	};
};
