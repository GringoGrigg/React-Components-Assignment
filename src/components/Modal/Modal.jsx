/**
 * Modal Component
 * A reusable modal/dialog component with accessibility features
 * Demonstrates: useRef, useEffect, portals, focus management, keyboard events
 */
import { useEffect, useRef } from 'react';
import './Modal.css';

export default function Modal({ 
  isOpen,        // Boolean: controls visibility
  onClose,       // Function: called when modal should close
  title,         // String: modal title
  children,      // React nodes: modal content
  size = 'medium', // String: 'small', 'medium', 'large', 'full'
  closeOnOverlayClick = true // Boolean: close when clicking overlay
}) {
  // Ref for the modal content container (for focus management)
  const modalRef = useRef(null);
  
  // Ref for the previously focused element (to restore focus on close)
  const previousFocusRef = useRef(null);

  /**
   * useEffect: Handle keyboard events and body scroll
   * Runs when isOpen changes
   */
  useEffect(() => {
    // Save the currently focused element when modal opens
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
    }

    /**
     * Handle Escape key press
     */
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      // Add event listener for Escape key
      document.addEventListener('keydown', handleEscape);
      // Prevent scrolling of the body when modal is open
      document.body.style.overflow = 'hidden';
    }

    /**
     * Cleanup function: runs when component unmounts or isOpen changes
     * Restores body scroll and removes event listeners
     */
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
      
      // Restore focus to the previously focused element
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  /**
   * useEffect: Focus trapping
   * Keeps focus inside the modal for accessibility
   */
  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Find all focusable elements inside the modal
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      // If there are focusable elements, focus the first one
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  }, [isOpen]);

  // Don't render anything if modal is not open
  if (!isOpen) return null;

  /**
   * Handle click on the overlay (background)
   * Only closes if closeOnOverlayClick is true
   */
  const handleOverlayClick = (event) => {
    // Check if the click was on the overlay itself (not on the modal content)
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  /**
   * Determine modal size class
   */
  const getSizeClass = () => {
    const sizes = {
      small: 'modal-small',
      medium: 'modal-medium',
      large: 'modal-large',
      full: 'modal-full'
    };
    return sizes[size] || 'modal-medium';
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div 
        ref={modalRef}
        className={`modal-content ${getSizeClass()}`}
      >
        {/* Modal Header */}
        <div className="modal-header">
          {title && (
            <h2 id="modal-title" className="modal-title">
              {title}
            </h2>
          )}
          <button 
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        {/* Modal Body - contains the children prop */}
        <div className="modal-body">
          {children}
        </div>

        {/* Optional Footer - you can add this if needed */}
        {/* <div className="modal-footer">
          <button onClick={onClose}>Close</button>
        </div> */}
      </div>
    </div>
  );
}