package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// AuthRequired JWT认证中间件
func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 获取Authorization头
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"code":    401,
				"message": "Authorization header required",
			})
			c.Abort()
			return
		}

		// 检查Bearer前缀
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			c.JSON(http.StatusUnauthorized, gin.H{
				"code":    401,
				"message": "Invalid authorization header format",
			})
			c.Abort()
			return
		}

		// 解析JWT token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			// 验证签名方法
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrSignatureInvalid
			}
			// 这里应该从配置中获取密钥
			return []byte("your-secret-key"), nil
		})

		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"code":    401,
				"message": "Invalid token",
			})
			c.Abort()
			return
		}

		// 验证token是否有效
		if !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{
				"code":    401,
				"message": "Token is not valid",
			})
			c.Abort()
			return
		}

		// 获取claims
		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			// 将用户ID添加到上下文
			if userID, ok := claims["user_id"].(float64); ok {
				c.Set("user_id", uint(userID))
			}
			if openID, ok := claims["open_id"].(string); ok {
				c.Set("open_id", openID)
			}
		}

		c.Next()
	}
}
