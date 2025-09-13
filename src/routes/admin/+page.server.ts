import type { PageServerLoad } from './$types';
import type { User } from '$lib/auth';

export const load: PageServerLoad = async (event) => {
	// 现阶段：服务端不进行认证检查，用户信息由客户端管理
	// 后续可以通过 JWT token 或其他方式在服务端获取用户信息
	const user: User | null = null;

	return {
		user,
		adminData: {
			totalUsers: 150,
			totalOrganizations: 25,
			systemHealth: 'good'
		}
	};
};
