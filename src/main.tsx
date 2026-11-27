import { Component, type ErrorInfo, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message || 'Unexpected rendering error' };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo): void {}

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#050C09] text-[#F2F5F0] p-6">
          <div className="max-w-md rounded-xl border border-[#5EEAD4]/25 bg-[#07160F] p-6 space-y-3">
            <h1 className="font-display text-lg font-semibold">Unable to load view</h1>
            <p className="text-sm text-[#95ACA0]">{this.state.message}</p>
            <button
              type="button"
              onClick={() => {
                window.location.hash = '#home';
                window.location.reload();
              }}
              className="px-4 py-2 rounded-lg bg-[#4ADE80] text-[#050C09] text-sm font-semibold cursor-pointer"
            >
              Return Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
