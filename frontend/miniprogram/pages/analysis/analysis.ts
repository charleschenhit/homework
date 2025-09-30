// pages/analysis/analysis.ts
import { request } from '../../utils/request';

interface ProblemData {
  id: string;
  imageUrl: string;
  ocrText: string;
  answer: string;
  steps: string[];
  knowledgePoints: string[];
  subject: string;
  difficulty: string;
}

Page({
  data: {
    problemId: '',
    problemData: null as ProblemData | null,
    loading: true,
    error: '',
    isPlayingAudio: false,
    audioContext: null as any,
  },

  onLoad(options: any) {
    const { problemId } = options;
    if (problemId) {
      this.setData({ problemId });
      this.loadProblemData(problemId);
    } else {
      this.setData({
        loading: false,
        error: '缺少题目ID'
      });
    }
  },

  onUnload() {
    if (this.data.audioContext) {
      this.data.audioContext.stop();
    }
  },

  // 加载题目数据
  async loadProblemData(problemId: string) {
    try {
      const res = await request({
        url: `/api/homework/problems/${problemId}`,
        method: 'GET'
      });

      if (res.code === 0) {
        this.setData({
          problemData: res.data,
          loading: false
        });
      } else {
        this.setData({
          loading: false,
          error: res.message || '加载失败'
        });
      }
    } catch (error) {
      this.setData({
        loading: false,
        error: '网络错误'
      });
    }
  },

  // 重新生成解析
  async regenerateAnalysis() {
    if (!this.data.problemData) return;

    wx.showLoading({
      title: '正在重新生成...'
    });

    try {
      const res = await request({
        url: `/api/homework/problems/${this.data.problemId}/regenerate`,
        method: 'POST'
      });

      wx.hideLoading();

      if (res.code === 0) {
        this.setData({
          problemData: res.data
        });
        wx.showToast({
          title: '重新生成成功',
          icon: 'success'
        });
      } else {
        wx.showToast({
          title: res.message || '重新生成失败',
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

  // 播放语音讲解
  async playAudio() {
    if (this.data.isPlayingAudio) {
      this.stopAudio();
      return;
    }

    if (!this.data.problemData) return;

    wx.showLoading({
      title: '正在生成语音...'
    });

    try {
      const res = await request({
        url: `/api/tts/generate`,
        method: 'POST',
        data: {
          text: this.data.problemData.answer,
          problemId: this.data.problemId
        }
      });

      wx.hideLoading();

      if (res.code === 0) {
        const audioContext = wx.createInnerAudioContext();
        audioContext.src = res.data.audioUrl;
        
        audioContext.onPlay(() => {
          this.setData({ isPlayingAudio: true });
        });

        audioContext.onEnded(() => {
          this.setData({ isPlayingAudio: false });
        });

        audioContext.onError(() => {
          this.setData({ isPlayingAudio: false });
          wx.showToast({
            title: '播放失败',
            icon: 'none'
          });
        });

        audioContext.play();
        this.setData({ audioContext });
      } else {
        wx.showToast({
          title: res.message || '生成语音失败',
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

  // 停止语音播放
  stopAudio() {
    if (this.data.audioContext) {
      this.data.audioContext.stop();
      this.setData({ isPlayingAudio: false });
    }
  },

  // 加入错题本
  async addToMistakeBook() {
    if (!this.data.problemData) return;

    wx.showLoading({
      title: '正在添加...'
    });

    try {
      const res = await request({
        url: '/api/mistake-book/problems',
        method: 'POST',
        data: {
          problemId: this.data.problemId,
          subject: this.data.problemData.subject
        }
      });

      wx.hideLoading();

      if (res.code === 0) {
        wx.showToast({
          title: '已加入错题本',
          icon: 'success'
        });
      } else {
        wx.showToast({
          title: res.message || '添加失败',
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

  // 进入对话模式
  goToChat() {
    wx.navigateTo({
      url: `/pages/chat/chat?problemId=${this.data.problemId}`
    });
  },

  // 编辑OCR文本
  editOcrText() {
    if (!this.data.problemData) return;

    wx.showModal({
      title: '编辑题目文本',
      editable: true,
      placeholderText: '请输入题目内容',
      content: this.data.problemData.ocrText,
      success: (res) => {
        if (res.confirm && res.content) {
          this.updateOcrText(res.content);
        }
      }
    });
  },

  // 更新OCR文本
  async updateOcrText(newText: string) {
    wx.showLoading({
      title: '正在更新...'
    });

    try {
      const res = await request({
        url: `/api/homework/problems/${this.data.problemId}/ocr`,
        method: 'PUT',
        data: {
          ocrText: newText
        }
      });

      wx.hideLoading();

      if (res.code === 0) {
        this.setData({
          'problemData.ocrText': newText
        });
        wx.showToast({
          title: '更新成功',
          icon: 'success'
        });
      } else {
        wx.showToast({
          title: res.message || '更新失败',
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
  }
});
