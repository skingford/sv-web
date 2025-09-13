import { redirect, type Handle } from '@sveltejs/kit';
import { getUserFromRequest } from '$lib/auth';

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

	// Get user from session
	const user = await getUserFromRequest(event);

	console.log(`[hooks.server.ts] 用户: ${user?.email}`);

	// Add user to locals for use in load functions and pages
	event.locals.user = user;

	// Handle protected routes
	if (matchesRoute(pathname, protectedRoutes)) {
		if (!user) {
			const redirectUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
			throw redirect(302, redirectUrl);
		}
	}

	// Handle admin routes
	if (matchesRoute(pathname, adminRoutes)) {
		if (!user) {
			const redirectUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
			throw redirect(302, redirectUrl);
		}
		if (user.role !== 'admin') {
			throw redirect(302, '/unauthorized');
		}
	}

	// Handle public routes (redirect if already authenticated)
	if (matchesRoute(pathname, publicRoutes) && user) {
		// Check for redirect parameter
		const redirectTo = event.url.searchParams.get('redirect') || '/dashboard';
		throw redirect(302, redirectTo);
	}

	const response = await resolve(event);
	return response;
};
