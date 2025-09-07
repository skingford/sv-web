# sv-web

## commitlint

### 验证规则

- 标题长度：10-100字符
- 类型必须小写且不能为空
- 主题不能为空且不能以句号结尾
- 正文和脚注前必须有空行
- 正文和脚注最大行长度100字符

```bash
# 功能新增
git commit -m "feat(auth): 添加第三方登录支持"

# Bug修复
git commit -m "fix(api): 修复分页参数解析错误"

# 文档更新
git commit -m "docs(readme): 更新安装指南和示例代码"

# 代码重构
git commit -m "refactor(core): 重构用户服务模块"

# 样式调整
git commit -m "style(ui): 调整按钮样式和间距"

git commit -m "perf(vite): 封装rem插件"

git commit -m "feat(core): 实现用户权限管理系统

- 添加角色管理功能
- 实现权限验证中间件
- 完善单元测试覆盖

Closes #123, #456"
```
