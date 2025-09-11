import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
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
			// TODO: Replace with your actual authentication logic
			// This is a mock authentication - replace with your auth service
			if (email === 'demo@example.com' && password === 'password') {
				// Set session cookie
				const sessionId = crypto.randomUUID();
				cookies.set('session', sessionId, {
					path: '/',
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					sameSite: 'strict',
					maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 // 30 days or 1 day
				});

				// Redirect to dashboard or home page
				throw redirect(302, '/dashboard');
			} else {
				return fail(401, {
					error: 'Invalid email or password',
					email
				});
			}
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
