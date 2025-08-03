import React, { Component, ErrorInfo, ReactNode } from 'react';
import { analytics } from './analytics';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // エラーが発生したときの状態更新
    return {
      hasError: true,
      error,
    };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // エラー情報を分析システムに送信
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    analytics.trackError(error, `ErrorBoundary: ${errorInfo.componentStack}`);
    
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  override render() {
    if (this.state.hasError) {
      // カスタムフォールバックUIが提供されている場合
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // デフォルトのエラーUI
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full text-center border border-white/20">
            <div className="text-6xl mb-6">😵</div>
            <h1 className="text-2xl font-bold text-white mb-4">
              おっと！問題が発生しました
            </h1>
            <p className="text-white/80 mb-6">
              アプリケーションでエラーが発生しました。
              <br />
              ページを再読み込みするか、ホームに戻ってください。
            </p>
            
            {/* 開発環境でのみエラー詳細を表示 */}
            {(import.meta as ImportMeta & { env: { DEV: boolean } }).env.DEV && this.state.error && (
              <details className="text-left bg-black/20 p-4 rounded-lg mb-6 text-xs">
                <summary className="cursor-pointer text-red-300 font-semibold">
                  エラー詳細（開発環境のみ）
                </summary>
                <pre className="text-red-200 mt-2 overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                再読み込み
              </button>
              <button
                onClick={this.handleGoHome}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
              >
                ホームに戻る
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundaryComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}