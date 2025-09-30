// utils/storage.ts
class Storage {
  // 设置存储
  set(key: string, value: any): void {
    try {
      wx.setStorageSync(key, value);
    } catch (error) {
      console.error('存储失败:', error);
    }
  }

  // 获取存储
  get<T = any>(key: string, defaultValue?: T): T | null {
    try {
      const value = wx.getStorageSync(key);
      return value || defaultValue || null;
    } catch (error) {
      console.error('获取存储失败:', error);
      return defaultValue || null;
    }
  }

  // 删除存储
  remove(key: string): void {
    try {
      wx.removeStorageSync(key);
    } catch (error) {
      console.error('删除存储失败:', error);
    }
  }

  // 清空存储
  clear(): void {
    try {
      wx.clearStorageSync();
    } catch (error) {
      console.error('清空存储失败:', error);
    }
  }

  // 获取存储信息
  getInfo(): Promise<{ keys: string[]; currentSize: number; limitSize: number }> {
    return new Promise((resolve, reject) => {
      wx.getStorageInfo({
        success: (res) => {
          resolve({
            keys: res.keys,
            currentSize: res.currentSize,
            limitSize: res.limitSize
          });
        },
        fail: reject
      });
    });
  }

  // 异步设置存储
  setAsync(key: string, value: any): Promise<void> {
    return new Promise((resolve, reject) => {
      wx.setStorage({
        key,
        data: value,
        success: () => resolve(),
        fail: reject
      });
    });
  }

  // 异步获取存储
  getAsync<T = any>(key: string): Promise<T> {
    return new Promise((resolve, reject) => {
      wx.getStorage({
        key,
        success: (res) => resolve(res.data),
        fail: reject
      });
    });
  }

  // 异步删除存储
  removeAsync(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      wx.removeStorage({
        key,
        success: () => resolve(),
        fail: reject
      });
    });
  }
}

// 创建存储实例
const storage = new Storage();

export { storage };
