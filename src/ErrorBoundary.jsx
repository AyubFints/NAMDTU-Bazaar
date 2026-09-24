import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', background: '#fee2e2', color: '#991b1b', minHeight: '100vh' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Dasturda xatolik yuz berdi!</h1>
          <p>Iltimos, ushbu xatolikni skrinshot qilib yuboring:</p>
          <pre style={{ background: '#fef2f2', padding: '10px', marginTop: '10px', overflowX: 'auto', fontSize: '12px' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            style={{ marginTop: '20px', padding: '10px 20px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            Sahifani yangilash
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
