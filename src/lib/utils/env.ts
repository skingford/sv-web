import type { Environment, LogLevel, ParsedEnvironmentVariables } from '@types';

/**
 * 环境变量工具类
 * 提供类型安全的环境变量访问和转换功能
 */
class EnvironmentManager {
	private _parsed: ParsedEnvironmentVariables | null = null;

	/**
	 * 获取原始环境变量值
	 */
	private getRaw(key: string, defaultValue?: string): string | undefined {
		return import.meta.env[key] || defaultValue;
	}

	/**
	 * 获取字符串类型环境变量
	 */
	getString(key: string, defaultValue?: string): string {
		const value = this.getRaw(key, defaultValue);
		if (value === undefined) {
			throw new Error(`Environment variable ${key} is required but not defined`);
		}
		return value;
	}

	/**
	 * 获取数字类型环境变量
	 */
	getNumber(key: string, defaultValue?: number): number {
		const value = this.getRaw(key);
		if (value === undefined) {
			if (defaultValue !== undefined) return defaultValue;
			throw new Error(`Environment variable ${key} is required but not defined`);
		}

		const parsed = Number(value);
		if (isNaN(parsed)) {
			throw new Error(`Environment variable ${key} must be a valid number, got: ${value}`);
		}
		return parsed;
	}

	/**
	 * 获取布尔类型环境变量
	 */
	getBoolean(key: string, defaultValue?: boolean): boolean {
		const value = this.getRaw(key);
		if (value === undefined) {
			if (defaultValue !== undefined) return defaultValue;
			throw new Error(`Environment variable ${key} is required but not defined`);
		}

		const lowerValue = value.toLowerCase();
		if (['true', '1', 'yes', 'on'].includes(lowerValue)) return true;
		if (['false', '0', 'no', 'off'].includes(lowerValue)) return false;

		throw new Error(`Environment variable ${key} must be a boolean value, got: ${value}`);
	}

	/**
	 * 获取可选字符串类型环境变量
	 */
	getOptionalString(key: string, defaultValue?: string): string | undefined {
		return this.getRaw(key, defaultValue);
	}

	/**
	 * 获取可选数字类型环境变量
	 */
	getOptionalNumber(key: string, defaultValue?: number): number | undefined {
		const value = this.getRaw(key);
		if (value === undefined) return defaultValue;

		const parsed = Number(value);
		if (isNaN(parsed)) {
			console.warn(
				`Environment variable ${key} is not a valid number: ${value}, using default: ${defaultValue}`
			);
			return defaultValue;
		}
		return parsed;
	}

	/**
	 * 获取可选布尔类型环境变量
	 */
	getOptionalBoolean(key: string, defaultValue?: boolean): boolean {
		const value = this.getRaw(key);
		if (value === undefined) return defaultValue || false;

		const lowerValue = value.toLowerCase();
		if (['true', '1', 'yes', 'on'].includes(lowerValue)) return true;
		if (['false', '0', 'no', 'off'].includes(lowerValue)) return false;

		console.warn(
			`Environment variable ${key} is not a valid boolean: ${value}, using default: ${defaultValue || false}`
		);
		return defaultValue || false;
	}

	/**
	 * 获取环境类型
	 */
	getEnvironment(): Environment {
		const mode = import.meta.env.MODE;
		if (mode === 'production') return 'production';
		if (mode === 'test') return 'test';
		return 'development';
	}

	/**
	 * 获取日志级别
	 */
	getLogLevel(): LogLevel {
		const level = this.getOptionalString('VITE_LOG_LEVEL', 'info')?.toLowerCase();
		if (['debug', 'info', 'warn', 'error'].includes(level as string)) {
			return level as LogLevel;
		}
		return 'info';
	}

	/**
	 * 解析所有环境变量
	 */
	private parseAll(): ParsedEnvironmentVariables {
		if (this._parsed) return this._parsed;

		const environment = this.getEnvironment();
		const isDev = environment === 'development';
		const isProd = environment === 'production';

		this._parsed = {
			// 应用基础信息
			appName: this.getString('VITE_APP_NAME'),
			appVersion: this.getString('VITE_APP_VERSION'),
			appDescription: this.getString('VITE_APP_DESCRIPTION'),

			// API配置
			apiBaseUrl: this.getString('VITE_API_BASE_URL'),
			apiTimeout: this.getNumber('VITE_API_TIMEOUT'),
			apiKey: this.getOptionalString('VITE_API_KEY'),
			secretKey: this.getOptionalString('VITE_SECRET_KEY'),

			// 功能开关
			enableMock: this.getBoolean('VITE_ENABLE_MOCK', false),
			enableDebug: this.getBoolean('VITE_ENABLE_DEBUG', isDev),
			enableAnalytics: this.getBoolean('VITE_ENABLE_ANALYTICS', isProd),
			enableVConsole: this.getOptionalBoolean('VITE_ENABLE_VCONSOLE', isDev),
			showDevTools: this.getOptionalBoolean('VITE_SHOW_DEV_TOOLS', isDev),
			enablePWA: this.getOptionalBoolean('VITE_ENABLE_PWA', isProd),
			enablePreload: this.getOptionalBoolean('VITE_ENABLE_PRELOAD', isProd),

			// 数据库配置
			dbHost: this.getOptionalString('VITE_DB_HOST'),
			dbPort: this.getOptionalNumber('VITE_DB_PORT'),
			dbUrl: this.getOptionalString('VITE_DB_URL'),

			// 第三方服务
			sentryDsn: this.getOptionalString('VITE_SENTRY_DSN'),
			gaTrackingId: this.getOptionalString('VITE_GA_TRACKING_ID'),
			stripePublishableKey: this.getOptionalString('VITE_STRIPE_PUBLISHABLE_KEY'),
			googleMapsApiKey: this.getOptionalString('VITE_GOOGLE_MAPS_API_KEY'),

			// 开发者设置
			developerMode: this.getOptionalBoolean('VITE_DEVELOPER_MODE', isDev),
			bypassAuth: this.getOptionalBoolean('VITE_BYPASS_AUTH', false),
			detailedLogs: this.getOptionalBoolean('VITE_DETAILED_LOGS', isDev),
			performanceMonitor: this.getOptionalBoolean('VITE_PERFORMANCE_MONITOR', isDev),

			// 服务端口
			localApiPort: this.getOptionalNumber('VITE_LOCAL_API_PORT'),
			websocketPort: this.getOptionalNumber('VITE_WEBSOCKET_PORT'),

			// 调试信息
			logLevel: this.getLogLevel(),

			// 系统环境
			environment,
			isDev,
			isProd,
			mode: import.meta.env.MODE
		};

		return this._parsed;
	}

	/**
	 * 获取解析后的环境变量
	 */
	get config(): ParsedEnvironmentVariables {
		return this.parseAll();
	}

	/**
	 * 验证必需的环境变量
	 */
	validate(): void {
		const requiredVars = [
			'VITE_APP_NAME',
			'VITE_APP_VERSION',
			'VITE_APP_DESCRIPTION',
			'VITE_API_BASE_URL',
			'VITE_API_TIMEOUT'
		];

		const missing = requiredVars.filter((key) => !this.getRaw(key));

		if (missing.length > 0) {
			throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
		}
	}

	/**
	 * 打印环境配置（隐藏敏感信息）
	 */
	printConfig(): void {
		const config = this.config;
		const sensitiveKeys = [
			'apiKey',
			'secretKey',
			'sentryDsn',
			'stripePublishableKey',
			'googleMapsApiKey'
		];

		const safeConfig = Object.entries(config).reduce(
			(acc, [key, value]) => {
				if (sensitiveKeys.includes(key) && value) {
					acc[key] = value.toString().replace(/.(?=.{4})/g, '*');
				} else {
					acc[key] = value;
				}
				return acc;
			},
			{} as Record<string, any>
		);

		console.group(`🔧 Environment Configuration (${config.environment})`);
		Object.entries(safeConfig).forEach(([key, value]) => {
			console.log(`${key}:`, value);
		});
		console.groupEnd();
	}
}

// 创建单例实例
const env = new EnvironmentManager();

// 在开发环境下验证配置
if (import.meta.env.DEV) {
	try {
		env.validate();
		if (env.config.enableDebug) {
			env.printConfig();
		}
	} catch (error) {
		console.error('❌ Environment validation failed:', error);
	}
}

// 导出配置和工具函数
export { env };
export const config = env.config;

// 便捷导出
export const {
	appName,
	appVersion,
	appDescription,
	apiBaseUrl,
	apiTimeout,
	enableMock,
	enableDebug,
	enableAnalytics,
	environment,
	isDev,
	isProd,
	mode
} = env.config;
