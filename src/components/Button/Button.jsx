/**
 * Button Component
 * A fully reusable button with multiple variants, sizes, and states
 * Demonstrates: component composition, props, conditional styling, spread operator
 */
import './Button.css';

export default function Button({
  // Content
  children,           // React nodes: button text/content
  
  // Variants
  variant = 'primary', // String: 'primary', 'secondary', 'success', 'danger', 'warning', 'outline', 'ghost'
  
  // Sizes
  size = 'medium',    // String: 'small', 'medium', 'large'
  
  // States
  disabled = false,   // Boolean: disables the button
  loading = false,    // Boolean: shows loading spinner
  
  // Layout
  fullWidth = false,  // Boolean: makes button full width
  icon = null,        // React node: icon to display before text
  
  // Events
  onClick = null,     // Function: click handler
  onMouseEnter = null,// Function: mouse enter handler
  onMouseLeave = null,// Function: mouse leave handler
  
  // HTML attributes
  type = 'button',    // String: 'button', 'submit', 'reset'
  className = '',     // String: additional CSS classes
  id = '',           // String: HTML id attribute
  ariaLabel = '',    // String: accessibility label
  
  // Rest props (forwards any other HTML attributes)
  ...props
}) {
  /**
   * Build the class name string
   * Filters out falsy values and joins with spaces
   */
  const classNames = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth && 'btn-full-width',
    loading && 'btn-loading',
    disabled && 'btn-disabled',
    className
  ].filter(Boolean).join(' ');

  /**
   * Handle click with loading/disabled check
   */
  const handleClick = (event) => {
    if (disabled || loading) return;
    if (onClick) onClick(event);
  };

  return (
    <button
      type={type}
      id={id}
      className={classNames}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      disabled={disabled || loading}
      aria-label={ariaLabel || undefined}
      aria-disabled={disabled || loading}
      {...props}
    >
      {/* Loading spinner */}
      {loading && (
        <span className="btn-spinner" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
          </svg>
        </span>
      )}
      
      {/* Icon */}
      {!loading && icon && (
        <span className="btn-icon" aria-hidden="true">
          {icon}
        </span>
      )}
      
      {/* Button text */}
      <span className="btn-text">
        {loading ? 'Loading...' : children}
      </span>
    </button>
  );
}