import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export interface User {
	id: string;
	email: string;
	username: string;
	avatar?: string;
	role: 'user' | 'admin';
	createdAt: Date;
}

export interface AuthSession {
	user: User;
	sessionId: string;
	expiresAt: Date;
}

// Mock user database - replace with your actual database
const mockUsers: Record<string, User> = {
	'demo@example.com': {
		id: '1',
		email: 'demo@example.com',
		username: 'demo',
		avatar: 'https://github.com/octocat.png',
		role: 'user',
		createdAt: new Date('2023-01-01')
	},
	'admin@example.com': {
		id: '2',
		email: 'admin@example.com',
		username: 'admin',
		avatar: 'https://github.com/octocat.png',
		role: 'admin',
		createdAt: new Date('2023-01-01')
	}
};

// Mock session storage - replace with your actual session store (Redis, database, etc.)
const mockSessions: Record<string, AuthSession> = {};

/**
 * Authenticate user with email and password
 */
export async function authenticateUser(email: string, password: string): Promise<User | null> {
	// Mock authentication - replace with your actual authentication logic
	if (email === 'demo@example.com' && password === 'password') {
		return mockUsers[email];
	}
	if (email === 'admin@example.com' && password === 'admin123') {
		return mockUsers[email];
	}
	return null;
}

/**
 * Create a new session for the user
 */
export async function createSession(user: User): Promise<string> {
	const sessionId = crypto.randomUUID();
	const expiresAt = new Date();
	expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

	mockSessions[sessionId] = {
		user,
		sessionId,
		expiresAt
	};

	return sessionId;
}

/**
 * Get session by session ID
 */
export async function getSession(sessionId: string): Promise<AuthSession | null> {
	const session = mockSessions[sessionId];

	if (!session) {
		return null;
	}

	// Check if session is expired
	if (session.expiresAt < new Date()) {
		delete mockSessions[sessionId];
		return null;
	}

	return session;
}

/**
 * Delete a session
 */
export async function deleteSession(sessionId: string): Promise<void> {
	delete mockSessions[sessionId];
}

/**
 * Get user from request event (cookies)
 */
export async function getUserFromRequest(event: RequestEvent): Promise<User | null> {
	const sessionId = event.cookies?.get('session') || 'admin';

	if (!sessionId) {
		return null;
	}

	const session = await getSession(sessionId);
	return session?.user || null;
}

/**
 * Require authentication - redirect to login if not authenticated
 */
export async function requireAuth(event: RequestEvent, redirectTo?: string): Promise<User> {
	const user = await getUserFromRequest(event);

	if (!user) {
		const loginUrl = redirectTo ? `/login?redirect=${encodeURIComponent(redirectTo)}` : '/login';
		throw redirect(302, loginUrl);
	}

	return user;
}

/**
 * Require admin role - redirect to unauthorized page if not admin
 */
export async function requireAdmin(event: RequestEvent): Promise<User> {
	const user = await requireAuth(event);

	if (user.role !== 'admin') {
		throw redirect(302, '/unauthorized');
	}

	return user;
}

/**
 * Redirect if already authenticated
 */
export async function redirectIfAuthenticated(
	event: RequestEvent,
	redirectTo: string = '/dashboard'
): Promise<void> {
	const user = await getUserFromRequest(event);

	if (user) {
		throw redirect(302, redirectTo);
	}
}
