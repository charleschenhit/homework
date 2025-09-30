#!/bin/bash

# 智能作业辅导小程序开发环境启动脚本

echo "🚀 启动智能作业辅导小程序开发环境..."

# 检查Docker是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker未运行，请先启动Docker"
    exit 1
fi

# 检查Docker Compose是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose未安装"
    exit 1
fi

# 进入Docker目录
cd infrastructure/docker

# 启动基础设施服务
echo "📦 启动基础设施服务 (MySQL, Redis, MinIO)..."
docker-compose up -d mysql redis minio

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 10

# 检查服务状态
echo "🔍 检查服务状态..."
docker-compose ps

echo "✅ 基础设施服务启动完成！"
echo ""
echo "📋 服务访问地址："
echo "  - MySQL: localhost:3306"
echo "  - Redis: localhost:6379"
echo "  - MinIO: http://localhost:9000 (admin: minioadmin/minioadmin123)"
echo "  - MinIO Console: http://localhost:9001"
echo ""
echo "🔧 下一步："
echo "  1. 配置 .env 文件"
echo "  2. 启动后端服务："
echo "     cd backend/user-service && go run main.go"
echo "     cd backend/homework-service && go run main.go"
echo "     cd backend/mistake-service && go run main.go"
echo "     cd backend/chat-service && go run main.go"
echo "     cd backend/gateway && go run main.go"
echo "  3. 在微信开发者工具中导入 frontend/miniprogram"
echo ""
echo "📚 更多信息请查看 README.md"
