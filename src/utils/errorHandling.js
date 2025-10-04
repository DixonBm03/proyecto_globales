// Error handling and monitoring utilities
import { useState, useEffect, useCallback } from 'react';

/**
 * Error types and severity levels
 */
export const ERROR_TYPES = {
  API_ERROR: 'API_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RENDER_ERROR: 'RENDER_ERROR',
  USER_ERROR: 'USER_ERROR',
};

export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

/**
 * Error monitoring hook
 * @param {string} componentName - Name of the component
 * @returns {Object} Error monitoring utilities
 */
export function useErrorMonitoring(componentName) {
  const [errors, setErrors] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const logError = useCallback(
    (
      error,
      type = ERROR_TYPES.RENDER_ERROR,
      severity = ERROR_SEVERITY.MEDIUM
    ) => {
      const errorEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        component: componentName,
        type,
        severity,
        message: error.message || error,
        stack: error.stack,
        userAgent: navigator.userAgent,
        url: window.location.href,
        isOnline,
      };

      setErrors(prev => [...prev.slice(-9), errorEntry]); // Keep last 10 errors

      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.error(`[${componentName}] ${type}:`, error);
      }

      // Send to monitoring service in production
      if (process.env.NODE_ENV === 'production') {
        sendErrorToMonitoring(errorEntry);
      }
    },
    [componentName, isOnline]
  );

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const getErrorCount = useCallback(
    severity => {
      if (severity) {
        return errors.filter(error => error.severity === severity).length;
      }
      return errors.length;
    },
    [errors]
  );

  return {
    errors,
    logError,
    clearErrors,
    getErrorCount,
    isOnline,
  };
}

/**
 * API error handling hook
 * @returns {Object} API error handling utilities
 */
export function useApiErrorHandling() {
  const handleApiError = useCallback((error, context = '') => {
    let errorType = ERROR_TYPES.API_ERROR;
    let severity = ERROR_SEVERITY.MEDIUM;

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      errorType = ERROR_TYPES.NETWORK_ERROR;
      severity = ERROR_SEVERITY.HIGH;
    } else if (error.status >= 500) {
      severity = ERROR_SEVERITY.HIGH;
    } else if (error.status >= 400) {
      severity = ERROR_SEVERITY.MEDIUM;
    }

    const enhancedError = {
      ...error,
      context,
      type: errorType,
      severity,
      timestamp: new Date().toISOString(),
    };

    return enhancedError;
  }, []);

  const retryApiCall = useCallback(
    async (apiCall, maxRetries = 3, delay = 1000) => {
      let lastError;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          return await apiCall();
        } catch (error) {
          lastError = error;

          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, delay * attempt));
          }
        }
      }

      throw lastError;
    },
    []
  );

  return {
    handleApiError,
    retryApiCall,
  };
}

/**
 * Validation error handling
 * @param {Object} validationRules - Validation rules
 * @returns {Object} Validation utilities
 */
export function useValidation(validationRules) {
  const [errors, setErrors] = useState({});

  const validate = useCallback(
    data => {
      const newErrors = {};

      Object.entries(validationRules).forEach(([field, rules]) => {
        const value = data[field];

        rules.forEach(rule => {
          if (!rule.validator(value)) {
            if (!newErrors[field]) {
              newErrors[field] = [];
            }
            newErrors[field].push(rule.message);
          }
        });
      });

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [validationRules]
  );

  const clearFieldError = useCallback(field => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    validate,
    clearFieldError,
    clearAllErrors,
    hasErrors: Object.keys(errors).length > 0,
  };
}

/**
 * Error boundary component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Error boundary
 */
export function ErrorBoundary({ children, fallback, onError }) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleError = event => {
      setHasError(true);
      setError(event.error);

      if (onError) {
        onError(event.error);
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, [onError]);

  if (hasError) {
    return (
      fallback || (
        <div
          className='error-boundary'
          style={{
            padding: '20px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <h3 style={{ color: '#dc2626', marginBottom: '12px' }}>
            Algo salió mal
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '16px' }}>
            Ha ocurrido un error inesperado. Por favor, recarga la página.
          </p>
          <button
            className='btn'
            onClick={() => window.location.reload()}
            style={{ backgroundColor: '#dc2626' }}
          >
            Recargar página
          </button>
        </div>
      )
    );
  }

  return children;
}

/**
 * Send error to monitoring service
 * @param {Object} errorEntry - Error entry to send
 */
async function sendErrorToMonitoring(errorEntry) {
  try {
    // In a real application, you would send this to your monitoring service
    // like Sentry, LogRocket, or a custom endpoint
    console.log('Sending error to monitoring service:', errorEntry);

    // Example: Send to custom endpoint
    // await fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorEntry)
    // });
  } catch (error) {
    console.error('Failed to send error to monitoring service:', error);
  }
}

/**
 * Performance monitoring hook
 * @param {string} operationName - Name of the operation
 * @returns {Object} Performance monitoring utilities
 */
export function usePerformanceMonitoring(operationName) {
  const [metrics, setMetrics] = useState([]);

  const startTiming = useCallback(() => {
    return performance.now();
  }, []);

  const endTiming = useCallback(
    startTime => {
      const duration = performance.now() - startTime;

      const metric = {
        operation: operationName,
        duration,
        timestamp: new Date().toISOString(),
      };

      setMetrics(prev => [...prev.slice(-19), metric]); // Keep last 20 metrics

      if (duration > 1000) {
        // Log slow operations
        console.warn(
          `Slow operation detected: ${operationName} took ${duration.toFixed(2)}ms`
        );
      }

      return duration;
    },
    [operationName]
  );

  const getAverageTime = useCallback(() => {
    if (metrics.length === 0) return 0;
    const total = metrics.reduce((sum, metric) => sum + metric.duration, 0);
    return total / metrics.length;
  }, [metrics]);

  return {
    startTiming,
    endTiming,
    metrics,
    getAverageTime,
  };
}
