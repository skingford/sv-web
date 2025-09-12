import type { LayoutServerLoad } from './$types';
import type { User } from '$lib/auth';
export const load: LayoutServerLoad = async ({ locals }) => {
	return {
		// user: locals.user
		user: {
			id: '2',
			email: 'admin@example.com',
			username: 'admin',
			avatar: 'https://github.com/octocat.png',
			role: 'admin',
			createdAt: new Date('2023-01-01')
		} as User
	};
};
