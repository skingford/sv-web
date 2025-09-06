# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## hash

### 使用场景

- Hash 路由特别适用于：
- 无法控制 Web 服务器配置的部署环境
- 需要将应用部署到静态文件服务器
- 希望避免服务器端路由配置的复杂性

### 注意事项

- 确保应用中的链接以 #/ 开头
- Hash 路由模式下无法使用 SSR 功能
- 搜索引擎优化（SEO）可能受到影响