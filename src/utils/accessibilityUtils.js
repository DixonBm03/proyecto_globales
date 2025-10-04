// Accessibility utilities and testing functions
import { useEffect, useRef, useState } from 'react';

/**
 * Accessibility testing utilities
 */
export const accessibilityUtils = {
  /**
   * Check if element has proper ARIA labels
   * @param {HTMLElement} element - Element to check
   * @returns {Object} Accessibility report
   */
  checkAriaLabels(element) {
    const report = {
      hasAriaLabel: !!element.getAttribute('aria-label'),
      hasAriaLabelledBy: !!element.getAttribute('aria-labelledby'),
      hasRole: !!element.getAttribute('role'),
      hasTitle: !!element.getAttribute('title'),
      score: 0,
    };

    if (report.hasAriaLabel) report.score += 2;
    if (report.hasAriaLabelledBy) report.score += 2;
    if (report.hasRole) report.score += 1;
    if (report.hasTitle) report.score += 1;

    return report;
  },

  /**
   * Check color contrast ratio
   * @param {string} foreground - Foreground color
   * @param {string} background - Background color
   * @returns {Object} Contrast report
   */
  checkColorContrast(foreground, background) {
    // Simplified contrast calculation
    const getLuminance = color => {
      const rgb = color.match(/\d+/g);
      if (!rgb) return 0;
      const [r, g, b] = rgb.map(c => {
        c = parseInt(c) / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const fgLuminance = getLuminance(foreground);
    const bgLuminance = getLuminance(background);
    const contrast =
      (Math.max(fgLuminance, bgLuminance) + 0.05) /
      (Math.min(fgLuminance, bgLuminance) + 0.05);

    return {
      ratio: contrast,
      level: contrast >= 7 ? 'AAA' : contrast >= 4.5 ? 'AA' : 'Fail',
      passes: contrast >= 4.5,
    };
  },

  /**
   * Check keyboard navigation
   * @param {HTMLElement} element - Element to check
   * @returns {Object} Keyboard navigation report
   */
  checkKeyboardNavigation(element) {
    const report = {
      isFocusable:
        element.tabIndex >= 0 ||
        element.tagName === 'BUTTON' ||
        element.tagName === 'A' ||
        element.tagName === 'INPUT',
      hasTabIndex: element.hasAttribute('tabindex'),
      hasOnKeyDown: !!element.onkeydown,
      score: 0,
    };

    if (report.isFocusable) report.score += 3;
    if (report.hasTabIndex) report.score += 1;
    if (report.hasOnKeyDown) report.score += 1;

    return report;
  },
};

/**
 * Hook for managing focus and keyboard navigation
 * @param {boolean} isActive - Whether the component is active
 * @returns {Object} Focus management utilities
 */
export function useFocusManagement(isActive) {
  const elementRef = useRef(null);

  useEffect(() => {
    if (isActive && elementRef.current) {
      elementRef.current.focus();
    }
  }, [isActive]);

  const handleKeyDown = event => {
    switch (event.key) {
      case 'Escape':
        // Close modal or return focus
        if (elementRef.current) {
          elementRef.current.blur();
        }
        break;
      case 'Enter':
      case ' ':
        // Trigger action
        event.preventDefault();
        break;
      default:
        break;
    }
  };

  return {
    elementRef,
    handleKeyDown,
  };
}

/**
 * Hook for screen reader announcements
 * @returns {Object} Screen reader utilities
 */
export function useScreenReader() {
  const announce = (message, priority = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    // Add additional styling to ensure it's hidden
    announcement.style.cssText = `
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
      left: -10000px !important;
      top: -10000px !important;
    `;

    document.body.appendChild(announcement);

    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);
  };

  return { announce };
}

/**
 * Hook for managing ARIA attributes
 * @param {Object} props - Component props
 * @returns {Object} ARIA utilities
 */
export function useAriaAttributes(props) {
  const getAriaProps = (baseProps = {}) => {
    const ariaProps = {};

    if (props.ariaLabel) ariaProps['aria-label'] = props.ariaLabel;
    if (props.ariaLabelledBy)
      ariaProps['aria-labelledby'] = props.ariaLabelledBy;
    if (props.ariaDescribedBy)
      ariaProps['aria-describedby'] = props.ariaDescribedBy;
    if (props.role) ariaProps.role = props.role;
    if (props.ariaExpanded !== undefined)
      ariaProps['aria-expanded'] = props.ariaExpanded;
    if (props.ariaSelected !== undefined)
      ariaProps['aria-selected'] = props.ariaSelected;
    if (props.ariaHidden !== undefined)
      ariaProps['aria-hidden'] = props.ariaHidden;

    return { ...baseProps, ...ariaProps };
  };

  return { getAriaProps };
}

/**
 * Accessibility testing component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Accessibility test results
 */
export function AccessibilityTester({ children, testName }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const element = containerRef.current;
      const ariaReport = accessibilityUtils.checkAriaLabels(element);
      const keyboardReport =
        accessibilityUtils.checkKeyboardNavigation(element);

      console.log(`Accessibility Test - ${testName}:`, {
        aria: ariaReport,
        keyboard: keyboardReport,
      });
    }
  }, [testName]);

  return (
    <div ref={containerRef} data-test-name={testName}>
      {children}
    </div>
  );
}

/**
 * High contrast mode detection
 * @returns {boolean} Whether high contrast mode is active
 */
export function useHighContrastMode() {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    const checkHighContrast = () => {
      // Check for high contrast media query
      const mediaQuery = window.matchMedia('(prefers-contrast: high)');
      setIsHighContrast(mediaQuery.matches);
    };

    checkHighContrast();

    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    mediaQuery.addEventListener('change', checkHighContrast);

    return () => mediaQuery.removeEventListener('change', checkHighContrast);
  }, []);

  return isHighContrast;
}

/**
 * Reduced motion detection
 * @returns {boolean} Whether reduced motion is preferred
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const checkReducedMotion = () => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
    };

    checkReducedMotion();

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', checkReducedMotion);

    return () => mediaQuery.removeEventListener('change', checkReducedMotion);
  }, []);

  return prefersReducedMotion;
}
