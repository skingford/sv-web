import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { localCache } from '$lib/utils/cache';

export interface User {
	id: string;
	email: string;
	username: string;
	avatar?: string;
	role?: 'user' | 'admin'; // 预留角色字段，现阶段可选
	createdAt?: Date;
	accessToken?: string; // 添加访问令牌
	expiresIn?: number; // 添加过期时间
}

export interface AuthSession {
	user: User;
	sessionId: string;
	expiresAt: Date;
}

// 缓存键常量
const AUTH_CACHE_KEYS = {
	USER: 'auth_user',
	TOKEN: 'auth_token',
	EXPIRES: 'auth_expires'
} as const;

/**
 * 检查用户是否已登录（基于缓存中的令牌）
 */
export function isUserLoggedIn(): boolean {
	if (typeof window === 'undefined') {
		return false; // 服务端环境
	}

	const token = localCache.get<string>(AUTH_CACHE_KEYS.TOKEN, { encrypt: false });
	const expires = localCache.get<number>(AUTH_CACHE_KEYS.EXPIRES, { encrypt: false });

	if (!token || !expires) {
		return false;
	}

	// 检查令牌是否过期
	const now = Date.now();
	if (now >= expires) {
		// 令牌过期，清除缓存
		clearAuthCache();
		return false;
	}

	return true;
}

/**
 * 获取当前登录用户信息
 */
export function getCurrentUser(): User | null {
	if (typeof window === 'undefined') {
		return null; // 服务端环境
	}

	if (!isUserLoggedIn()) {
		return null;
	}

	return localCache.get<User>(AUTH_CACHE_KEYS.USER, { encrypt: false });
}

/**
 * 保存用户认证信息到缓存
 */
export function saveAuthData(user: User, token: string, expiresIn: number): void {
	if (typeof window === 'undefined') {
		return; // 服务端环境
	}

	const expiresAt = Date.now() + expiresIn * 1000; // 转换为毫秒

	localCache.set(AUTH_CACHE_KEYS.USER, user, { encrypt: false });
	localCache.set(AUTH_CACHE_KEYS.TOKEN, token, { encrypt: false });
	localCache.set(AUTH_CACHE_KEYS.EXPIRES, expiresAt, { encrypt: false });
}

/**
 * 清除认证缓存
 */
export function clearAuthCache(): void {
	if (typeof window === 'undefined') {
		return; // 服务端环境
	}

	localCache.delete(AUTH_CACHE_KEYS.USER);
	localCache.delete(AUTH_CACHE_KEYS.TOKEN);
	localCache.delete(AUTH_CACHE_KEYS.EXPIRES);
}

/**
 * 检查用户是否有指定角色权限（预留功能）
 * 现阶段：有登录就有所有权限
 */
export function hasRole(requiredRole?: 'user' | 'admin'): boolean {
	const user = getCurrentUser();

	if (!user) {
		return false;
	}

	// 现阶段：只要登录就有所有权限
	// 后续可以根据 user.role 进行角色判断
	return true;
}

/**
 * 检查用户是否为管理员（预留功能）
 */
export function isAdmin(): boolean {
	const user = getCurrentUser();

	if (!user) {
		return false;
	}

	// 现阶段：只要登录就认为是管理员
	// 后续可以根据 user.role === 'admin' 进行判断
	return true;
}

// Mock session storage - replace with your actual session store (Redis, database, etc.)
const mockSessions: Record<string, AuthSession> = {};

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
 * Get user from request event (基于服务端会话或 JWT token)
 */
export async function getUserFromRequest(event: RequestEvent): Promise<User | null> {
	// 优先从服务端会话获取
	const sessionId = event.cookies?.get('session');
	if (sessionId) {
		const session = await getSession(sessionId);
		if (session?.user) {
			return session.user;
		}
	}

	// 检查 Authorization header 中的 JWT token
	const authHeader = event.request.headers.get('authorization');
	if (authHeader && authHeader.startsWith('Bearer ')) {
		const token = authHeader.substring(7);
		try {
			// 这里可以验证 JWT token 并返回用户信息
			// 现阶段：暂时返回 null，后续实现 JWT 验证
			console.log('[getUserFromRequest] 检测到 JWT token，但暂未实现验证');
			return null;
		} catch (error) {
			console.error('[getUserFromRequest] JWT token 验证失败:', error);
			return null;
		}
	}

	// 检查 cookies 中的认证 token
	const authToken = event.cookies?.get('auth_token');
	if (authToken) {
		try {
			// 这里可以验证认证 token 并返回用户信息
			// 现阶段：暂时返回 null，后续实现 token 验证
			console.log('[getUserFromRequest] 检测到认证 token，但暂未实现验证');
			return null;
		} catch (error) {
			console.error('[getUserFromRequest] 认证 token 验证失败:', error);
			return null;
		}
	}

	return null;
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
 * 现阶段：只要登录就有管理员权限
 */
export async function requireAdmin(event: RequestEvent): Promise<User> {
	const user = await requireAuth(event);

	// 现阶段：只要登录就有所有权限
	// 后续可以根据 user.role !== 'admin' 进行判断
	// if (user.role !== 'admin') {
	//     throw redirect(302, '/unauthorized');
	// }

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
