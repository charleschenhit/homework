// app.ts
App<IAppOption>({
  globalData: {
    userInfo: null,
    token: '',
    baseUrl: 'https://api.homework-tutor.com', // 生产环境API地址
  },
  onLaunch() {
    // 初始化应用
    this.initApp();
  },
  
  initApp() {
    // 检查登录状态
    const token = wx.getStorageSync('token');
    if (token) {
      this.globalData.token = token;
    }
    
    // 检查更新
    this.checkUpdate();
  },
  
  checkUpdate() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      
      updateManager.onCheckForUpdate((res) => {
        if (res.hasUpdate) {
          console.log('发现新版本');
        }
      });
      
      updateManager.onUpdateReady(() => {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: (res) => {
            if (res.confirm) {
              updateManager.applyUpdate();
            }
          }
        });
      });
    }
  }
});

interface IAppOption {
  globalData: {
    userInfo: any;
    token: string;
    baseUrl: string;
  };
  initApp(): void;
  checkUpdate(): void;
}
