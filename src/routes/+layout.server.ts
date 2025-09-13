import type { LayoutServerLoad } from './$types';
import type { User } from '$lib/auth';
import { cleanup } from '$lib/utils/cache/index';

export const load: LayoutServerLoad = async ({ locals }) => {
	// 清空过期缓存
	cleanup();

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
