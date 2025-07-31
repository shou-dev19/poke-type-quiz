/**
 * Vue.js Application Entry Point
 * Initializes the Pokemon Type Quiz frontend application
 */

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Import global styles
import './assets/styles.css';

// Import application layer for dependency injection
import { ApplicationFactory } from '@/application';

// Create Vue application
const app = createApp(App);

// Install router
app.use(router);

// Global error handler
app.config.errorHandler = (err, instance, info) => {
  console.error('Vue error:', err);
  console.error('Component instance:', instance);
  console.error('Error info:', info);
};

// Performance monitoring in development
if (import.meta.env.DEV) {
  app.config.performance = true;
}

// Global properties for application services
app.config.globalProperties.$app = ApplicationFactory;

// Initialize application and mount
async function initializeApp() {
  try {
    // Initialize the application layer
    const appInstance = await ApplicationFactory.getInstance();
    
    // Provide application instance to all components
    app.provide('app', appInstance);
    
    // Mount the application
    app.mount('#app');
    
    console.log('Pokemon Type Quiz application initialized successfully');
  } catch (error) {
    console.error('Failed to initialize application:', error);
    
    // Show error page
    document.getElementById('app')!.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background-color: #f9fafb;
        font-family: system-ui, -apple-system, sans-serif;
        text-align: center;
        padding: 2rem;
      ">
        <div style="
          background: white;
          padding: 2rem;
          border-radius: 0.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          max-width: 400px;
        ">
          <div style="font-size: 3rem; margin-bottom: 1rem;">❌</div>
          <h1 style="font-size: 1.5rem; font-weight: bold; color: #ef4444; margin-bottom: 1rem;">
            Application Failed to Load
          </h1>
          <p style="color: #6b7280; margin-bottom: 1.5rem;">
            There was an error initializing the Pokemon Type Quiz application.
          </p>
          <button 
            onclick="window.location.reload()"
            style="
              background-color: #3b82f6;
              color: white;
              padding: 0.5rem 1rem;
              border: none;
              border-radius: 0.375rem;
              cursor: pointer;
              font-weight: 500;
            "
          >
            Reload Page
          </button>
        </div>
      </div>
    `;
  }
}

// Start the application
initializeApp();