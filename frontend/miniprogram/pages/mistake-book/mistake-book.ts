// pages/mistake-book/mistake-book.ts
import { request } from '../../utils/request';

interface MistakeProblem {
  id: string;
  problemId: string;
  subject: string;
  imageUrl: string;
  title: string;
  addedAt: string;
  reviewCount: number;
  lastReviewedAt?: string;
}

Page({
  data: {
    activeTab: '数学',
    subjects: ['数学', '英语', '物理', '化学', '生物'],
    problems: [] as MistakeProblem[],
    loading: false,
    hasMore: true,
    page: 1,
    pageSize: 20,
  },

  onLoad() {
    this.loadProblems();
  },

  onShow() {
    // 每次显示时刷新数据
    this.refreshProblems();
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadMoreProblems();
    }
  },

  onPullDownRefresh() {
    this.refreshProblems();
  },

  // 切换学科
  switchTab(e: any) {
    const subject = e.currentTarget.dataset.subject;
    this.setData({
      activeTab: subject,
      problems: [],
      page: 1,
      hasMore: true
    });
    this.loadProblems();
  },

  // 加载错题列表
  async loadProblems() {
    if (this.data.loading) return;

    this.setData({ loading: true });

    try {
      const res = await request({
        url: '/api/mistake-book/problems',
        method: 'GET',
        data: {
          subject: this.data.activeTab,
          page: this.data.page,
          pageSize: this.data.pageSize
        }
      });

      if (res.code === 0) {
        const newProblems = res.data.problems || [];
        this.setData({
          problems: this.data.page === 1 ? newProblems : [...this.data.problems, ...newProblems],
          hasMore: newProblems.length === this.data.pageSize,
          loading: false
        });
      } else {
        this.setData({ loading: false });
        wx.showToast({
          title: res.message || '加载失败',
          icon: 'none'
        });
      }
    } catch (error) {
      this.setData({ loading: false });
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      });
    }
  },

  // 加载更多
  async loadMoreProblems() {
    this.setData({
      page: this.data.page + 1
    });
    await this.loadProblems();
  },

  // 刷新数据
  async refreshProblems() {
    this.setData({
      problems: [],
      page: 1,
      hasMore: true
    });
    await this.loadProblems();
    wx.stopPullDownRefresh();
  },

  // 查看题目详情
  viewProblem(e: any) {
    const problemId = e.currentTarget.dataset.problemId;
    wx.navigateTo({
      url: `/pages/analysis/analysis?problemId=${problemId}`
    });
  },

  // 删除错题
  deleteProblem(e: any) {
    const problemId = e.currentTarget.dataset.problemId;
    const index = e.currentTarget.dataset.index;

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这道错题吗？',
      success: async (res) => {
        if (res.confirm) {
          await this.removeProblem(problemId, index);
        }
      }
    });
  },

  // 移除错题
  async removeProblem(problemId: string, index: number) {
    wx.showLoading({
      title: '正在删除...'
    });

    try {
      const res = await request({
        url: `/api/mistake-book/problems/${problemId}`,
        method: 'DELETE'
      });

      wx.hideLoading();

      if (res.code === 0) {
        const problems = [...this.data.problems];
        problems.splice(index, 1);
        this.setData({ problems });
        
        wx.showToast({
          title: '删除成功',
          icon: 'success'
        });
      } else {
        wx.showToast({
          title: res.message || '删除失败',
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

  // 批量复习
  batchReview() {
    if (this.data.problems.length === 0) {
      wx.showToast({
        title: '暂无错题',
        icon: 'none'
      });
      return;
    }

    wx.showModal({
      title: '批量复习',
      content: `确定要开始复习${this.data.problems.length}道错题吗？`,
      success: (res) => {
        if (res.confirm) {
          this.startBatchReview();
        }
      }
    });
  },

  // 开始批量复习
  startBatchReview() {
    // 这里可以实现批量复习逻辑
    // 比如跳转到一个专门的复习页面
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  // 格式化时间
  formatTime(timeStr: string): string {
    const date = new Date(timeStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) {
      return '刚刚';
    } else if (diff < 3600000) {
      return Math.floor(diff / 60000) + '分钟前';
    } else if (diff < 86400000) {
      return Math.floor(diff / 3600000) + '小时前';
    } else if (diff < 604800000) {
      return Math.floor(diff / 86400000) + '天前';
    } else {
      return date.toLocaleDateString();
    }
  },

  // 获取学科图标
  getSubjectIcon(subject: string): string {
    const icons: Record<string, string> = {
      '数学': '/images/math.png',
      '英语': '/images/english.png',
      '物理': '/images/physics.png',
      '化学': '/images/chemistry.png',
      '生物': '/images/biology.png'
    };
    return icons[subject] || '/images/subject.png';
  }
});
