/**
 * 环境变量类型定义
 * 定义所有可用的环境变量及其类型
 */

// 环境类型
export type Environment = 'development' | 'production' | 'test';

// 日志级别类型
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// 环境变量接口
export interface EnvironmentVariables {
	// 应用基础信息
	VITE_APP_NAME: string;
	VITE_APP_VERSION: string;
	VITE_APP_DESCRIPTION: string;

	// API配置
	VITE_API_BASE_URL: string;
	VITE_API_TIMEOUT: string;
	VITE_API_KEY?: string;
	VITE_SECRET_KEY?: string;

	// 功能开关
	VITE_ENABLE_MOCK: string;
	VITE_ENABLE_DEBUG: string;
	VITE_ENABLE_ANALYTICS: string;
	VITE_ENABLE_VCONSOLE?: string;
	VITE_SHOW_DEV_TOOLS?: string;
	VITE_ENABLE_PWA?: string;
	VITE_ENABLE_PRELOAD?: string;

	// 数据库配置
	VITE_DB_HOST?: string;
	VITE_DB_PORT?: string;
	VITE_DB_URL?: string;

	// 第三方服务
	VITE_SENTRY_DSN?: string;
	VITE_GA_TRACKING_ID?: string;
	VITE_STRIPE_PUBLISHABLE_KEY?: string;
	VITE_GOOGLE_MAPS_API_KEY?: string;

	// 开发者设置
	VITE_DEVELOPER_MODE?: string;
	VITE_BYPASS_AUTH?: string;
	VITE_DETAILED_LOGS?: string;
	VITE_PERFORMANCE_MONITOR?: string;

	// 服务端口
	VITE_LOCAL_API_PORT?: string;
	VITE_WEBSOCKET_PORT?: string;

	// 调试信息
	VITE_LOG_LEVEL?: string;
}

// 解析后的环境变量类型（转换为实际类型）
export interface ParsedEnvironmentVariables {
	mode: string;
	// 应用基础信息
	appName: string;
	appVersion: string;
	appDescription: string;

	// API配置
	apiBaseUrl: string;
	apiTimeout: number;
	apiKey?: string;
	secretKey?: string;

	// 功能开关
	enableMock: boolean;
	enableDebug: boolean;
	enableAnalytics: boolean;
	enableVConsole: boolean;
	showDevTools: boolean;
	enablePWA: boolean;
	enablePreload: boolean;

	// 数据库配置
	dbHost?: string;
	dbPort?: number;
	dbUrl?: string;

	// 第三方服务
	sentryDsn?: string;
	gaTrackingId?: string;
	stripePublishableKey?: string;
	googleMapsApiKey?: string;

	// 开发者设置
	developerMode: boolean;
	bypassAuth: boolean;
	detailedLogs: boolean;
	performanceMonitor: boolean;

	// 服务端口
	localApiPort?: number;
	websocketPort?: number;

	// 调试信息
	logLevel: LogLevel;

	// 系统环境
	environment: Environment;
	isDev: boolean;
	isProd: boolean;
}

// 全局类型声明
declare global {
	interface ImportMetaEnv extends EnvironmentVariables {
		// MODE, DEV, PROD, SSR are already declared by Vite
	}

	interface ImportMeta {
		readonly env: ImportMetaEnv;
	}
}

export {};
