/**
 * Pagination Component
 * A reusable pagination component with multiple styles
 * Demonstrates: useMemo, useCallback, event handling
 */
import { useMemo, useCallback } from 'react';
import './Pagination.css';

export default function Pagination({
  // Current page (1-indexed)
  currentPage = 1,
  
  // Total number of items
  totalItems = 0,
  
  // Items per page
  itemsPerPage = 10,
  
  // Number of page buttons to show
  siblingCount = 1,
  
  // Event handlers
  onPageChange,
  onItemsPerPageChange,
  
  // Options for items per page
  itemsPerPageOptions = [5, 10, 20, 50, 100],
  
  // Custom labels
  labels = {
    first: '« First',
    last: 'Last »',
    prev: '‹ Previous',
    next: 'Next ›',
  },
  
  // Styling
  variant = 'default', // 'default', 'compact', 'minimal'
  className = '',
  
  // Show info text
  showInfo = true,
  showItemsPerPage = true,
  
  // Disabled state
  disabled = false,
}) {
  // ============================================
  // COMPUTED VALUES
  // ============================================
  
  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / itemsPerPage);
  }, [totalItems, itemsPerPage]);

  const startItem = useMemo(() => {
    return (currentPage - 1) * itemsPerPage + 1;
  }, [currentPage, itemsPerPage]);

  const endItem = useMemo(() => {
    return Math.min(currentPage * itemsPerPage, totalItems);
  }, [currentPage, itemsPerPage, totalItems]);

  /**
   * Generate page range to display
   * Uses siblingCount to show pages around current page
   */
  const pageRange = useMemo(() => {
    const range = [];
    const totalPageNumbers = siblingCount * 2 + 3; // siblings + current + first + last
    
    // If total pages is small, show all pages
    if (totalPages <= totalPageNumbers) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
      return range;
    }

    // Calculate left and right sibling indices
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    // Determine if we should show dots
    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    // Build the range
    if (!showLeftDots && showRightDots) {
      // Show first pages, then dots, then last page
      const leftItems = 3 + 2 * siblingCount;
      for (let i = 1; i <= leftItems; i++) {
        range.push(i);
      }
      range.push('dots');
      range.push(totalPages);
    } else if (showLeftDots && !showRightDots) {
      // Show first page, dots, then last pages
      range.push(1);
      range.push('dots');
      const rightItems = 3 + 2 * siblingCount;
      for (let i = totalPages - rightItems + 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else if (showLeftDots && showRightDots) {
      // Show first page, dots, middle pages, dots, last page
      range.push(1);
      range.push('dots');
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        range.push(i);
      }
      range.push('dots');
      range.push(totalPages);
    }

    return range;
  }, [currentPage, totalPages, siblingCount]);

  // ============================================
  // EVENT HANDLERS
  // ============================================
  
  /**
   * Handle page change
   * Validates page number before calling callback
   */
  const handlePageChange = useCallback((page) => {
    if (disabled) return;
    if (page === currentPage) return;
    if (page < 1 || page > totalPages) return;
    if (onPageChange) onPageChange(page);
  }, [currentPage, totalPages, onPageChange, disabled]);

  /**
   * Handle items per page change
   */
  const handleItemsPerPageChange = useCallback((e) => {
    if (disabled) return;
    const newValue = Number(e.target.value);
    if (onItemsPerPageChange) onItemsPerPageChange(newValue);
  }, [onItemsPerPageChange, disabled]);

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = useCallback((e, page) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handlePageChange(page);
    }
  }, [handlePageChange]);

  // ============================================
  // HELPER FUNCTIONS
  // ============================================
  
  /**
   * Check if a page button should be active
   */
  const isActive = useCallback((page) => {
    return page === currentPage;
  }, [currentPage]);

  /**
   * Check if a page button should be disabled
   */
  const isDisabled = useCallback((page) => {
    if (disabled) return true;
    if (page === 'dots') return true;
    return false;
  }, [disabled]);

  // ============================================
  // RENDER
  // ============================================
  
  // Don't render if there's nothing to paginate
  if (totalItems === 0 || totalPages === 1) {
    return (
      <div className={`pagination-wrapper ${variant} ${className}`}>
        {showInfo && (
          <div className="pagination-info">
            Showing {totalItems} items
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`pagination-wrapper ${variant} ${className}`}>
      {/* Items Per Page Selector */}
      {showItemsPerPage && (
        <div className="pagination-controls-left">
          <label className="items-per-page-label">
            Show
            <select
              className="items-per-page-select"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              disabled={disabled}
            >
              {itemsPerPageOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            entries
          </label>
        </div>
      )}

      {/* Pagination Buttons */}
      <nav className="pagination-nav" aria-label="Pagination navigation">
        <ul className="pagination-list">
          {/* First Page Button */}
          <li className="pagination-item">
            <button
              className="pagination-btn pagination-first"
              onClick={() => handlePageChange(1)}
              onKeyDown={(e) => handleKeyDown(e, 1)}
              disabled={isDisabled(1) || currentPage === 1}
              aria-label="Go to first page"
            >
              {labels.first}
            </button>
          </li>

          {/* Previous Page Button */}
          <li className="pagination-item">
            <button
              className="pagination-btn pagination-prev"
              onClick={() => handlePageChange(currentPage - 1)}
              onKeyDown={(e) => handleKeyDown(e, currentPage - 1)}
              disabled={isDisabled(currentPage - 1) || currentPage === 1}
              aria-label="Go to previous page"
            >
              {labels.prev}
            </button>
          </li>

          {/* Page Number Buttons */}
          {pageRange.map((page, index) => {
            if (page === 'dots') {
              return (
                <li key={`dots-${index}`} className="pagination-item pagination-dots">
                  <span className="pagination-dots-text" aria-hidden="true">…</span>
                </li>
              );
            }

            return (
              <li key={page} className="pagination-item">
                <button
                  className={`pagination-btn pagination-number ${isActive(page) ? 'active' : ''}`}
                  onClick={() => handlePageChange(page)}
                  onKeyDown={(e) => handleKeyDown(e, page)}
                  disabled={isDisabled(page)}
                  aria-current={isActive(page) ? 'page' : undefined}
                  aria-label={`Go to page ${page}`}
                >
                  {page}
                </button>
              </li>
            );
          })}

          {/* Next Page Button */}
          <li className="pagination-item">
            <button
              className="pagination-btn pagination-next"
              onClick={() => handlePageChange(currentPage + 1)}
              onKeyDown={(e) => handleKeyDown(e, currentPage + 1)}
              disabled={isDisabled(currentPage + 1) || currentPage === totalPages}
              aria-label="Go to next page"
            >
              {labels.next}
            </button>
          </li>

          {/* Last Page Button */}
          <li className="pagination-item">
            <button
              className="pagination-btn pagination-last"
              onClick={() => handlePageChange(totalPages)}
              onKeyDown={(e) => handleKeyDown(e, totalPages)}
              disabled={isDisabled(totalPages) || currentPage === totalPages}
              aria-label="Go to last page"
            >
              {labels.last}
            </button>
          </li>
        </ul>
      </nav>

      {/* Info Text */}
      {showInfo && (
        <div className="pagination-info">
          Showing {startItem} to {endItem} of {totalItems} items
          {totalPages > 1 && (
            <span className="pagination-pages-info">
              (Page {currentPage} of {totalPages})
            </span>
          )}
        </div>
      )}
    </div>
  );
}