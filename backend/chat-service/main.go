package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"homework-tutor/chat-service/internal/config"
	"homework-tutor/chat-service/internal/database"
	"homework-tutor/chat-service/internal/handlers"
	"homework-tutor/chat-service/internal/middleware"
	"homework-tutor/chat-service/internal/repository"
	"homework-tutor/chat-service/internal/service"
)

func main() {
	// 加载环境变量
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// 初始化配置
	cfg := config.Load()

	// 初始化数据库
	db, err := database.InitDB(cfg)
	if err != nil {
		log.Fatal("Failed to initialize database:", err)
	}

	// 初始化Redis
	redisClient, err := database.InitRedis(cfg)
	if err != nil {
		log.Fatal("Failed to initialize Redis:", err)
	}

	// 初始化仓库
	chatRepo := repository.NewChatRepository(db)

	// 初始化服务
	chatService := service.NewChatService(chatRepo, redisClient)

	// 初始化处理器
	chatHandler := handlers.NewChatHandler(chatService)

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

	// 健康检查
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "service": "chat-service"})
	})

	// API路由组
	api := router.Group("/api")
	{
		// 聊天相关路由
		chat := api.Group("/chat")
		{
			chat.POST("/message", middleware.AuthRequired(), chatHandler.SendMessage)
			chat.POST("/audio", middleware.AuthRequired(), chatHandler.SendAudio)
			chat.GET("/history/:problemId", middleware.AuthRequired(), chatHandler.GetHistory)
		}
	}

	// 启动服务器
	port := os.Getenv("PORT")
	if port == "" {
		port = "8083"
	}

	log.Printf("Chat service starting on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
