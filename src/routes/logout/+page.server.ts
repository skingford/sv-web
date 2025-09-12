import { redirect } from '@sveltejs/kit';
import { deleteSession } from '$lib/auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const sessionId = cookies.get('session');

	if (sessionId) {
		// Delete session from store
		await deleteSession(sessionId);

		// Clear session cookie
		cookies.delete('session', { path: '/' });
	}

	// Redirect to home page
	throw redirect(302, '/');
};
