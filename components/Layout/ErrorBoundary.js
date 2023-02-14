import React from 'react';
import Logger from '../../services/logger/Logger';
import Link from 'next/link';
import UnexpectedError from '../Utils/UnexpectedErrorModal';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    // Define a state variable to track whether is an error or not
    this.state = {
      hasError: false,
    };
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
  error = {
    title: 'Error',
    message: 'A client side error occured, please try again later ',
  };

  linkHome = (
    <Link onClick={() => this.setState({ hasError: false })} href='/' className='flex items-center gap-2 btn-default'>
      Home
    </Link>
  );

  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <h2>Oops, there is an error!</h2>
          <button type='button'>Try again?</button>
          <UnexpectedError
            footerLeft={this.linkHome}
            error={'A Client side error occured, please return to homepage.'}
            btn={this.btn}
          />
        </div>
      );
    }

    // Return children components in case of no error

    return this.props.children;
  }
}

export default ErrorBoundary;
