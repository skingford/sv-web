import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	// 现阶段：服务端不进行认证检查，用户信息由客户端管理
	// 后续可以通过 JWT token 或其他方式在服务端获取用户信息
	const user = null;

	return {
		user,
		sections: [
			{ slug: 'profile', title: 'Profile' },
			{ slug: 'notifications', title: 'Notifications' }
		]
	};
};
