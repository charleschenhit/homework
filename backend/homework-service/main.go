package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"homework-tutor/homework-service/internal/config"
	"homework-tutor/homework-service/internal/database"
	"homework-tutor/homework-service/internal/handlers"
	"homework-tutor/homework-service/internal/middleware"
	"homework-tutor/homework-service/internal/repository"
	"homework-tutor/homework-service/internal/service"
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
	problemRepo := repository.NewProblemRepository(db)
	analysisRepo := repository.NewAnalysisRepository(db)

	// 初始化服务
	homeworkService := service.NewHomeworkService(problemRepo, analysisRepo, redisClient)

	// 初始化处理器
	homeworkHandler := handlers.NewHomeworkHandler(homeworkService)

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
		c.JSON(200, gin.H{"status": "ok", "service": "homework-service"})
	})

	// API路由组
	api := router.Group("/api")
	{
		// 作业相关路由
		homework := api.Group("/homework")
		{
			homework.POST("/upload", middleware.AuthRequired(), homeworkHandler.UploadImage)
			homework.GET("/problems/:id", middleware.AuthRequired(), homeworkHandler.GetProblem)
			homework.PUT("/problems/:id/ocr", middleware.AuthRequired(), homeworkHandler.UpdateOCR)
			homework.POST("/problems/:id/regenerate", middleware.AuthRequired(), homeworkHandler.RegenerateAnalysis)
		}
	}

	// 启动服务器
	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}

	log.Printf("Homework service starting on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
