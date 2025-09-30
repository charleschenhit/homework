package models

import (
	"time"

	"gorm.io/gorm"
)

// User 用户模型
type User struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	OpenID    string         `json:"open_id" gorm:"uniqueIndex;not null"`
	UnionID   string         `json:"union_id" gorm:"index"`
	Nickname  string         `json:"nickname" gorm:"size:100"`
	Avatar    string         `json:"avatar" gorm:"size:500"`
	Gender    int            `json:"gender" gorm:"default:0"`
	City      string         `json:"city" gorm:"size:50"`
	Province  string         `json:"province" gorm:"size:50"`
	Country   string         `json:"country" gorm:"size:50"`
	Language  string         `json:"language" gorm:"size:20;default:'zh_CN'"`
	Status    int            `json:"status" gorm:"default:1;comment:1-正常 0-禁用"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at" gorm:"index"`
}

// UserStats 用户统计模型
type UserStats struct {
	ID           uint      `json:"id" gorm:"primaryKey"`
	UserID       uint      `json:"user_id" gorm:"not null;index"`
	TotalProblems int      `json:"total_problems" gorm:"default:0"`
	TotalMistakes int      `json:"total_mistakes" gorm:"default:0"`
	StudyTime    int       `json:"study_time" gorm:"default:0;comment:学习时长(分钟)"`
	StreakDays   int       `json:"streak_days" gorm:"default:0;comment:连续学习天数"`
	LastStudyAt  time.Time `json:"last_study_at"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// UserSession 用户会话模型
type UserSession struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	UserID    uint      `json:"user_id" gorm:"not null;index"`
	Token     string    `json:"token" gorm:"uniqueIndex;not null"`
	ExpiresAt time.Time `json:"expires_at"`
	CreatedAt time.Time `json:"created_at"`
}

// RegisterRequest 注册请求
type RegisterRequest struct {
	Code      string `json:"code" binding:"required"`
	Nickname  string `json:"nickname"`
	Avatar    string `json:"avatar"`
	Gender    int    `json:"gender"`
	City      string `json:"city"`
	Province  string `json:"province"`
	Country   string `json:"country"`
	Language  string `json:"language"`
}

// LoginRequest 登录请求
type LoginRequest struct {
	Code string `json:"code" binding:"required"`
}

// UpdateProfileRequest 更新资料请求
type UpdateProfileRequest struct {
	Nickname string `json:"nickname"`
	Avatar   string `json:"avatar"`
	Gender   int    `json:"gender"`
	City     string `json:"city"`
	Province string `json:"province"`
	Country  string `json:"country"`
}

// UserResponse 用户响应
type UserResponse struct {
	ID       uint   `json:"id"`
	OpenID   string `json:"open_id"`
	Nickname string `json:"nickname"`
	Avatar   string `json:"avatar"`
	Gender   int    `json:"gender"`
	City     string `json:"city"`
	Province string `json:"province"`
	Country  string `json:"country"`
	Language string `json:"language"`
	Status   int    `json:"status"`
}

// UserStatsResponse 用户统计响应
type UserStatsResponse struct {
	TotalProblems int    `json:"total_problems"`
	TotalMistakes int    `json:"total_mistakes"`
	StudyTime     int    `json:"study_time"`
	StreakDays    int    `json:"streak_days"`
	LastStudyAt   string `json:"last_study_at"`
}

// AuthResponse 认证响应
type AuthResponse struct {
	Token string       `json:"token"`
	User  UserResponse `json:"user"`
}
