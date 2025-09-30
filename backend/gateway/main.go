package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"homework-tutor/gateway/internal/config"
	"homework-tutor/gateway/internal/handlers"
	"homework-tutor/gateway/internal/middleware"
	"homework-tutor/gateway/internal/proxy"
)

func main() {
	// 加载环境变量
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// 初始化配置
	cfg := config.Load()

	// 设置Gin模式
	if cfg.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	// 创建路由
	router := gin.Default()

	// 中间件
	router.Use(middleware.CORS())
	router.Use(middleware.Logger())
	router.Use(middleware.Recovery())
	router.Use(middleware.RateLimit())

	// 健康检查
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "service": "api-gateway"})
	})

	// 静态文件服务
	router.Static("/uploads", "./uploads")

	// 初始化代理
	proxyManager := proxy.NewProxyManager(cfg)

	// API路由组
	api := router.Group("/api")
	{
		// 用户服务代理
		api.Any("/users/*path", proxyManager.ProxyToUserService)
		api.Any("/user/*path", proxyManager.ProxyToUserService)

		// 作业服务代理
		api.Any("/homework/*path", proxyManager.ProxyToHomeworkService)

		// 错题本服务代理
		api.Any("/mistake-book/*path", proxyManager.ProxyToMistakeService)

		// 聊天服务代理
		api.Any("/chat/*path", proxyManager.ProxyToChatService)

		// 文件上传
		api.POST("/upload/image", handlers.UploadImage)
		api.POST("/upload/audio", handlers.UploadAudio)
	}

	// 启动服务器
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("API Gateway starting on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
