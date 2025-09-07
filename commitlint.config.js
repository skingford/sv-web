/**
 * Commitlint 配置文件
 * 基于 Conventional Commits 规范
 * @see https://conventionalcommits.org/
 * @see https://commitlint.js.org/
 */
export default {
	// 继承常规提交规范
	extends: ['@commitlint/config-conventional'],

	// 自定义规则
	rules: {
		// 标题最大长度为100字符
		'header-max-length': [2, 'always', 100],

		// 标题最小长度为10字符
		'header-min-length': [2, 'always', 10],

		// 类型必须是以下之一
		'type-enum': [
			2,
			'always',
			[
				'feat', // 新功能
				'fix', // 修复bug
				'docs', // 文档更新
				'style', // 代码格式化（不影响代码运行的变动）
				'refactor', // 重构（既不是新增功能，也不是修改bug的代码变动）
				'perf', // 性能优化
				'test', // 增加测试
				'chore', // 构建过程或辅助工具的变动
				'ci', // CI/CD相关
				'build', // 构建系统或外部依赖的变动
				'revert', // 回退
				'wip', // 进行中的工作
				'workflow', // 工作流相关
				'types', // 类型定义文件的变动
				'release' // 发布版本
			]
		],

		// 类型必须小写
		'type-case': [2, 'always', 'lower-case'],

		// 类型不能为空
		'type-empty': [2, 'never'],

		// 主题不能为空
		'subject-empty': [2, 'never'],

		// 主题不能以句号结尾
		'subject-full-stop': [2, 'never', '.'],

		// 主题格式（首字母小写）
		'subject-case': [2, 'always', 'lower-case'],

		// 正文前必须有空行
		'body-leading-blank': [2, 'always'],

		// 脚注前必须有空行
		'footer-leading-blank': [2, 'always'],

		// 正文最大行长度
		'body-max-line-length': [2, 'always', 100],

		// 脚注最大行长度
		'footer-max-line-length': [2, 'always', 100]
	}
};
