package middleware

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Recovery 恢复中间件
func Recovery() gin.HandlerFunc {
	return gin.CustomRecovery(func(c *gin.Context, recovered interface{}) {
		if err, ok := recovered.(string); ok {
			c.JSON(http.StatusInternalServerError, gin.H{
				"code":    500,
				"message": fmt.Sprintf("Internal server error: %s", err),
			})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{
				"code":    500,
				"message": "Internal server error",
			})
		}
		c.Abort()
	})
}
