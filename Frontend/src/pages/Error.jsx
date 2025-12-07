// frontend/src/pages/ErrorPage.jsx
import { useRouteError, useNavigate } from 'react-router-dom';
import Button from '../components/Common/Button';

const Error = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <svg
            className="mx-auto h-24 w-24 text-error-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">Oops!</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Something went wrong
        </h2>
        
        <p className="text-gray-600 mb-8">
          {error?.statusText || error?.message || 'An unexpected error occurred'}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="primary" onClick={() => navigate('/')}>
            Go to Dashboard
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </div>

        {process.env.NODE_ENV === 'development' && error?.stack && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900">
              Error Details (Development Only)
            </summary>
            <pre className="mt-4 p-4 bg-gray-100 rounded-lg text-xs overflow-auto text-left">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

export default Error;