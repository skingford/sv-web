import { requireAdmin } from '$lib/auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	// Require admin role for this page
	const user = await requireAdmin(event);

	return {
		user,
		adminData: {
			totalUsers: 150,
			totalOrganizations: 25,
			systemHealth: 'good'
		}
	};
};
