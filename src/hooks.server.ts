import { redirect, type Handle } from '@sveltejs/kit';
import { getUserFromRequest, isAdmin } from '$lib/auth';

// Define protected routes that require authentication
const protectedRoutes = [
	'/dashboard',
	'/settings',
	'/m', // User profile routes
	'/orgs' // Organization routes (if they require auth)
];

// Define admin-only routes
const adminRoutes = ['/admin'];

// Define public routes that should redirect if already authenticated
const publicRoutes = ['/login', '/signup'];

/**
 * Check if a path matches any of the route patterns
 */
function matchesRoute(pathname: string, routes: string[]): boolean {
	return routes.some((route) => {
		if (route.endsWith('*')) {
			return pathname.startsWith(route.slice(0, -1));
		}
		return pathname === route || pathname.startsWith(route + '/');
	});
}

export const handle: Handle = async ({ event, resolve }) => {
	console.log(`[hooks.server.ts] 处理请求: ${event.request.method} ${event.url.pathname}`);

	const { pathname } = event.url;

	// 现阶段：主要使用客户端认证，服务端暂时不进行认证检查
	// 后续可以通过 JWT token 或其他方式在服务端验证认证状态
	const user = null; // 暂时设为 null，让客户端处理认证

	console.log(`[hooks.server.ts] 用户: 未设置`);

	// Add user to locals for use in load functions and pages
	event.locals.user = user;

	// 现阶段：不进行服务端认证检查，让客户端路由守卫处理
	// 后续可以实现服务端认证检查

	const response = await resolve(event);
	return response;
};
