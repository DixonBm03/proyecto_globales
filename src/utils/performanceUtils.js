// Performance optimization utilities
import { useMemo, useCallback } from 'react';

/**
 * Debounce hook for performance optimization
 * @param {Function} callback - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function useDebounce(callback, delay) {
  const debouncedCallback = useCallback(
    (...args) => {
      const timeoutId = setTimeout(() => callback(...args), delay);
      return () => clearTimeout(timeoutId);
    },
    [callback, delay]
  );

  return debouncedCallback;
}

/**
 * Memoized data processing for charts
 * @param {Array} data - Raw data array
 * @param {Function} processor - Data processing function
 * @returns {Array} Processed data
 */
export function useProcessedData(data, processor) {
  return useMemo(() => {
    if (!data || !processor) return null;
    return processor(data);
  }, [data, processor]);
}

/**
 * Memoized chart configuration
 * @param {Object} config - Chart configuration
 * @returns {Object} Memoized configuration
 */
export function useChartConfig(config) {
  return useMemo(
    () => config,
    [
      config.min,
      config.max,
      config.height,
      config.title,
      config.showLegend,
      config.showTooltip,
    ]
  );
}

/**
 * Performance monitoring hook
 * @param {string} componentName - Name of the component
 * @returns {Object} Performance monitoring utilities
 */
export function usePerformanceMonitor(componentName) {
  const startTime = useMemo(() => performance.now(), []);

  const logPerformance = useCallback(
    operation => {
      const endTime = performance.now();
      const duration = endTime - startTime;

      if (duration > 100) {
        // Log if operation takes more than 100ms
        console.warn(
          `Performance warning: ${componentName} - ${operation} took ${duration.toFixed(2)}ms`
        );
      }
    },
    [componentName, startTime]
  );

  return { logPerformance };
}

/**
 * Memory usage monitoring
 * @returns {Object} Memory monitoring utilities
 */
export function useMemoryMonitor() {
  const checkMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = performance.memory;
      const usedMB = (memory.usedJSHeapSize / 1048576).toFixed(2);
      const totalMB = (memory.totalJSHeapSize / 1048576).toFixed(2);

      if (memory.usedJSHeapSize / memory.totalJSHeapSize > 0.8) {
        console.warn(`High memory usage: ${usedMB}MB / ${totalMB}MB`);
      }
    }
  }, []);

  return { checkMemoryUsage };
}

/**
 * Optimized data filtering
 * @param {Array} data - Data to filter
 * @param {string} searchTerm - Search term
 * @param {Array} fields - Fields to search in
 * @returns {Array} Filtered data
 */
export function useOptimizedFilter(data, searchTerm, fields) {
  return useMemo(() => {
    if (!searchTerm || !data) return data;

    const term = searchTerm.toLowerCase();
    return data.filter(item =>
      fields.some(field =>
        String(item[field] || '')
          .toLowerCase()
          .includes(term)
      )
    );
  }, [data, searchTerm, fields]);
}

/**
 * Virtual scrolling hook for large datasets
 * @param {Array} items - Items to display
 * @param {number} itemHeight - Height of each item
 * @param {number} containerHeight - Height of container
 * @returns {Object} Virtual scrolling configuration
 */
export function useVirtualScrolling(items, itemHeight, containerHeight) {
  return useMemo(() => {
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const totalHeight = items.length * itemHeight;

    return {
      visibleCount,
      totalHeight,
      itemHeight,
      overscan: 5, // Render extra items for smooth scrolling
    };
  }, [items.length, itemHeight, containerHeight]);
}
