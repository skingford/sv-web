import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { get } from 'svelte/store';
import { clearAuth, user } from '$lib/stores/auth';
import type { HandleClientError } from '@sveltejs/kit';
import type { User } from '$lib/auth';

// 路由配置类型
interface RouteConfig {
	path: string;
	requiresAuth: boolean;
	requiresAdmin: boolean;
	redirectIfAuthenticated: boolean;
}

// 路由配置映射
const routeConfigs: Record<string, RouteConfig> = {
	'/dashboard': {
		path: '/dashboard',
		requiresAuth: true,
		requiresAdmin: false,
		redirectIfAuthenticated: false
	},
	'/settings': {
		path: '/settings',
		requiresAuth: true,
		requiresAdmin: false,
		redirectIfAuthenticated: false
	},
	'/m': { path: '/m', requiresAuth: true, requiresAdmin: false, redirectIfAuthenticated: false },
	'/orgs': {
		path: '/orgs',
		requiresAuth: true,
		requiresAdmin: false,
		redirectIfAuthenticated: false
	},
	'/admin': {
		path: '/admin',
		requiresAuth: true,
		requiresAdmin: true,
		redirectIfAuthenticated: false
	},
	'/login': {
		path: '/login',
		requiresAuth: false,
		requiresAdmin: false,
		redirectIfAuthenticated: true
	},
	'/signup': {
		path: '/signup',
		requiresAuth: false,
		requiresAdmin: false,
		redirectIfAuthenticated: true
	}
};

// 缓存当前路径和用户状态，避免重复检查
let lastCheckedPath = '';
let lastUserState: User | null = null;
let isNavigating = false;

/**
 * 获取路由配置
 */
function getRouteConfig(pathname: string): RouteConfig | null {
	// 精确匹配
	if (routeConfigs[pathname]) {
		return routeConfigs[pathname];
	}

	// 前缀匹配
	for (const [route, config] of Object.entries(routeConfigs)) {
		if (pathname.startsWith(route + '/')) {
			return config;
		}
	}

	return null;
}

/**
 * 优化的路由守卫检查
 */
function checkRouteAccess(pathname: string, currentUser: User | null): boolean {
	// 避免重复检查相同路径和用户状态
	if (pathname === lastCheckedPath && currentUser === lastUserState && !isNavigating) {
		return true;
	}

	const config = getRouteConfig(pathname);
	if (!config) {
		// 没有配置的路由默认允许访问
		lastCheckedPath = pathname;
		lastUserState = currentUser;
		return true;
	}

	// 检查认证要求
	if (config.requiresAuth && !currentUser) {
		console.log(`[hooks.client.ts] 未登录用户尝试访问受保护路由: ${pathname}`);
		navigateToLogin(pathname);
		return false;
	}

	// 检查管理员权限
	if (config.requiresAdmin && (!currentUser || currentUser.role !== 'admin')) {
		console.log(`[hooks.client.ts] 权限不足，尝试访问管理员路由: ${pathname}`);
		goto('/unauthorized');
		return false;
	}

	// 检查是否需要重定向已登录用户
	if (config.redirectIfAuthenticated && currentUser) {
		console.log(`[hooks.client.ts] 已登录用户访问公共路由，重定向: ${pathname}`);
		const urlParams = new URLSearchParams(window.location.search);
		const redirectTo = urlParams.get('redirect') || '/dashboard';
		goto(redirectTo);
		return false;
	}

	// 更新缓存
	lastCheckedPath = pathname;
	lastUserState = currentUser;
	return true;
}

/**
 * 导航到登录页面
 */
function navigateToLogin(originalPath: string): void {
	isNavigating = true;
	goto(`/login?redirect=${encodeURIComponent(originalPath)}`).finally(() => {
		isNavigating = false;
	});
}

/**
 * 防抖函数
 */
function debounce<T extends (...args: any[]) => void>(func: T, delay: number): T {
	let timeoutId: NodeJS.Timeout;
	return ((...args: any[]) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => func(...args), delay);
	}) as T;
}

/**
 * 节流函数
 */
function throttle<T extends (...args: any[]) => void>(func: T, delay: number): T {
	let lastCall = 0;
	return ((...args: any[]) => {
		const now = Date.now();
		if (now - lastCall >= delay) {
			lastCall = now;
			func(...args);
		}
	}) as T;
}

/**
 * 优化的客户端路由守卫
 */
function setupClientRouteGuard() {
	if (!browser) return;

	// 防抖的 popstate 处理
	const debouncedPopState = debounce(() => {
		const currentUser = get(user);
		const pathname = window.location.pathname;

		console.log(
			`[hooks.client.ts] 浏览器导航: ${pathname}, 用户: ${currentUser?.email || '未登录'}`
		);
		checkRouteAccess(pathname, currentUser);
	}, 100);

	// 节流的链接点击处理
	const throttledLinkClick = throttle((e: Event) => {
		const target = e.target as HTMLElement;
		const link = target.closest('a[href]') as HTMLAnchorElement;

		if (!link?.href) return;

		// 跳过外部链接和特殊协议
		if (
			link.href.startsWith('http') ||
			link.href.startsWith('mailto:') ||
			link.href.startsWith('tel:') ||
			link.target === '_blank'
		) {
			return;
		}

		const currentUser = get(user);
		const pathname = new URL(link.href).pathname;

		console.log(`[hooks.client.ts] 链接点击: ${pathname}, 用户: ${currentUser?.email || '未登录'}`);

		if (!checkRouteAccess(pathname, currentUser)) {
			e.preventDefault();
		}
	}, 50);

	// 监听事件
	window.addEventListener('popstate', debouncedPopState);
	document.addEventListener('click', throttledLinkClick, true); // 使用捕获阶段

	return () => {
		window.removeEventListener('popstate', debouncedPopState);
		document.removeEventListener('click', throttledLinkClick, true);
	};
}

/**
 * 增强的错误处理
 */
export const handleError: HandleClientError = ({ error, event }) => {
	console.error('[hooks.client.ts] 客户端错误:', error);
	console.error('[hooks.client.ts] 错误事件:', event);

	// 错误分类和处理
	const errorHandlers = {
		auth: () => {
			console.log('[hooks.client.ts] 检测到认证错误，清除用户状态');
			clearAuth();
			goto('/login');
		},
		permission: () => {
			console.log('[hooks.client.ts] 检测到权限错误');
			goto('/unauthorized');
		},
		network: () => {
			console.log('[hooks.client.ts] 检测到网络错误');
			// 可以显示网络错误提示
		},
		server: () => {
			console.log('[hooks.client.ts] 检测到服务器错误');
			goto('/error');
		}
	};

	if (error instanceof Error) {
		const message = error.message.toLowerCase();

		if (message.includes('401') || message.includes('unauthorized')) {
			errorHandlers.auth();
		} else if (message.includes('403') || message.includes('forbidden')) {
			errorHandlers.permission();
		} else if (message.includes('network') || message.includes('fetch')) {
			errorHandlers.network();
		} else if (message.includes('500') || message.includes('server')) {
			errorHandlers.server();
		}
	}

	// 返回用户友好的错误信息
	return {
		message: '发生了一个错误，请稍后重试',
		code: error instanceof Error ? error.message : 'unknown',
		stack: error instanceof Error ? error.stack : undefined
	};
};

/**
 * 多标签页同步
 */
function setupMultiTabSync() {
	if (!browser) return;

	const handleStorageChange = (e: StorageEvent) => {
		if (e.key === 'auth-state') {
			console.log('[hooks.client.ts] 检测到其他标签页的认证状态变化');

			// 重新检查当前路由
			const currentUser = get(user);
			const pathname = window.location.pathname;
			checkRouteAccess(pathname, currentUser);
		}
	};

	window.addEventListener('storage', handleStorageChange);
	return () => window.removeEventListener('storage', handleStorageChange);
}

/**
 * 会话检查
 */
function setupSessionCheck() {
	if (!browser) return;

	const checkSession = throttle(async () => {
		const currentUser = get(user);
		if (!currentUser) return;

		try {
			// 这里可以添加实际的会话验证 API 调用
			// const isValid = await validateSession(currentUser.id);
			// if (!isValid) {
			//     clearAuth();
			//     goto('/login');
			// }
		} catch (error) {
			console.error('[hooks.client.ts] 会话检查失败:', error);
		}
	}, 30000); // 30秒检查一次

	const handleVisibilityChange = () => {
		if (document.visibilityState === 'visible') {
			console.log('[hooks.client.ts] 页面重新可见，检查会话');
			checkSession();
		}
	};

	document.addEventListener('visibilitychange', handleVisibilityChange);
	return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
}

/**
 * 网络状态监听
 */
function setupNetworkMonitoring() {
	if (!browser) return;

	const handleOnline = () => {
		console.log('[hooks.client.ts] 网络连接恢复');
		// 可以在这里重新验证认证状态
	};

	const handleOffline = () => {
		console.log('[hooks.client.ts] 网络连接断开');
		// 可以显示离线提示
	};

	window.addEventListener('online', handleOnline);
	window.addEventListener('offline', handleOffline);

	return () => {
		window.removeEventListener('online', handleOnline);
		window.removeEventListener('offline', handleOffline);
	};
}

/**
 * 初始化客户端钩子
 */
function initClientHooks() {
	if (!browser) return;

	console.log('[hooks.client.ts] 初始化客户端钩子');

	// 设置各种监听器
	const unsubscribeRouteGuard = setupClientRouteGuard();
	const unsubscribeMultiTab = setupMultiTabSync();
	const unsubscribeSession = setupSessionCheck();
	const unsubscribeNetwork = setupNetworkMonitoring();

	// 清理函数
	return () => {
		unsubscribeRouteGuard?.();
		unsubscribeMultiTab?.();
		unsubscribeSession?.();
		unsubscribeNetwork?.();
	};
}

// 在浏览器环境中初始化
if (browser) {
	const cleanup = initClientHooks();

	// 页面卸载时清理
	window.addEventListener('beforeunload', () => {
		cleanup?.();
	});
}

// 导出工具函数
export { checkRouteAccess, getRouteConfig };
