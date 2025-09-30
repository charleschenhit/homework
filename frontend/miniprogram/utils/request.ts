// utils/request.ts
interface RequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  header?: Record<string, string>;
  timeout?: number;
}

interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

class Request {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = getApp().globalData.baseUrl;
    this.timeout = 10000;
  }

  // 请求拦截器
  private interceptRequest(options: RequestOptions): RequestOptions {
    const token = getApp().globalData.token;
    
    // 添加默认请求头
    const defaultHeader = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };

    return {
      ...options,
      url: this.baseUrl + options.url,
      header: {
        ...defaultHeader,
        ...options.header
      },
      timeout: options.timeout || this.timeout
    };
  }

  // 响应拦截器
  private interceptResponse<T>(res: any): Promise<ApiResponse<T>> {
    return new Promise((resolve, reject) => {
      if (res.statusCode === 200) {
        const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
        
        // 处理业务错误
        if (data.code === 0) {
          resolve(data);
        } else if (data.code === 401) {
          // token过期，清除本地存储并跳转到登录页
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          getApp().globalData.token = '';
          getApp().globalData.userInfo = null;
          
          wx.showToast({
            title: '登录已过期',
            icon: 'none'
          });
          
          // 可以在这里跳转到登录页
          reject(new Error('登录已过期'));
        } else {
          reject(new Error(data.message || '请求失败'));
        }
      } else {
        reject(new Error(`网络错误: ${res.statusCode}`));
      }
    });
  }

  // 通用请求方法
  async request<T = any>(options: RequestOptions): Promise<ApiResponse<T>> {
    const requestOptions = this.interceptRequest(options);
    
    return new Promise((resolve, reject) => {
      wx.request({
        ...requestOptions,
        success: (res) => {
          this.interceptResponse<T>(res)
            .then(resolve)
            .catch(reject);
        },
        fail: (error) => {
          reject(new Error('网络连接失败'));
        }
      });
    });
  }

  // GET请求
  get<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'GET',
      data
    });
  }

  // POST请求
  post<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'POST',
      data
    });
  }

  // PUT请求
  put<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'PUT',
      data
    });
  }

  // DELETE请求
  delete<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'DELETE',
      data
    });
  }
}

// 创建请求实例
const request = new Request();

export { request, RequestOptions, ApiResponse };
