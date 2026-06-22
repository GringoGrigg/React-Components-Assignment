/**
 * Input Component
 * A fully reusable input with label, validation, and password toggle
 * Demonstrates: component composition, state management, conditional rendering
 */
import { useState } from 'react';
import './Input.css';

export default function Input({
  // Basic props
  label,              // String: label text
  name,              // String: input name attribute
  type = 'text',     // String: input type (text, email, password, number, etc.)
  value,             // String/Number: input value (controlled)
  onChange,          // Function: change handler
  onBlur,           // Function: blur handler
  onFocus,          // Function: focus handler
  
  // Placeholder and help text
  placeholder = '',  // String: placeholder text
  helper = '',      // String: helper text below input
  error = '',       // String: error message
  
  // Validation
  required = false,  // Boolean: required field
  min = null,       // Number: minimum value
  max = null,       // Number: maximum value
  minLength = null, // Number: minimum length
  maxLength = null, // Number: maximum length
  pattern = null,   // String: regex pattern
  
  // States
  disabled = false,  // Boolean: disabled state
  readOnly = false,  // Boolean: read-only state
  
  // Styling
  className = '',   // String: additional CSS classes
  fullWidth = true, // Boolean: full width
  
  // Rest props
  ...props
}) {
  // State for password visibility toggle
  const [showPassword, setShowPassword] = useState(false);
  
  // State for internal focus (for styling)
  const [isFocused, setIsFocused] = useState(false);

  /**
   * Determine if input is a password type
   * Password inputs can toggle visibility
   */
  const isPassword = type === 'password';
  
  /**
   * Determine the actual input type
   * For password, toggle between password and text
   */
  const inputType = isPassword && showPassword ? 'text' : type;
  
  /**
   * Check if there's an error
   */
  const hasError = !!error;

  /**
   * Handle focus event
   */
  const handleFocus = (event) => {
    setIsFocused(true);
    if (onFocus) onFocus(event);
  };

  /**
   * Handle blur event
   */
  const handleBlur = (event) => {
    setIsFocused(false);
    if (onBlur) onBlur(event);
  };

  /**
   * Toggle password visibility
   */
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  /**
   * Build container class names
   */
  const containerClasses = [
    'input-container',
    fullWidth && 'input-full-width',
    className
  ].filter(Boolean).join(' ');

  /**
   * Build input class names
   */
  const inputClasses = [
    'input-field',
    hasError && 'input-error',
    isFocused && 'input-focused',
    disabled && 'input-disabled',
    readOnly && 'input-readonly'
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {/* Label */}
      {label && (
        <label htmlFor={name} className="input-label">
          {label}
          {required && <span className="input-required" aria-hidden="true">*</span>}
        </label>
      )}

      {/* Input wrapper (for password toggle) */}
      <div className="input-wrapper">
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          min={min}
          max={max}
          minLength={minLength}
          maxLength={maxLength}
          pattern={pattern}
          className={inputClasses}
          aria-invalid={hasError}
          aria-describedby={
            (error ? `${name}-error` : '') + 
            (helper ? ` ${name}-helper` : '')
          }
          {...props}
        />

        {/* Password toggle button */}
        {isPassword && (
          <button
            type="button"
            className="password-toggle"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex="-1"
          >
            {showPassword ? (
              <span className="toggle-icon" aria-hidden="true">👁️‍🗨️</span>
            ) : (
              <span className="toggle-icon" aria-hidden="true">👁️</span>
            )}
          </button>
        )}
      </div>

      {/* Helper text */}
      {helper && !hasError && (
        <div id={`${name}-helper`} className="input-helper">
          {helper}
        </div>
      )}

      {/* Error message */}
      {hasError && (
        <div id={`${name}-error`} className="input-error-text" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}