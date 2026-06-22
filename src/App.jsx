/**
 * Main App Component
 * Showcases all 7 components in one place
 * Demonstrates: component composition, state management
 */
import { useState } from 'react';
import './App.css';

// Import all components
import Counter from './components/Counter/Counter';
import SearchTable from './components/SearchTable/SearchTable';
import Modal from './components/Modal/Modal';
import Button from './components/Button/Button';
import Input from './components/Input/Input';
import Form from './components/Form/Form';
import Dashboard from './components/Dashboard/Dashboard';
import Pagination from './components/Pagination/Pagination';

function App() {
  // ============================================
  // STATE
  // ============================================
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Sample data for pagination demo
  const sampleItems = Array.from({ length: 87 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    description: `This is description for item ${i + 1}`
  }));
  
  const paginatedItems = sampleItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ============================================
  // HANDLERS
  // ============================================
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1>🚀 React Components Showcase</h1>
          <p>7 Essential Components Built with React Hooks</p>
          <div className="header-badges">
            <span className="badge">useState</span>
            <span className="badge">useEffect</span>
            <span className="badge">useMemo</span>
            <span className="badge">useCallback</span>
            <span className="badge">useRef</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        
        {/* ============================================
            SECTION 1: COUNTER
            ============================================ */}
        <section className="component-section" id="counter">
          <div className="section-header">
            <h2>1. Counter Component</h2>
            <span className="section-badge">Interactive</span>
          </div>
          <div className="section-description">
            <p>A counter with step control, reset functionality, and conditional rendering.</p>
            <p className="features">
              <span>✅ useState</span>
              <span>✅ useCallback</span>
              <span>✅ Conditional Rendering</span>
            </p>
          </div>
          <Counter />
        </section>

        {/* ============================================
            SECTION 2: SEARCH TABLE
            ============================================ */}
        <section className="component-section" id="search-table">
          <div className="section-header">
            <h2>2. Search/Filter Table</h2>
            <span className="section-badge">Data Grid</span>
          </div>
          <div className="section-description">
            <p>A data table with search, filter, sorting, and status indicators.</p>
            <p className="features">
              <span>✅ useState</span>
              <span>✅ useMemo</span>
              <span>✅ Array Methods</span>
            </p>
          </div>
          <SearchTable />
        </section>

        {/* ============================================
            SECTION 3: MODAL
            ============================================ */}
        <section className="component-section" id="modal">
          <div className="section-header">
            <h2>3. Modal Component</h2>
            <span className="section-badge">Overlay</span>
          </div>
          <div className="section-description">
            <p>A reusable modal with keyboard support, focus trapping, and multiple sizes.</p>
            <p className="features">
              <span>✅ useRef</span>
              <span>✅ useEffect</span>
              <span>✅ Focus Management</span>
            </p>
          </div>
          
          {/* Modal Demo */}
          <div className="modal-demo">
            <Button 
              variant="primary" 
              onClick={() => setIsModalOpen(true)}
            >
              🚀 Open Modal
            </Button>
            
            <div className="modal-sizes-demo">
              <span>Available sizes:</span>
              <Button variant="outline" size="small">Small</Button>
              <Button variant="outline" size="small">Medium</Button>
              <Button variant="outline" size="small">Large</Button>
            </div>
          </div>

          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Welcome to the Modal!"
            size="medium"
            closeOnOverlayClick={true}
          >
            <div className="modal-demo-content">
              <p>🎉 This is a fully-featured modal component!</p>
              <ul>
                <li>✅ Press <kbd>ESC</kbd> to close</li>
                <li>✅ Click outside to close</li>
                <li>✅ Focus trapping for accessibility</li>
                <li>✅ Responsive and customizable</li>
              </ul>
              <div className="modal-demo-actions">
                <Button 
                  variant="success" 
                  onClick={() => alert('Action performed!')}
                >
                  Confirm Action
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </Modal>
        </section>

        {/* ============================================
            SECTION 4: BUTTON & INPUT COMPONENTS
            ============================================ */}
        <section className="component-section" id="button-input">
          <div className="section-header">
            <h2>4. Reusable Button & Input</h2>
            <span className="section-badge">UI Library</span>
          </div>
          <div className="section-description">
            <p>Fully customizable button and input components with multiple variants and states.</p>
            <p className="features">
              <span>✅ Variants</span>
              <span>✅ Sizes</span>
              <span>✅ Loading States</span>
            </p>
          </div>

          {/* Button Showcase */}
          <div className="component-showcase">
            <div className="showcase-group">
              <h4>Button Variants</h4>
              <div className="button-group">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="success">Success</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="warning">Warning</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </div>

            <div className="showcase-group">
              <h4>Button Sizes</h4>
              <div className="button-group">
                <Button size="small">Small</Button>
                <Button size="medium">Medium</Button>
                <Button size="large">Large</Button>
              </div>
            </div>

            <div className="showcase-group">
              <h4>Button States</h4>
              <div className="button-group">
                <Button loading>Loading</Button>
                <Button disabled>Disabled</Button>
                <Button icon="⭐">With Icon</Button>
              </div>
            </div>

            {/* Input Showcase */}
            <div className="showcase-group">
              <h4>Input Examples</h4>
              <div className="input-group-demo">
                <Input 
                  label="Text Input"
                  placeholder="Enter text..."
                  helper="This is a helper text"
                />
                <Input 
                  label="Email Input"
                  type="email"
                  placeholder="Enter email..."
                  error="Invalid email address"
                />
                <Input 
                  label="Password Input"
                  type="password"
                  placeholder="Enter password..."
                />
                <Input 
                  label="Disabled Input"
                  placeholder="Cannot edit this"
                  disabled
                />
              </div>
            </div>
          </div>
        </section>

        {/* ============================================
            SECTION 5: FORM WITH VALIDATION
            ============================================ */}
        <section className="component-section" id="form">
          <div className="section-header">
            <h2>5. Form with Validation</h2>
            <span className="section-badge">Form</span>
          </div>
          <div className="section-description">
            <p>A complete form with real-time validation, password strength indicator, and submission handling.</p>
            <p className="features">
              <span>✅ Validation</span>
              <span>✅ Password Strength</span>
              <span>✅ Error Handling</span>
            </p>
          </div>
          <Form />
        </section>

        {/* ============================================
            SECTION 6: DASHBOARD
            ============================================ */}
        <section className="component-section" id="dashboard">
          <div className="section-header">
            <h2>6. Dashboard Component</h2>
            <span className="section-badge">Analytics</span>
          </div>
          <div className="section-description">
            <p>A dashboard with metric cards, activity feed, loading states, and error handling.</p>
            <p className="features">
              <span>✅ useState</span>
              <span>✅ useEffect</span>
              <span>✅ useMemo</span>
              <span>✅ API Simulation</span>
            </p>
          </div>
          <Dashboard />
        </section>

        {/* ============================================
            SECTION 7: PAGINATION
            ============================================ */}
        <section className="component-section" id="pagination">
          <div className="section-header">
            <h2>7. Pagination Component</h2>
            <span className="section-badge">Navigation</span>
          </div>
          <div className="section-description">
            <p>A reusable pagination component with multiple variants, page size control, and accessibility.</p>
            <p className="features">
              <span>✅ useMemo</span>
              <span>✅ useCallback</span>
              <span>✅ Keyboard Navigation</span>
            </p>
          </div>

          {/* Pagination Demo */}
          <div className="pagination-demo">
            <div className="pagination-items">
              {paginatedItems.map(item => (
                <div key={item.id} className="pagination-item-demo">
                  <span className="item-id">#{item.id}</span>
                  <span className="item-name">{item.name}</span>
                  <span className="item-desc">{item.description}</span>
                </div>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalItems={sampleItems.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              itemsPerPageOptions={[5, 10, 20, 50]}
              variant="default"
              showInfo={true}
              showItemsPerPage={true}
            />
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>Built with ❤️ using React + Vite</p>
        <p className="footer-links">
          <a href="#counter">Counter</a>
          <a href="#search-table">Search</a>
          <a href="#modal">Modal</a>
          <a href="#button-input">UI</a>
          <a href="#form">Form</a>
          <a href="#dashboard">Dashboard</a>
          <a href="#pagination">Pagination</a>
        </p>
      </footer>
    </div>
  );
}

export default App;