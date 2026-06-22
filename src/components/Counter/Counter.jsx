/**
 * Counter Component
 * A simple counter with step control and additional features
 * Demonstrates: useState, useCallback, conditional rendering
 */
import { useState, useCallback } from 'react';
import './Counter.css';

export default function Counter() {
  // State for the current count value
  const [count, setCount] = useState(0);
  
  // State for the step size (how much to increment/decrement)
  const [step, setStep] = useState(1);

  /**
   * useCallback memoizes the increment function
   * It only recreates when 'step' changes
   * Uses functional update to avoid race conditions
   */
  const increment = useCallback(() => {
    setCount(prevCount => prevCount + step);
  }, [step]); // Dependency: step

  /**
   * useCallback memoizes the decrement function
   * It only recreates when 'step' changes
   */
  const decrement = useCallback(() => {
    setCount(prevCount => prevCount - step);
  }, [step]); // Dependency: step

  /**
   * useCallback memoizes the reset function
   * Empty dependency array means it never changes
   */
  const reset = useCallback(() => {
    setCount(0);
  }, []); // No dependencies

  // Handle step input change with validation
  const handleStepChange = (e) => {
    const value = Number(e.target.value);
    // Ensure step is between 1 and 10
    if (value >= 1 && value <= 10) {
      setStep(value);
    }
  };

  // Conditional rendering: determine count status
  const getCountStatus = () => {
    if (count === 0) return 'Zero';
    if (count > 0) return 'Positive';
    return 'Negative';
  };

  return (
    <div className="counter-container">
      <h2>🔢 Counter</h2>
      
      {/* Display the current count with conditional styling */}
      <div className="counter-display">
        <span 
          className={`counter-value ${count > 0 ? 'positive' : count < 0 ? 'negative' : 'zero'}`}
        >
          {count}
        </span>
      </div>

      {/* Control buttons with event handlers */}
      <div className="counter-controls">
        <button 
          onClick={decrement} 
          className="btn-decrement"
          aria-label="Decrease count"
        >
          −
        </button>
        <button 
          onClick={increment} 
          className="btn-increment"
          aria-label="Increase count"
        >
          +
        </button>
      </div>

      {/* Reset button - only shown when count is not zero */}
      {count !== 0 && (
        <div className="counter-actions">
          <button onClick={reset} className="btn-reset">
            🔄 Reset
          </button>
        </div>
      )}

      {/* Step size control with input binding */}
      <div className="counter-step">
        <label htmlFor="step-input">
          Step size:
          <input
            id="step-input"
            type="number"
            value={step}
            onChange={handleStepChange}
            min="1"
            max="10"
            step="1"
          />
        </label>
      </div>

      {/* Additional information with conditional rendering */}
      <div className="counter-info">
        <p>Status: <span className="status-badge">{getCountStatus()}</span></p>
        <p>Count is {count % 2 === 0 ? '✅ Even' : '❌ Odd'}</p>
        <p>Multiples of 5: {count % 5 === 0 && count !== 0 ? '🎯 Yes' : 'No'}</p>
      </div>
    </div>
  );
}