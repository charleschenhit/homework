// pages/chat/chat.ts
import { request } from '../../utils/request';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: number;
  audioUrl?: string;
}

Page({
  data: {
    problemId: '',
    problemTitle: '',
    messages: [] as ChatMessage[],
    inputText: '',
    isRecording: false,
    isPlaying: false,
    playingMessageId: '',
    recorderManager: null as any,
    audioContext: null as any,
  },

  onLoad(options: any) {
    const { problemId } = options;
    if (problemId) {
      this.setData({ problemId });
      this.initChat();
    }
  },

  onUnload() {
    if (this.data.recorderManager) {
      this.data.recorderManager.stop();
    }
    if (this.data.audioContext) {
      this.data.audioContext.stop();
    }
  },

  // 初始化聊天
  async initChat() {
    try {
      // 获取题目信息
      const res = await request({
        url: `/api/homework/problems/${this.data.problemId}`,
        method: 'GET'
      });

      if (res.code === 0) {
        this.setData({
          problemTitle: res.data.ocrText.substring(0, 50) + '...'
        });

        // 添加欢迎消息
        this.addMessage({
          id: 'welcome',
          type: 'ai',
          content: '你好！我是你的智能作业辅导助手。关于这道题目，有什么想了解的吗？',
          timestamp: Date.now()
        });
      }
    } catch (error) {
      console.error('初始化聊天失败:', error);
    }
  },

  // 添加消息
  addMessage(message: ChatMessage) {
    this.setData({
      messages: [...this.data.messages, message]
    });
    this.scrollToBottom();
  },

  // 滚动到底部
  scrollToBottom() {
    setTimeout(() => {
      wx.pageScrollTo({
        scrollTop: 99999,
        duration: 300
      });
    }, 100);
  },

  // 输入文本变化
  onInputChange(e: any) {
    this.setData({
      inputText: e.detail.value
    });
  },

  // 发送文本消息
  async sendTextMessage() {
    const content = this.data.inputText.trim();
    if (!content) return;

    // 添加用户消息
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: Date.now()
    };
    this.addMessage(userMessage);

    // 清空输入框
    this.setData({ inputText: '' });

    // 发送到后端
    await this.sendToAI(content);
  },

  // 发送到AI
  async sendToAI(content: string) {
    try {
      const res = await request({
        url: '/api/chat/message',
        method: 'POST',
        data: {
          problemId: this.data.problemId,
          message: content
        }
      });

      if (res.code === 0) {
        const aiMessage: ChatMessage = {
          id: Date.now().toString(),
          type: 'ai',
          content: res.data.content,
          timestamp: Date.now(),
          audioUrl: res.data.audioUrl
        };
        this.addMessage(aiMessage);
      } else {
        this.addMessage({
          id: Date.now().toString(),
          type: 'ai',
          content: '抱歉，我暂时无法回答这个问题。请稍后再试。',
          timestamp: Date.now()
        });
      }
    } catch (error) {
      this.addMessage({
        id: Date.now().toString(),
        type: 'ai',
        content: '网络错误，请检查网络连接后重试。',
        timestamp: Date.now()
      });
    }
  },

  // 开始录音
  startRecord() {
    if (this.data.isRecording) return;

    const recorderManager = wx.getRecorderManager();
    
    recorderManager.onStart(() => {
      this.setData({ isRecording: true });
    });

    recorderManager.onStop((res) => {
      this.setData({ isRecording: false });
      this.sendAudioMessage(res.tempFilePath);
    });

    recorderManager.onError((error) => {
      this.setData({ isRecording: false });
      wx.showToast({
        title: '录音失败',
        icon: 'none'
      });
    });

    recorderManager.start({
      duration: 60000,
      sampleRate: 16000,
      numberOfChannels: 1,
      encodeBitRate: 96000,
      format: 'mp3'
    });

    this.setData({ recorderManager });
  },

  // 停止录音
  stopRecord() {
    if (this.data.recorderManager && this.data.isRecording) {
      this.data.recorderManager.stop();
    }
  },

  // 发送语音消息
  async sendAudioMessage(filePath: string) {
    wx.showLoading({
      title: '正在识别语音...'
    });

    try {
      // 先上传音频文件
      const uploadRes = await this.uploadAudio(filePath);
      
      if (uploadRes.code === 0) {
        // 发送语音消息到AI
        const res = await request({
          url: '/api/chat/audio',
          method: 'POST',
          data: {
            problemId: this.data.problemId,
            audioUrl: uploadRes.data.audioUrl
          }
        });

        wx.hideLoading();

        if (res.code === 0) {
          // 添加用户语音消息
          const userMessage: ChatMessage = {
            id: Date.now().toString(),
            type: 'user',
            content: '[语音消息]',
            timestamp: Date.now()
          };
          this.addMessage(userMessage);

          // 添加AI回复
          const aiMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: res.data.content,
            timestamp: Date.now(),
            audioUrl: res.data.audioUrl
          };
          this.addMessage(aiMessage);
        } else {
          wx.showToast({
            title: res.message || '语音识别失败',
            icon: 'none'
          });
        }
      }
    } catch (error) {
      wx.hideLoading();
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      });
    }
  },

  // 上传音频文件
  uploadAudio(filePath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: getApp().globalData.baseUrl + '/api/upload/audio',
        filePath: filePath,
        name: 'audio',
        header: {
          'Authorization': 'Bearer ' + getApp().globalData.token
        },
        success: (res) => {
          const data = JSON.parse(res.data);
          resolve(data);
        },
        fail: reject
      });
    });
  },

  // 播放语音
  playAudio(messageId: string, audioUrl: string) {
    if (this.data.isPlaying && this.data.playingMessageId === messageId) {
      this.stopAudio();
      return;
    }

    const audioContext = wx.createInnerAudioContext();
    audioContext.src = audioUrl;
    
    audioContext.onPlay(() => {
      this.setData({
        isPlaying: true,
        playingMessageId: messageId
      });
    });

    audioContext.onEnded(() => {
      this.setData({
        isPlaying: false,
        playingMessageId: ''
      });
    });

    audioContext.onError(() => {
      this.setData({
        isPlaying: false,
        playingMessageId: ''
      });
      wx.showToast({
        title: '播放失败',
        icon: 'none'
      });
    });

    audioContext.play();
    this.setData({ audioContext });
  },

  // 停止播放
  stopAudio() {
    if (this.data.audioContext) {
      this.data.audioContext.stop();
      this.setData({
        isPlaying: false,
        playingMessageId: ''
      });
    }
  },

  // 格式化时间
  formatTime(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) {
      return '刚刚';
    } else if (diff < 3600000) {
      return Math.floor(diff / 60000) + '分钟前';
    } else if (diff < 86400000) {
      return Math.floor(diff / 3600000) + '小时前';
    } else {
      return date.toLocaleDateString();
    }
  }
});
