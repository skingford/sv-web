import { browser } from '$app/environment';

/**
 * Auto cleanup on page load/unload (client-side only)
 * 需要传入缓存实例以避免循环导入
 */
export function browserCleanup(localCache: any, sessionCache: any) {
	if (browser) {
		let cleanupInterval: NodeJS.Timeout | null = null;

		// Cleanup expired items on page load
		window.addEventListener('load', () => {
			localCache.cleanup();
			if (sessionCache !== localCache) {
				sessionCache.cleanup();
			}
		});

		// Optional: Periodic cleanup every 5 minutes
		cleanupInterval = setInterval(
			() => {
				localCache.cleanup();
				if (sessionCache !== localCache) {
					sessionCache.cleanup();
				}
			},
			5 * 60 * 1000
		);

		// Cleanup interval on page unload to prevent memory leaks
		window.addEventListener('beforeunload', () => {
			if (cleanupInterval) {
				clearInterval(cleanupInterval);
				cleanupInterval = null;
			}
		});

		// Also cleanup when page becomes hidden (mobile browsers)
		document.addEventListener('visibilitychange', () => {
			if (document.visibilityState === 'hidden') {
				localCache.cleanup();
				if (sessionCache !== localCache) {
					sessionCache.cleanup();
				}
			}
		});
	}
}
