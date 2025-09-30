# 智能作业辅导小程序

基于OCR识别 + AI解析的智能作业辅导小程序，支持学生拍照上传作业题目，自动生成解题步骤、知识点讲解和语音讲解，同时管理错题本和学习记录。

## 项目架构

### 前端
- **微信小程序** (TypeScript)
- 页面：首页、拍照/上传、题目解析、对话问答、错题本、个人中心

### 后端
- **Go 微服务架构**
  - 用户服务 (user-service)
  - 作业服务 (homework-service) 
  - 错题本服务 (mistake-service)
  - 聊天服务 (chat-service)
  - API网关 (gateway)

### AI服务
- OCR服务 (文字识别)
- 大模型解析 (题目分析)
- TTS/ASR (语音合成/识别)

### 存储
- MySQL/PostgreSQL (主数据库)
- Redis (缓存)
- MinIO/COS/OSS (对象存储)

## 快速开始

### 环境要求
- Go 1.21+
- Node.js 16+
- Docker & Docker Compose
- MySQL 8.0+ 或 PostgreSQL 15+
- Redis 7+

### 1. 克隆项目
```bash
git clone <repository-url>
cd homework-tutor
```

### 2. 配置环境变量
```bash
cp env.example .env
# 编辑 .env 文件，配置数据库、Redis等连接信息
```

### 3. 启动基础设施
```bash
cd infrastructure/docker
docker-compose up -d mysql redis minio
```

### 4. 启动后端服务
```bash
# 启动用户服务
cd backend/user-service
go mod tidy
go run main.go

# 启动作业服务
cd backend/homework-service
go mod tidy
go run main.go

# 启动错题本服务
cd backend/mistake-service
go mod tidy
go run main.go

# 启动聊天服务
cd backend/chat-service
go mod tidy
go run main.go

# 启动API网关
cd backend/gateway
go mod tidy
go run main.go
```

### 5. 配置微信小程序
1. 在微信开发者工具中导入 `frontend/miniprogram` 目录
2. 修改 `app.ts` 中的 `baseUrl` 为你的API网关地址
3. 配置微信小程序的AppID和AppSecret

## 使用Docker部署

### 开发环境
```bash
cd infrastructure/docker
docker-compose up -d
```

### 生产环境
```bash
cd infrastructure/docker
docker-compose --profile production up -d
```

## API文档

### 用户服务
- `POST /api/users/register` - 用户注册
- `POST /api/users/login` - 用户登录
- `GET /api/users/profile` - 获取用户信息
- `PUT /api/users/profile` - 更新用户信息
- `GET /api/users/stats` - 获取用户统计

### 作业服务
- `POST /api/homework/upload` - 上传题目图片
- `GET /api/homework/problems/:id` - 获取题目详情
- `PUT /api/homework/problems/:id/ocr` - 更新OCR文本
- `POST /api/homework/problems/:id/regenerate` - 重新生成解析

### 错题本服务
- `GET /api/mistake-book/problems` - 获取错题列表
- `POST /api/mistake-book/problems` - 添加错题
- `DELETE /api/mistake-book/problems/:id` - 删除错题
- `GET /api/mistake-book/stats` - 获取错题统计

### 聊天服务
- `POST /api/chat/message` - 发送文本消息
- `POST /api/chat/audio` - 发送语音消息
- `GET /api/chat/history/:problemId` - 获取聊天历史

## 项目结构

```
homework-tutor/
├── frontend/                 # 微信小程序前端
│   └── miniprogram/
│       ├── pages/           # 页面
│       ├── utils/           # 工具函数
│       ├── services/        # 服务层
│       └── components/      # 组件
├── backend/                 # Go后端服务
│   ├── user-service/        # 用户服务
│   ├── homework-service/    # 作业服务
│   ├── mistake-service/     # 错题本服务
│   ├── chat-service/        # 聊天服务
│   └── gateway/             # API网关
├── ai-services/             # AI服务
│   ├── ocr/                 # OCR服务
│   ├── llm/                 # 大模型服务
│   └── tts/                 # 语音服务
├── infrastructure/          # 基础设施
│   ├── docker/              # Docker配置
│   ├── k8s/                 # Kubernetes配置
│   └── monitoring/          # 监控配置
└── docs/                    # 文档
    ├── api/                 # API文档
    └── deployment/          # 部署文档
```

## 开发指南

### 添加新功能
1. 在对应的微服务中添加新的API端点
2. 更新API网关的路由配置
3. 在前端添加对应的页面和功能
4. 更新API文档

### 数据库迁移
```bash
# 自动迁移（开发环境）
go run main.go

# 手动迁移（生产环境）
# 使用数据库迁移工具如 golang-migrate
```

### 测试
```bash
# 运行单元测试
go test ./...

# 运行集成测试
go test -tags=integration ./...
```

## 部署

### 开发环境
使用Docker Compose一键启动所有服务。

### 生产环境
1. 使用Kubernetes部署
2. 配置负载均衡和自动扩缩容
3. 设置监控和日志收集
4. 配置SSL证书和域名

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

如有问题或建议，请通过以下方式联系：
- 提交 Issue
- 发送邮件至 [your-email@example.com]

## 更新日志

### v1.0.0 (2024-01-01)
- 初始版本发布
- 支持拍照搜题功能
- 支持错题本管理
- 支持对话式问答
- 支持语音讲解
