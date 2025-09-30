# 智能作业辅导小程序 - 技术文档

## 1. 项目概览
智能作业辅导小程序基于 **OCR识别 + AI解析**，支持学生拍照上传作业题目，自动生成解题步骤、知识点讲解和语音讲解，同时管理错题本和学习记录。  

- **前端**：微信小程序 (TypeScript)  
- **后端**：Go 微服务  
- **AI服务**：OCR服务 + 大模型解析 + TTS/ASR  
- **存储**：MySQL/PostgreSQL + Redis + 对象存储(COS/OSS/MinIO)  

---

## 2. 前端页面原型设计

### 2.1 首页
**功能**：快速进入拍照识题和错题本  
**布局**：
+-------------------------+
| LOGO 智能作业辅导 |
+-------------------------+
| |
| [ 拍照搜题 ] |
| |
| ( 上传题目 ) |
| |
+-------------------------+
| 错题本 | 学习报告 | 我的 |
+-------------------------+


### 2.2 拍照/上传页
**功能**：获取题目信息  
**布局**：
+-------------------------+
| ← 返回 拍照搜题 |
+-------------------------+
| ┌───────────┐ |
| │ 取景框 │ |
| │ │ |
| └───────────┘ |
+-------------------------+
| [ 拍照 ] (相册上传) |
+-------------------------+


### 2.3 题目解析页
**功能**：展示OCR识别结果与AI解析  
**布局**：
+-------------------------+
| [题目缩略图] OCR文本 |
+-------------------------+

AI解析结果：
答案: xxxx
步骤: 1,2,3
知识点: ...
+-------------------------+
换讲法
+-------------------------+


### 2.4 对话式问答页
+-------------------------+
| 题目简要：xxx... |
+-------------------------+
| 学生：这题怎么解？ |
| AI：先看已知条件 |
| 学生：能换一种方法吗？ |
| AI：好的，方法二 |
+-------------------------+
| 🎤 [ 输入框... ] 发送 |
+-------------------------+


### 2.5 错题本页
+-------------------------+
| 数学 | 英语 | 物理 ... |
+-------------------------+
| [题图缩略] 题目内容... |
| [查看解析] |
+-------------------------+


### 2.6 个人中心页
+-------------------------+
| [头像] 昵称（微信授权）|
+-------------------------+
| 我的学习时长 |
| 学习进度报告 |
| 反馈与建议 |
| 关于我们 |
+-------------------------+
| [退出登录] |
+-------------------------+


---

## 3. 系统架构

```mermaid
flowchart TD
    subgraph Frontend[前端层 - 微信小程序 (TypeScript)]
        A1[拍照/上传题目]
        A2[题目解析展示]
        A3[对话问答界面]
        A4[错题本管理]
        A5[个人中心]
    end

    subgraph Gateway[API 网关 & 鉴权]
        GW[API Gateway / Nginx / Kong]
    end

    subgraph Backend[后端层 - Go 微服务]
        B1[用户服务]
        B2[作业服务]
        B3[错题本服务]
        B4[对话服务]
    end

    subgraph AI[AI 服务层]
        C1[OCR 模块]
        C2[大模型解析]
        C3[语音服务 TTS/ASR]
    end

    subgraph Storage[存储层]
        D1[(MySQL/PostgreSQL)]
        D2[(Redis 缓存)]
        D3[(对象存储 COS/OSS/MinIO)]
    end

    subgraph Infra[基础设施]
        E1[日志监控 (Prometheus/Grafana)]
        E2[CI/CD (GitHub Actions/GitLab CI)]
        E3[Kubernetes/Docker 部署]
    end

    A1 --> GW
    A2 --> GW
    A3 --> GW
    A4 --> GW
    A5 --> GW

    GW --> B1
    GW --> B2
    GW --> B3
    GW --> B4

    B2 --> C1
    B2 --> C2
    B4 --> C2
    B4 --> C3

    B1 --> D1
    B2 --> D1
    B3 --> D1
    B4 --> D1

    B2 --> D3
    B3 --> D2
    B4 --> D2
4. 数据流（作业解析流程）
```mermaid
sequenceDiagram
    participant U as 学生(小程序端)
    participant GW as API 网关
    participant S as 作业服务(Go)
    participant OCR as OCR 服务
    participant AI as 大模型服务
    participant DB as 数据库(MySQL/Redis)
    participant OS as 对象存储(COS/OSS)

    U->>GW: 上传题目图片
    GW->>S: 转发请求(作业服务)
    S->>OS: 存储原始题目图片
    S->>OCR: 调用OCR服务进行文字识别
    OCR-->>S: 返回OCR识别结果
    S->>AI: 调用大模型服务解析题目
    AI-->>S: 返回答案/步骤/讲解
    S->>DB: 保存解析结果
    S-->>GW: 返回解析结果
    GW-->>U: 显示答案/解题步骤/知识点
5. 错题本交互流程
```mermaid
sequenceDiagram
    participant U as 学生(小程序端)
    participant GW as API 网关
    participant MistakeS as 错题本服务(Go)
    participant DB as 数据库(MySQL/Redis)

    U->>GW: 点击“加入错题本”
    GW->>MistakeS: 请求新增错题记录(user_id, problem_id)
    MistakeS->>DB: 保存错题信息
    DB-->>MistakeS: 确认保存成功
    MistakeS-->>GW: 返回操作结果
    GW-->>U: 显示“加入成功”

    %% 复习调用流程
    U->>GW: 打开“错题本”
    GW->>MistakeS: 请求获取用户错题列表
    MistakeS->>DB: 查询错题数据
    DB-->>MistakeS: 返回错题列表
    MistakeS-->>GW: 返回错题列表
    GW-->>U: 显示错题列表与解析
6. 技术选型
层级	技术/框架
前端	微信小程序、TypeScript、TDesign/Vant、MobX/Redux
后端	Go (Gin/Echo)、GORM、Redis
AI 服务	OCR (百度/腾讯/PaddleOCR)、大模型 API、TTS/ASR
存储	MySQL/PostgreSQL、Redis、COS/OSS/MinIO
基础设施	API Gateway (Kong/Nginx)、Prometheus/Grafana、Docker/Kubernetes、CI/CD

7. 说明
前端页面原型：拍照上传 → OCR识别 → AI解析 → 对话问答 → 错题本管理 → 个人中心

系统架构图：展示前端、后端、AI服务、存储层及基础设施关系

数据流图：完整作业解析流程

错题本流程：加入错题与复习闭环流程

可扩展性：增加知识图谱、智能复习提醒、语音对话交互