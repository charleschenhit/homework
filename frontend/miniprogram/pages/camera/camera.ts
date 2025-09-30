// pages/camera/camera.ts
Page({
  data: {
    cameraContext: null as any,
    isTakingPhoto: false,
    flashMode: 'off' as 'off' | 'on' | 'auto',
    devicePosition: 'back' as 'front' | 'back',
  },

  onLoad() {
    this.initCamera();
  },

  onUnload() {
    if (this.data.cameraContext) {
      this.data.cameraContext.stop();
    }
  },

  initCamera() {
    const cameraContext = wx.createCameraContext();
    this.setData({
      cameraContext
    });
  },

  // 拍照
  takePhoto() {
    if (this.data.isTakingPhoto) return;
    
    this.setData({
      isTakingPhoto: true
    });

    this.data.cameraContext.takePhoto({
      quality: 'high',
      success: (res: any) => {
        this.setData({
          isTakingPhoto: false
        });
        this.uploadAndAnalyze(res.tempImagePath);
      },
      fail: (err: any) => {
        this.setData({
          isTakingPhoto: false
        });
        wx.showToast({
          title: '拍照失败',
          icon: 'none'
        });
        console.error('拍照失败:', err);
      }
    });
  },

  // 从相册选择
  chooseFromAlbum() {
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

  // 切换闪光灯
  toggleFlash() {
    const flashModes = ['off', 'on', 'auto'];
    const currentIndex = flashModes.indexOf(this.data.flashMode);
    const nextIndex = (currentIndex + 1) % flashModes.length;
    
    this.setData({
      flashMode: flashModes[nextIndex] as 'off' | 'on' | 'auto'
    });
  },

  // 切换摄像头
  switchCamera() {
    this.setData({
      devicePosition: this.data.devicePosition === 'back' ? 'front' : 'back'
    });
  },

  // 返回
  goBack() {
    wx.navigateBack();
  }
});
