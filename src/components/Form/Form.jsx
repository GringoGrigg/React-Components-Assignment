/**
 * Form Component
 * A complete form with validation, error handling, and submission
 * Demonstrates: useState, useMemo, useCallback, form handling, validation
 */
import { useState, useMemo, useCallback } from 'react';
import Input from '../Input/Input';
import Button from '../Button/Button';
import './Form.css';

export default function Form() {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  
  // Form data state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
    subscribe: true
  });

  // Track which fields have been touched (for validation display)
  const [touched, setTouched] = useState({});
  
  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // ============================================
  // VALIDATION
  // ============================================

  /**
   * Validate a single field
   * Returns error message or empty string
   */
  const validateField = useCallback((name, value) => {
    switch(name) {
      case 'username':
        if (!value || value.trim() === '') {
          return 'Username is required';
        }
        if (value.length < 3) {
          return 'Username must be at least 3 characters';
        }
        if (value.length > 20) {
          return 'Username must be at most 20 characters';
        }
        if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          return 'Username can only contain letters, numbers, and underscores';
        }
        return '';

      case 'email':
        if (!value || value.trim() === '') {
          return 'Email is required';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return 'Please enter a valid email address';
        }
        return '';

      case 'password':
        if (!value) {
          return 'Password is required';
        }
        if (value.length < 8) {
          return 'Password must be at least 8 characters';
        }
        if (!/(?=.*[A-Z])/.test(value)) {
          return 'Password must contain at least one uppercase letter';
        }
        if (!/(?=.*[a-z])/.test(value)) {
          return 'Password must contain at least one lowercase letter';
        }
        if (!/(?=.*[0-9])/.test(value)) {
          return 'Password must contain at least one number';
        }
        if (!/(?=.*[!@#$%^&*])/.test(value)) {
          return 'Password must contain at least one special character (!@#$%^&*)';
        }
        return '';

      case 'confirmPassword':
        if (!value) {
          return 'Please confirm your password';
        }
        if (value !== formData.password) {
          return 'Passwords do not match';
        }
        return '';

      case 'terms':
        if (!value) {
          return 'You must agree to the Terms and Conditions';
        }
        return '';

      default:
        return '';
    }
  }, [formData.password]);

  /**
   * Memoize all errors
   * Only recalculates when formData changes
   */
  const errors = useMemo(() => {
    const result = {};
    for (const field in formData) {
      const error = validateField(field, formData[field]);
      if (error) result[field] = error;
    }
    return result;
  }, [formData, validateField]);

  /**
   * Memoize form validity
   * Only recalculates when errors or formData changes
   */
  const isValid = useMemo(() => {
    // Check if there are any errors
    if (Object.keys(errors).length > 0) return false;
    
    // Check if required fields have values
    if (!formData.username.trim()) return false;
    if (!formData.email.trim()) return false;
    if (!formData.password) return false;
    if (!formData.terms) return false;
    
    return true;
  }, [errors, formData]);

  /**
   * Get password strength
   * Returns object with score and label
   */
  const getPasswordStrength = useCallback((password) => {
    if (!password) return { score: 0, label: 'None' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*]/.test(password)) score++;
    
    const labels = {
      0: 'None',
      1: 'Weak',
      2: 'Weak',
      3: 'Fair',
      4: 'Good',
      5: 'Strong',
      6: 'Very Strong'
    };
    
    return { score, label: labels[score] || 'None' };
  }, []);

  const passwordStrength = useMemo(() => {
    return getPasswordStrength(formData.password);
  }, [formData.password, getPasswordStrength]);

  // ============================================
  // EVENT HANDLERS
  // ============================================

  /**
   * Handle input changes
   * Updates formData state
   */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  /**
   * Handle input blur
   * Marks field as touched
   */
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  /**
   * Handle form submission
   * Validates, simulates API call, shows success/error
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = {};
    for (const field in formData) {
      allTouched[field] = true;
    }
    setTouched(allTouched);

    // Validate form
    if (!isValid) {
      // Focus on first error field
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        if (element) element.focus();
      }
      return;
    }

    // Submit form
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // 90% success rate for demo
          if (Math.random() > 0.1) {
            resolve();
          } else {
            reject(new Error('Server error: Unable to create account'));
          }
        }, 1500);
      });
      
      // Success
      setSubmitSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          terms: false,
          subscribe: true
        });
        setTouched({});
        setSubmitSuccess(false);
      }, 3000);
      
    } catch (error) {
      // Error
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Reset form to initial state
   */
  const handleReset = useCallback(() => {
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
      subscribe: true
    });
    setTouched({});
    setSubmitError(null);
    setSubmitSuccess(false);
  }, []);

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Create Account</h2>
        <p className="form-subtitle">Join our community today</p>
      </div>

      {/* Success Message */}
      {submitSuccess && (
        <div className="form-success" role="alert">
          <span className="success-icon">✅</span>
          <div>
            <strong>Account created successfully!</strong>
            <p>Welcome to the community. Redirecting...</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {submitError && (
        <div className="form-error" role="alert">
          <span className="error-icon">❌</span>
          <div>
            <strong>Submission failed</strong>
            <p>{submitError}</p>
          </div>
          <button 
            className="error-dismiss"
            onClick={() => setSubmitError(null)}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} onReset={handleReset} noValidate>
        {/* Username */}
        <Input
          label="Username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter your username"
          required
          error={touched.username ? errors.username : ''}
          helper="3-20 characters, letters, numbers, and underscores only"
          autoComplete="username"
          minLength={3}
          maxLength={20}
        />

        {/* Email */}
        <Input
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter your email address"
          required
          error={touched.email ? errors.email : ''}
          helper="We'll never share your email"
          autoComplete="email"
        />

        {/* Password */}
        <Input
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter your password"
          required
          error={touched.password ? errors.password : ''}
          helper="Minimum 8 characters with uppercase, lowercase, number, and special character"
          autoComplete="new-password"
          minLength={8}
        />

        {/* Password Strength Indicator */}
        {formData.password && (
          <div className="password-strength">
            <div className="strength-bar">
              <div 
                className={`strength-fill strength-${passwordStrength.label.toLowerCase().replace(' ', '-')}`}
                style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
              />
            </div>
            <span className="strength-label">
              Password strength: <strong>{passwordStrength.label}</strong>
            </span>
          </div>
        )}

        {/* Confirm Password */}
        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Confirm your password"
          required
          error={touched.confirmPassword ? errors.confirmPassword : ''}
          autoComplete="new-password"
        />

        {/* Terms Checkbox */}
        <div className="form-checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
              onBlur={handleBlur}
              className="checkbox-input"
            />
            <span className="checkbox-custom"></span>
            <span className="checkbox-text">
              I agree to the <a href="#" className="checkbox-link">Terms and Conditions</a>
              {touched.terms && errors.terms && (
                <span className="checkbox-error"> — {errors.terms}</span>
              )}
            </span>
          </label>
        </div>

        {/* Subscribe Checkbox */}
        <div className="form-checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="subscribe"
              checked={formData.subscribe}
              onChange={handleChange}
              className="checkbox-input"
            />
            <span className="checkbox-custom"></span>
            <span className="checkbox-text">
              Subscribe to our newsletter for updates
            </span>
          </label>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            loading={isSubmitting}
            disabled={!isValid && Object.keys(touched).length > 0}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </Button>
          
          <Button
            type="reset"
            variant="ghost"
            size="medium"
            disabled={isSubmitting}
          >
            Reset Form
          </Button>
        </div>

        {/* Footer */}
        <div className="form-footer">
          <p>
            Already have an account? <a href="#" className="form-link">Sign in</a>
          </p>
          <p className="form-note">
            By creating an account, you agree to our 
            <a href="#" className="form-link"> Privacy Policy</a>
          </p>
        </div>
      </form>
    </div>
  );
}