package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"homework-tutor/mistake-service/internal/config"
	"homework-tutor/mistake-service/internal/database"
	"homework-tutor/mistake-service/internal/handlers"
	"homework-tutor/mistake-service/internal/middleware"
	"homework-tutor/mistake-service/internal/repository"
	"homework-tutor/mistake-service/internal/service"
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
	mistakeRepo := repository.NewMistakeRepository(db)

	// 初始化服务
	mistakeService := service.NewMistakeService(mistakeRepo, redisClient)

	// 初始化处理器
	mistakeHandler := handlers.NewMistakeHandler(mistakeService)

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
		c.JSON(200, gin.H{"status": "ok", "service": "mistake-service"})
	})

	// API路由组
	api := router.Group("/api")
	{
		// 错题本相关路由
		mistakeBook := api.Group("/mistake-book")
		{
			mistakeBook.GET("/problems", middleware.AuthRequired(), mistakeHandler.GetProblems)
			mistakeBook.POST("/problems", middleware.AuthRequired(), mistakeHandler.AddProblem)
			mistakeBook.DELETE("/problems/:id", middleware.AuthRequired(), mistakeHandler.DeleteProblem)
			mistakeBook.GET("/stats", middleware.AuthRequired(), mistakeHandler.GetStats)
		}
	}

	// 启动服务器
	port := os.Getenv("PORT")
	if port == "" {
		port = "8082"
	}

	log.Printf("Mistake service starting on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
