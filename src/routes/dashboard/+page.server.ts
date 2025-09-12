import { requireAuth } from '$lib/auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	// Require authentication for this page
	const user = await requireAuth(event, event.url.pathname);

	// Return user data and any other dashboard data
	return {
		user,
		// Add other dashboard data here
		stats: {
			repositories: 12,
			followers: 45,
			following: 23
		}
	};
};
