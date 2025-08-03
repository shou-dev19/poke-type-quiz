// 分析・監視用のユーティリティ

interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
}

interface PerformanceMetrics {
  name: string;
  value: number;
  timestamp: number;
}

class Analytics {
  private isEnabled: boolean;
  private userId: string | null = null;

  constructor() {
    this.isEnabled = (import.meta as any).env.PROD && typeof window !== 'undefined';
    this.initializeUserId();
  }

  private initializeUserId() {
    if (typeof window !== 'undefined') {
      let userId = localStorage.getItem('analytics_user_id');
      if (!userId) {
        userId = this.generateUserId();
        localStorage.setItem('analytics_user_id', userId);
      }
      this.userId = userId;
    }
  }

  private generateUserId(): string {
    return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  // Google Analytics 4 イベント送信
  trackEvent(event: AnalyticsEvent) {
    if (!this.isEnabled) {
      console.log('Analytics Event (dev):', event);
      return;
    }

    // Google Analytics gtag関数を使用
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        custom_parameter_1: event.event,
      });
    }
  }

  // クイズゲーム専用のイベント追跡
  trackQuizStart(difficulty: string, questionCount: number) {
    this.trackEvent({
      event: 'quiz_start',
      category: 'quiz',
      action: 'start',
      label: difficulty,
      value: questionCount,
    });
  }

  trackQuizAnswer(isCorrect: boolean, questionNumber: number, timeTaken: number) {
    this.trackEvent({
      event: 'quiz_answer',
      category: 'quiz',
      action: isCorrect ? 'correct_answer' : 'incorrect_answer',
      label: `question_${questionNumber}`,
      value: Math.round(timeTaken),
    });
  }

  trackQuizComplete(score: number, totalQuestions: number, difficulty: string) {
    const percentage = Math.round((score / totalQuestions) * 100);
    this.trackEvent({
      event: 'quiz_complete',
      category: 'quiz',
      action: 'complete',
      label: difficulty,
      value: percentage,
    });
  }

  trackQuizQuit(questionNumber: number, totalQuestions: number) {
    this.trackEvent({
      event: 'quiz_quit',
      category: 'quiz',
      action: 'quit',
      label: `question_${questionNumber}_of_${totalQuestions}`,
      value: questionNumber,
    });
  }

  // パフォーマンス指標の追跡
  trackPerformance(metrics: PerformanceMetrics) {
    if (!this.isEnabled) {
      console.log('Performance Metric (dev):', metrics);
      return;
    }

    this.trackEvent({
      event: 'performance_metric',
      category: 'performance',
      action: metrics.name,
      value: Math.round(metrics.value),
    });
  }

  // Web Vitalsの追跡
  trackWebVitals() {
    if (!this.isEnabled || typeof window === 'undefined') return;

    // Core Web Vitals の測定と送信
    try {
      // Performance Observer が利用可能な場合
      if ('PerformanceObserver' in window) {
        // LCP (Largest Contentful Paint)
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.trackPerformance({
            name: 'LCP',
            value: lastEntry.startTime,
            timestamp: Date.now(),
          });
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // FID (First Input Delay) 
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach((entry: any) => {
            this.trackPerformance({
              name: 'FID',
              value: entry.processingStart - entry.startTime,
              timestamp: Date.now(),
            });
          });
        }).observe({ entryTypes: ['first-input'] });

        // CLS (Cumulative Layout Shift)
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          this.trackPerformance({
            name: 'CLS',
            value: clsValue,
            timestamp: Date.now(),
          });
        }).observe({ entryTypes: ['layout-shift'] });
      }
    } catch (error) {
      console.warn('Web Vitals tracking failed:', error);
    }
  }

  // エラーの追跡
  trackError(error: Error, context?: string) {
    if (!this.isEnabled) {
      console.error('Error (dev):', error, context);
      return;
    }

    this.trackEvent({
      event: 'javascript_error',
      category: 'error',
      action: error.name,
      label: context || error.message,
    });

    // 詳細なエラー情報も送信（本番環境のみ）
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'exception', {
        description: `${error.name}: ${error.message}`,
        fatal: false,
        custom_parameter_context: context,
      });
    }
  }

  // ページビューの追跡
  trackPageView(pageName: string) {
    if (!this.isEnabled) {
      console.log('Page View (dev):', pageName);
      return;
    }

    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: pageName,
        page_location: window.location.href,
        custom_parameter_user_id: this.userId,
      });
    }
  }
}

// シングルトンインスタンス
export const analytics = new Analytics();

// React Hook for analytics
export function useAnalytics() {
  return {
    trackQuizStart: analytics.trackQuizStart.bind(analytics),
    trackQuizAnswer: analytics.trackQuizAnswer.bind(analytics),
    trackQuizComplete: analytics.trackQuizComplete.bind(analytics),
    trackQuizQuit: analytics.trackQuizQuit.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
  };
}

// グローバルエラーハンドラーの設定
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    analytics.trackError(new Error(event.message), `${event.filename}:${event.lineno}`);
  });

  window.addEventListener('unhandledrejection', (event) => {
    analytics.trackError(new Error(event.reason), 'unhandled_promise_rejection');
  });

  // ページロード完了時にWeb Vitals追跡開始
  window.addEventListener('load', () => {
    analytics.trackWebVitals();
  });
}