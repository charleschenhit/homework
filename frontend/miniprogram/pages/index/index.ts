// pages/index/index.ts
import { request } from '../../utils/request';

Page({
  data: {
    userInfo: null as any,
    hasUserInfo: false,
    canIUseGetUserProfile: false,
  },

  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      });
    }
  },

  onShow() {
    // 检查用户登录状态
    this.checkLoginStatus();
  },

  checkLoginStatus() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo,
        hasUserInfo: true
      });
    }
  },

  getUserProfile() {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
        wx.setStorageSync('userInfo', res.userInfo);
      }
    });
  },

  // 拍照搜题
  takePhoto() {
    wx.navigateTo({
      url: '/pages/camera/camera'
    });
  },

  // 上传题目
  uploadImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        this.uploadAndAnalyze(tempFilePath);
      }
    });
  },

  // 上传并分析图片
  uploadAndAnalyze(filePath: string) {
    wx.showLoading({
      title: '正在识别题目...'
    });

    wx.uploadFile({
      url: getApp().globalData.baseUrl + '/api/homework/upload',
      filePath: filePath,
      name: 'image',
      header: {
        'Authorization': 'Bearer ' + getApp().globalData.token
      },
      success: (res) => {
        wx.hideLoading();
        const data = JSON.parse(res.data);
        if (data.code === 0) {
          wx.navigateTo({
            url: `/pages/analysis/analysis?problemId=${data.data.problemId}`
          });
        } else {
          wx.showToast({
            title: data.message || '识别失败',
            icon: 'none'
          });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        });
      }
    });
  },

  // 跳转到错题本
  goToMistakeBook() {
    wx.switchTab({
      url: '/pages/mistake-book/mistake-book'
    });
  },

  // 跳转到个人中心
  goToProfile() {
    wx.switchTab({
      url: '/pages/profile/profile'
    });
  }
});
