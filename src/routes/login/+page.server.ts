import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	// 现阶段：服务端不进行认证检查，让客户端处理重定向逻辑
	// 后续可以通过 JWT token 或其他方式在服务端检查认证状态
	return {};
};

export const actions: Actions = {
	default: async ({ request }) => {
		// 现阶段：主要使用客户端认证，服务端 actions 暂时不处理登录
		// 后续可以实现服务端登录逻辑
		return {
			error: 'Please use the client-side login form'
		};
	}
};
