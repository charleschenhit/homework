package database

import (
	"context"
	"fmt"
	"log"

	"homework-tutor/user-service/internal/config"
	"homework-tutor/user-service/internal/models"

	"github.com/redis/go-redis/v9"
	"gorm.io/driver/mysql"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// InitDB 初始化数据库连接
func InitDB(cfg *config.Config) (*gorm.DB, error) {
	var dsn string
	var dialector gorm.Dialector

	// 根据环境选择数据库类型
	if cfg.Environment == "production" {
		// 生产环境使用PostgreSQL
		dsn = fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
			cfg.Database.Host,
			cfg.Database.Port,
			cfg.Database.User,
			cfg.Database.Password,
			cfg.Database.DBName,
			cfg.Database.SSLMode,
		)
		dialector = postgres.Open(dsn)
	} else {
		// 开发环境使用MySQL
		dsn = fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8mb4&parseTime=True&loc=Local",
			cfg.Database.User,
			cfg.Database.Password,
			cfg.Database.Host,
			cfg.Database.Port,
			cfg.Database.DBName,
		)
		dialector = mysql.Open(dsn)
	}

	// 配置GORM日志级别
	var logLevel logger.LogLevel
	if cfg.Environment == "production" {
		logLevel = logger.Silent
	} else {
		logLevel = logger.Info
	}

	// 连接数据库
	db, err := gorm.Open(dialector, &gorm.Config{
		Logger: logger.Default.LogMode(logLevel),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	// 自动迁移
	if err := autoMigrate(db); err != nil {
		return nil, fmt.Errorf("failed to migrate database: %w", err)
	}

	log.Println("Database connected successfully")
	return db, nil
}

// InitRedis 初始化Redis连接
func InitRedis(cfg *config.Config) (*redis.Client, error) {
	client := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%d", cfg.Redis.Host, cfg.Redis.Port),
		Password: cfg.Redis.Password,
		DB:       cfg.Redis.DB,
	})

	// 测试连接
	ctx := context.Background()
	_, err := client.Ping(ctx).Result()
	if err != nil {
		return nil, fmt.Errorf("failed to connect to Redis: %w", err)
	}

	log.Println("Redis connected successfully")
	return client, nil
}

// autoMigrate 自动迁移数据库表
func autoMigrate(db *gorm.DB) error {
	return db.AutoMigrate(
		&models.User{},
		&models.UserStats{},
		&models.UserSession{},
	)
}
