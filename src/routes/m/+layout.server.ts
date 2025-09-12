import { requireAuth } from '$lib/auth';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	// Require authentication for user profile pages
	const user = await requireAuth(event, event.url.pathname);

	return {
		user
	};
};
