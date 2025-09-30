package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"homework-tutor/user-service/internal/config"
	"homework-tutor/user-service/internal/database"
	"homework-tutor/user-service/internal/handlers"
	"homework-tutor/user-service/internal/middleware"
	"homework-tutor/user-service/internal/repository"
	"homework-tutor/user-service/internal/service"
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
	userRepo := repository.NewUserRepository(db)
	userStatsRepo := repository.NewUserStatsRepository(db)

	// 初始化服务
	userService := service.NewUserService(userRepo, userStatsRepo, redisClient)

	// 初始化处理器
	userHandler := handlers.NewUserHandler(userService)

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
		c.JSON(200, gin.H{"status": "ok", "service": "user-service"})
	})

	// API路由组
	api := router.Group("/api")
	{
		// 用户相关路由
		users := api.Group("/users")
		{
			users.POST("/register", userHandler.Register)
			users.POST("/login", userHandler.Login)
			users.GET("/profile", middleware.AuthRequired(), userHandler.GetProfile)
			users.PUT("/profile", middleware.AuthRequired(), userHandler.UpdateProfile)
			users.GET("/stats", middleware.AuthRequired(), userHandler.GetStats)
		}
	}

	// 启动服务器
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("User service starting on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
