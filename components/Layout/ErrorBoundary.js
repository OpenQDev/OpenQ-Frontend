import React from 'react';
import Logger from '../../services/logger/Logger';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    const logger = new Logger();
    // Update state so the next render will show the fallback UI
    logger.error({ message: error }, null, 'globalErrorBoundary');

    return { hasError: true };
  }
  componentDidCatch(error) {
    const logger = new Logger();
    // You can use your own error logging service here
    logger.error({ message: error }, null, 'globalErrorBoundary');
  }
  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <h2>Oops, there is an error!</h2>
          <button type='button' onClick={() => this.setState({ hasError: false })}>
            Try again?
          </button>
        </div>
      );
    }

    // Return children components in case of no error

    return this.props.children;
  }
}

export default ErrorBoundary;
