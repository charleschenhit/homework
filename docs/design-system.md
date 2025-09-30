# 智能作业辅导小程序 - 设计系统

## 1. 设计原则

### 1.1 核心原则
- **简洁明了**: 界面简洁，功能清晰，减少认知负担
- **教育友好**: 符合学生使用习惯，营造良好的学习氛围
- **高效便捷**: 快速拍照识别，一键获取答案和解析
- **智能互动**: 支持多模态交互，提供个性化学习体验

### 1.2 视觉风格
- **现代简约**: 采用扁平化设计，减少视觉干扰
- **温暖友好**: 使用温暖的色彩搭配，营造亲切感
- **专业可信**: 保持教育产品的专业性和可信度

## 2. 色彩系统

### 2.1 主色调
```css
/* 主品牌色 - 智能绿 */
--primary-color: #3cc51f;        /* 主按钮、链接、强调色 */
--primary-light: #5dd63f;       /* 主色浅色变体 */
--primary-dark: #2ba315;        /* 主色深色变体 */

/* 渐变色 */
--gradient-primary: linear-gradient(135deg, #3cc51f 0%, #2ba315 100%);
--gradient-warm: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### 2.2 辅助色
```css
/* 功能色 */
--success-color: #2ed573;       /* 成功状态 */
--warning-color: #ffa502;       /* 警告状态 */
--error-color: #ff4757;         /* 错误状态 */
--info-color: #3742fa;          /* 信息提示 */

/* 中性色 */
--text-primary: #2c3e50;        /* 主要文字 */
--text-secondary: #7f8c8d;      /* 次要文字 */
--text-disabled: #bdc3c7;       /* 禁用文字 */
--border-color: #e0e0e0;        /* 边框色 */
--background-light: #f8f9fa;    /* 浅色背景 */
--background-white: #ffffff;    /* 白色背景 */
```

### 2.3 语义化颜色
```css
/* 学科色彩 */
--math-color: #e74c3c;          /* 数学 - 红色 */
--english-color: #3498db;       /* 英语 - 蓝色 */
--physics-color: #9b59b6;       /* 物理 - 紫色 */
--chemistry-color: #f39c12;     /* 化学 - 橙色 */
--biology-color: #27ae60;       /* 生物 - 绿色 */
```

## 3. 字体系统

### 3.1 字体族
```css
/* 中文字体 */
--font-family-chinese: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;

/* 英文字体 */
--font-family-english: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;

/* 代码字体 */
--font-family-mono: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
```

### 3.2 字体大小
```css
/* 标题字体 */
--font-size-h1: 48rpx;          /* 页面主标题 */
--font-size-h2: 40rpx;          /* 区块标题 */
--font-size-h3: 36rpx;          /* 卡片标题 */
--font-size-h4: 32rpx;          /* 小标题 */

/* 正文字体 */
--font-size-large: 32rpx;       /* 大号正文 */
--font-size-base: 28rpx;        /* 标准正文 */
--font-size-small: 24rpx;       /* 小号文字 */
--font-size-mini: 20rpx;        /* 最小文字 */
```

### 3.3 字重
```css
--font-weight-light: 300;       /* 细体 */
--font-weight-normal: 400;      /* 常规 */
--font-weight-medium: 500;      /* 中等 */
--font-weight-bold: 600;        /* 粗体 */
--font-weight-heavy: 700;       /* 特粗 */
```

## 4. 间距系统

### 4.1 基础间距单位
```css
--spacing-xs: 8rpx;             /* 超小间距 */
--spacing-sm: 16rpx;            /* 小间距 */
--spacing-md: 24rpx;            /* 中等间距 */
--spacing-lg: 32rpx;            /* 大间距 */
--spacing-xl: 48rpx;            /* 超大间距 */
--spacing-xxl: 64rpx;           /* 特大间距 */
```

### 4.2 组件间距
```css
--padding-xs: 16rpx;            /* 组件内边距 - 小 */
--padding-sm: 24rpx;            /* 组件内边距 - 中 */
--padding-md: 32rpx;            /* 组件内边距 - 大 */
--padding-lg: 48rpx;            /* 组件内边距 - 特大 */

--margin-xs: 16rpx;             /* 组件外边距 - 小 */
--margin-sm: 24rpx;             /* 组件外边距 - 中 */
--margin-md: 32rpx;             /* 组件外边距 - 大 */
--margin-lg: 48rpx;             /* 组件外边距 - 特大 */
```

## 5. 圆角系统

```css
--border-radius-xs: 4rpx;       /* 超小圆角 */
--border-radius-sm: 8rpx;       /* 小圆角 */
--border-radius-md: 12rpx;      /* 中等圆角 */
--border-radius-lg: 16rpx;      /* 大圆角 */
--border-radius-xl: 24rpx;      /* 超大圆角 */
--border-radius-round: 50%;     /* 圆形 */
```

## 6. 阴影系统

```css
/* 卡片阴影 */
--shadow-card: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
--shadow-card-hover: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);

/* 按钮阴影 */
--shadow-button: 0 4rpx 8rpx rgba(60, 197, 31, 0.3);
--shadow-button-active: 0 2rpx 4rpx rgba(60, 197, 31, 0.4);

/* 浮动阴影 */
--shadow-float: 0 8rpx 20rpx rgba(0, 0, 0, 0.2);
```

## 7. 组件库

### 7.1 按钮组件

#### 主要按钮
```css
.btn-primary {
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius-lg);
  padding: var(--padding-sm) var(--padding-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  box-shadow: var(--shadow-button);
  transition: all 0.3s ease;
}

.btn-primary:active {
  transform: translateY(2rpx);
  box-shadow: var(--shadow-button-active);
}
```

#### 次要按钮
```css
.btn-secondary {
  background: var(--background-white);
  color: var(--text-primary);
  border: 2rpx solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--padding-sm) var(--padding-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  transition: all 0.3s ease;
}

.btn-secondary:active {
  background: var(--background-light);
  border-color: var(--primary-color);
}
```

#### 大按钮
```css
.btn-large {
  width: 80%;
  height: 100rpx;
  line-height: 100rpx;
  text-align: center;
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-bold);
  margin: var(--margin-md) auto;
  border-radius: 50rpx;
}
```

### 7.2 卡片组件

```css
.card {
  background: var(--background-white);
  border-radius: var(--border-radius-lg);
  padding: var(--padding-md);
  margin: var(--margin-sm);
  box-shadow: var(--shadow-card);
  transition: all 0.3s ease;
}

.card:active {
  transform: scale(0.98);
  box-shadow: var(--shadow-card-hover);
}
```

### 7.3 输入框组件

```css
.input-field {
  background: var(--background-white);
  border: 2rpx solid var(--border-color);
  border-radius: var(--border-radius-sm);
  padding: var(--padding-sm);
  font-size: var(--font-size-base);
  color: var(--text-primary);
  transition: border-color 0.3s ease;
}

.input-field:focus {
  border-color: var(--primary-color);
  outline: none;
}
```

### 7.4 标签组件

```css
.tag {
  display: inline-block;
  padding: 8rpx 16rpx;
  border-radius: var(--border-radius-round);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-medium);
}

.tag-primary {
  background: var(--primary-color);
  color: white;
}

.tag-subject {
  background: var(--background-light);
  color: var(--text-secondary);
  border: 1rpx solid var(--border-color);
}
```

## 8. 页面布局规范

### 8.1 首页布局
```css
.home-container {
  min-height: 100vh;
  background: var(--gradient-warm);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 40rpx;
}

.home-header {
  text-align: center;
  margin-bottom: 80rpx;
}

.home-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  max-width: 600rpx;
}

.home-actions {
  display: flex;
  justify-content: space-around;
  width: 100%;
  max-width: 600rpx;
  margin-top: 60rpx;
}
```

### 8.2 拍照页面布局
```css
.camera-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #000;
}

.camera-viewfinder {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.camera-controls {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 40rpx 60rpx;
  background-color: rgba(0, 0, 0, 0.8);
}
```

### 8.3 解析页面布局
```css
.analysis-container {
  min-height: 100vh;
  background-color: var(--background-light);
  padding: 20rpx;
}

.analysis-content {
  padding-bottom: 40rpx;
}

.analysis-actions {
  display: flex;
  justify-content: space-around;
  margin-top: 40rpx;
  padding: 0 20rpx;
}
```

## 9. 交互状态

### 9.1 加载状态
```css
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
}

.loading-spinner {
  width: 40rpx;
  height: 40rpx;
  border: 4rpx solid var(--border-color);
  border-top: 4rpx solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

### 9.2 错误状态
```css
.error {
  color: var(--error-color);
  font-size: var(--font-size-base);
  text-align: center;
  padding: 20rpx;
  background: rgba(255, 71, 87, 0.1);
  border-radius: var(--border-radius-sm);
  border: 1rpx solid var(--error-color);
}
```

### 9.3 成功状态
```css
.success {
  color: var(--success-color);
  font-size: var(--font-size-base);
  text-align: center;
  padding: 20rpx;
  background: rgba(46, 213, 115, 0.1);
  border-radius: var(--border-radius-sm);
  border: 1rpx solid var(--success-color);
}
```

## 10. 响应式设计

### 10.1 屏幕适配
```css
/* 小屏幕适配 */
@media (max-width: 375px) {
  :root {
    --font-size-h1: 44rpx;
    --font-size-h2: 36rpx;
    --font-size-h3: 32rpx;
  }
}

/* 大屏幕适配 */
@media (min-width: 414px) {
  :root {
    --font-size-h1: 52rpx;
    --font-size-h2: 44rpx;
    --font-size-h3: 40rpx;
  }
}
```

## 11. 动画效果

### 11.1 页面转场
```css
.page-enter {
  opacity: 0;
  transform: translateX(100%);
}

.page-enter-active {
  opacity: 1;
  transform: translateX(0);
  transition: all 0.3s ease;
}

.page-exit {
  opacity: 1;
  transform: translateX(0);
}

.page-exit-active {
  opacity: 0;
  transform: translateX(-100%);
  transition: all 0.3s ease;
}
```

### 11.2 按钮动画
```css
.btn-animate {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-animate:active {
  transform: scale(0.95);
}
```

## 12. 无障碍设计

### 12.1 颜色对比度
- 确保文字与背景的对比度至少为 4.5:1
- 重要信息不依赖颜色单独传达

### 12.2 触摸目标
- 最小触摸目标尺寸为 44rpx × 44rpx
- 按钮间距至少为 8rpx

### 12.3 文字可读性
- 使用合适的字体大小和行高
- 避免过长的文本行

这个设计系统为您的智能作业辅导小程序提供了完整的设计规范，可以确保界面的一致性和专业性。
