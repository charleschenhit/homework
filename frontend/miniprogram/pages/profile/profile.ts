// pages/profile/profile.ts
import { request } from '../../utils/request';

interface UserStats {
  totalProblems: number;
  totalMistakes: number;
  studyTime: number;
  streakDays: number;
}

Page({
  data: {
    userInfo: null as any,
    userStats: null as UserStats | null,
    loading: false,
    menuItems: [
      {
        icon: '/images/study-time.png',
        title: '学习时长',
        subtitle: '查看详细学习记录',
        action: 'studyTime'
      },
      {
        icon: '/images/progress.png',
        title: '学习进度',
        subtitle: '查看学习报告',
        action: 'progress'
      },
      {
        icon: '/images/feedback.png',
        title: '反馈建议',
        subtitle: '帮助我们改进',
        action: 'feedback'
      },
      {
        icon: '/images/about.png',
        title: '关于我们',
        subtitle: '了解更多信息',
        action: 'about'
      }
    ]
  },

  onLoad() {
    this.loadUserInfo();
    this.loadUserStats();
  },

  onShow() {
    // 每次显示时刷新数据
    this.loadUserStats();
  },

  // 加载用户信息
  loadUserInfo() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({ userInfo });
    }
  },

  // 加载用户统计
  async loadUserStats() {
    this.setData({ loading: true });

    try {
      const res = await request({
        url: '/api/user/stats',
        method: 'GET'
      });

      if (res.code === 0) {
        this.setData({
          userStats: res.data,
          loading: false
        });
      } else {
        this.setData({ loading: false });
      }
    } catch (error) {
      this.setData({ loading: false });
      console.error('加载用户统计失败:', error);
    }
  },

  // 获取用户信息
  getUserProfile() {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        this.setData({
          userInfo: res.userInfo
        });
        wx.setStorageSync('userInfo', res.userInfo);
        this.updateUserInfo(res.userInfo);
      },
      fail: () => {
        wx.showToast({
          title: '获取用户信息失败',
          icon: 'none'
        });
      }
    });
  },

  // 更新用户信息到服务器
  async updateUserInfo(userInfo: any) {
    try {
      await request({
        url: '/api/user/profile',
        method: 'PUT',
        data: {
          nickname: userInfo.nickName,
          avatar: userInfo.avatarUrl
        }
      });
    } catch (error) {
      console.error('更新用户信息失败:', error);
    }
  },

  // 菜单项点击
  onMenuItemTap(e: any) {
    const action = e.currentTarget.dataset.action;
    
    switch (action) {
      case 'studyTime':
        this.showStudyTime();
        break;
      case 'progress':
        this.showProgress();
        break;
      case 'feedback':
        this.showFeedback();
        break;
      case 'about':
        this.showAbout();
        break;
    }
  },

  // 显示学习时长
  showStudyTime() {
    wx.showModal({
      title: '学习时长',
      content: `今日学习：${this.formatTime(this.data.userStats?.studyTime || 0)}\n连续学习：${this.data.userStats?.streakDays || 0}天`,
      showCancel: false
    });
  },

  // 显示学习进度
  showProgress() {
    wx.showModal({
      title: '学习进度',
      content: `累计做题：${this.data.userStats?.totalProblems || 0}道\n错题收集：${this.data.userStats?.totalMistakes || 0}道`,
      showCancel: false
    });
  },

  // 显示反馈建议
  showFeedback() {
    wx.showModal({
      title: '反馈建议',
      editable: true,
      placeholderText: '请输入您的建议...',
      success: (res) => {
        if (res.confirm && res.content) {
          this.submitFeedback(res.content);
        }
      }
    });
  },

  // 提交反馈
  async submitFeedback(content: string) {
    wx.showLoading({
      title: '提交中...'
    });

    try {
      const res = await request({
        url: '/api/feedback',
        method: 'POST',
        data: {
          content: content,
          type: 'suggestion'
        }
      });

      wx.hideLoading();

      if (res.code === 0) {
        wx.showToast({
          title: '提交成功',
          icon: 'success'
        });
      } else {
        wx.showToast({
          title: res.message || '提交失败',
          icon: 'none'
        });
      }
    } catch (error) {
      wx.hideLoading();
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      });
    }
  },

  // 显示关于我们
  showAbout() {
    wx.showModal({
      title: '关于我们',
      content: '智能作业辅导小程序 v1.0.0\n\n基于AI技术的智能作业辅导平台，帮助学生更好地学习和理解题目。',
      showCancel: false
    });
  },

  // 退出登录
  logout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          this.performLogout();
        }
      }
    });
  },

  // 执行退出登录
  performLogout() {
    // 清除本地存储
    wx.removeStorageSync('token');
    wx.removeStorageSync('userInfo');
    
    // 清除全局数据
    getApp().globalData.token = '';
    getApp().globalData.userInfo = null;
    
    // 重置页面数据
    this.setData({
      userInfo: null,
      userStats: null
    });

    wx.showToast({
      title: '已退出登录',
      icon: 'success'
    });
  },

  // 格式化时间
  formatTime(minutes: number): string {
    if (minutes < 60) {
      return `${minutes}分钟`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}小时${mins}分钟`;
    }
  }
});
