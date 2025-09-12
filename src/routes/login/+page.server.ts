import { fail, redirect } from '@sveltejs/kit';
import { authenticateUser, createSession, redirectIfAuthenticated } from '$lib/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	// Redirect if already authenticated
	await redirectIfAuthenticated(event);

	return {};
};

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const data = await request.formData();
		const email = data.get('email') as string;
		const password = data.get('password') as string;
		const rememberMe = data.get('remember-me') === 'on';

		// Basic validation
		if (!email || !password) {
			return fail(400, {
				error: 'Email and password are required',
				email
			});
		}

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return fail(400, {
				error: 'Please enter a valid email address',
				email
			});
		}

		// Password validation
		if (password.length < 6) {
			return fail(400, {
				error: 'Password must be at least 6 characters long',
				email
			});
		}

		try {
			// Authenticate user
			const user = await authenticateUser(email, password);

			if (!user) {
				return fail(401, {
					error: 'Invalid email or password',
					email
				});
			}

			// Create session
			const sessionId = await createSession(user);

			// Set session cookie
			cookies.set('session', sessionId, {
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 // 30 days or 1 day
			});

			// Redirect to intended page or dashboard
			const redirectTo = url.searchParams.get('redirect') || '/dashboard';
			throw redirect(302, redirectTo);
		} catch (error) {
			if (error instanceof Response) {
				throw error; // Re-throw redirect
			}

			console.error('Login error:', error);
			return fail(500, {
				error: 'An error occurred during login. Please try again.',
				email
			});
		}
	}
};
