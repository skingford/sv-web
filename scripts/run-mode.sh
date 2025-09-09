#!/bin/bash

# 模式切换脚本
# 使用方法: ./scripts/run-mode.sh [command] [mode]
# 示例: ./scripts/run-mode.sh dev production

set -e

COMMAND=${1:-dev}
MODE=${2:-development}
PORT=${3:-5173}

echo "🚀 正在启动 $COMMAND 模式: $MODE"
echo "📡 端口: $PORT"

case $COMMAND in
  "dev")
    echo "🔧 开发服务器启动中..."
    npm run dev:$MODE -- --port $PORT
    ;;
  "build")
    echo "📦 构建项目中..."
    npm run build:$MODE
    ;;
  "preview")
    echo "👀 预览构建结果..."
    npm run preview:$MODE -- --port $PORT
    ;;
  *)
    echo "❌ 未知命令: $COMMAND"
    echo "✅ 可用命令: dev, build, preview"
    echo "✅ 可用模式: development, production, test"
    exit 1
    ;;
esac
