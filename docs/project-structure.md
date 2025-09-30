# 项目结构说明

## 整体架构

```
智能作业辅导小程序
├── 前端层 (微信小程序)
├── API网关层
├── 微服务层
├── AI服务层
└── 存储层
```

## 详细目录结构

```
homework-tutor/
├── frontend/                          # 前端 - 微信小程序
│   └── miniprogram/
│       ├── app.json                   # 小程序配置
│       ├── app.ts                     # 小程序入口
│       ├── app.wxss                   # 全局样式
│       ├── sitemap.json               # 站点地图
│       ├── project.config.json        # 项目配置
│       ├── pages/                     # 页面目录
│       │   ├── index/                 # 首页
│       │   │   ├── index.ts
│       │   │   ├── index.wxml
│       │   │   └── index.wxss
│       │   ├── camera/                # 拍照页面
│       │   │   ├── camera.ts
│       │   │   ├── camera.wxml
│       │   │   └── camera.wxss
│       │   ├── analysis/              # 题目解析页面
│       │   │   ├── analysis.ts
│       │   │   ├── analysis.wxml
│       │   │   └── analysis.wxss
│       │   ├── chat/                  # 对话问答页面
│       │   │   ├── chat.ts
│       │   │   ├── chat.wxml
│       │   │   └── chat.wxss
│       │   ├── mistake-book/          # 错题本页面
│       │   │   ├── mistake-book.ts
│       │   │   ├── mistake-book.wxml
│       │   │   └── mistake-book.wxss
│       │   └── profile/               # 个人中心页面
│       │       ├── profile.ts
│       │       ├── profile.wxml
│       │       └── profile.wxss
│       ├── utils/                     # 工具函数
│       │   ├── request.ts             # 网络请求封装
│       │   └── storage.ts             # 本地存储封装
│       ├── services/                  # 服务层
│       └── components/                # 组件
├── backend/                           # 后端 - Go微服务
│   ├── user-service/                  # 用户服务
│   │   ├── main.go                    # 服务入口
│   │   ├── go.mod                     # Go模块文件
│   │   ├── Dockerfile                 # Docker镜像构建文件
│   │   └── internal/                  # 内部包
│   │       ├── config/                # 配置
│   │       │   └── config.go
│   │       ├── database/              # 数据库
│   │       │   └── database.go
│   │       ├── models/                # 数据模型
│   │       │   └── user.go
│   │       ├── handlers/              # 处理器
│   │       ├── services/              # 业务逻辑
│   │       ├── repository/            # 数据访问层
│   │       └── middleware/            # 中间件
│   │           ├── auth.go            # 认证中间件
│   │           ├── cors.go            # 跨域中间件
│   │           ├── logger.go          # 日志中间件
│   │           └── recovery.go        # 恢复中间件
│   ├── homework-service/              # 作业服务
│   │   ├── main.go
│   │   ├── go.mod
│   │   ├── Dockerfile
│   │   └── internal/
│   │       ├── config/
│   │       ├── database/
│   │       ├── models/
│   │       ├── handlers/
│   │       ├── services/
│   │       ├── repository/
│   │       └── middleware/
│   ├── mistake-service/               # 错题本服务
│   │   ├── main.go
│   │   ├── go.mod
│   │   ├── Dockerfile
│   │   └── internal/
│   ├── chat-service/                  # 聊天服务
│   │   ├── main.go
│   │   ├── go.mod
│   │   ├── Dockerfile
│   │   └── internal/
│   └── gateway/                       # API网关
│       ├── main.go
│       ├── go.mod
│       ├── Dockerfile
│       └── internal/
│           ├── config/
│           ├── handlers/
│           ├── middleware/
│           └── proxy/
├── ai-services/                       # AI服务
│   ├── ocr/                          # OCR文字识别服务
│   ├── llm/                          # 大模型解析服务
│   └── tts/                          # 语音合成服务
├── infrastructure/                    # 基础设施
│   ├── docker/                       # Docker配置
│   │   ├── docker-compose.yml        # 服务编排
│   │   └── Dockerfile.gateway        # 网关Dockerfile
│   ├── k8s/                          # Kubernetes配置
│   └── monitoring/                   # 监控配置
├── docs/                             # 文档
│   ├── api/                          # API文档
│   ├── deployment/                   # 部署文档
│   └── project-structure.md          # 项目结构说明
├── scripts/                          # 脚本
│   └── start-dev.sh                  # 开发环境启动脚本
├── architecture.md                   # 架构设计文档
├── prototype.md                      # 原型设计文档
├── README.md                         # 项目说明
└── env.example                       # 环境变量示例
```

## 服务端口分配

| 服务 | 端口 | 说明 |
|------|------|------|
| API网关 | 8080 | 统一入口，路由转发 |
| 用户服务 | 8080 | 用户管理、认证 |
| 作业服务 | 8081 | 题目解析、OCR |
| 错题本服务 | 8082 | 错题管理 |
| 聊天服务 | 8083 | 对话问答 |
| OCR服务 | 8084 | 文字识别 |
| LLM服务 | 8085 | 大模型解析 |
| TTS服务 | 8086 | 语音合成 |
| MySQL | 3306 | 主数据库 |
| PostgreSQL | 5432 | 生产数据库 |
| Redis | 6379 | 缓存 |
| MinIO | 9000/9001 | 对象存储 |

## 数据流

1. **用户上传题目** → API网关 → 作业服务 → OCR服务 → LLM服务 → 返回解析结果
2. **用户对话** → API网关 → 聊天服务 → LLM服务 → TTS服务 → 返回语音回复
3. **错题管理** → API网关 → 错题本服务 → 数据库 → 返回错题列表
4. **用户认证** → API网关 → 用户服务 → 数据库/Redis → 返回JWT Token

## 技术栈

### 前端
- 微信小程序
- TypeScript
- 原生小程序框架

### 后端
- Go 1.21+
- Gin Web框架
- GORM ORM
- JWT认证
- Redis缓存

### 数据库
- MySQL 8.0+ (开发环境)
- PostgreSQL 15+ (生产环境)
- Redis 7+ (缓存)

### 基础设施
- Docker & Docker Compose
- Kubernetes (生产环境)
- Nginx (反向代理)
- MinIO (对象存储)

### AI服务
- OCR文字识别
- 大语言模型
- 语音合成/识别
