import { Component } from 'react';

/** Catches render errors so one broken page never shows a blank white screen. */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('UI error:', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-emoji-dizzy display-3 text-osrjc-orange" aria-hidden="true"></i>
        <h1 className="h3 mt-3">Oops! Something went wrong</h1>
        <p className="text-muted">Please refresh the page. If it keeps happening, contact the shop.</p>
        <button type="button" className="btn btn-osrjc-primary" onClick={() => window.location.assign('/')}>
          Back to Home
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;
