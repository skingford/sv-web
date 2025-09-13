import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	// 现阶段：服务端不进行认证检查，用户信息由客户端管理
	// 后续可以通过 JWT token 或其他方式在服务端获取用户信息
	const user = null;

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
