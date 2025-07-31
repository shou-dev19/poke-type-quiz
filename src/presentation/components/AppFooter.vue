<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="footer-grid">
        <!-- Brand Section -->
        <div class="footer-section">
          <div class="footer-brand">
            <div class="brand-icon">🎯</div>
            <h3 class="brand-title">Pokemon Type Quiz</h3>
          </div>
          <p class="brand-description">
            Learn and master Pokemon type effectiveness with interactive quizzes, 
            comprehensive type information, and progress tracking.
          </p>
          <div class="social-links">
            <a href="#" class="social-link" aria-label="GitHub">
              <span class="social-icon">📝</span>
            </a>
            <a href="#" class="social-link" aria-label="Documentation">
              <span class="social-icon">📚</span>
            </a>
            <a href="#" class="social-link" aria-label="Support">
              <span class="social-icon">💬</span>
            </a>
          </div>
        </div>

        <!-- Features Section -->
        <div class="footer-section">
          <h4 class="section-title">Features</h4>
          <ul class="footer-list">
            <li class="footer-list-item">
              <span class="list-icon">🎮</span>
              <span>Interactive Quiz System</span>
            </li>
            <li class="footer-list-item">
              <span class="list-icon">📖</span>
              <span>Type Database</span>
            </li>
            <li class="footer-list-item">
              <span class="list-icon">📊</span>
              <span>Performance Analytics</span>
            </li>
            <li class="footer-list-item">
              <span class="list-icon">🎯</span>
              <span>Progress Tracking</span>
            </li>
          </ul>
        </div>

        <!-- Navigation Section -->
        <div class="footer-section">
          <h4 class="section-title">Quick Links</h4>
          <ul class="footer-list">
            <li class="footer-list-item">
              <router-link to="/" class="footer-link">
                <span class="list-icon">🏠</span>
                <span>Home</span>
              </router-link>
            </li>
            <li class="footer-list-item">
              <router-link to="/quiz" class="footer-link">
                <span class="list-icon">🎮</span>
                <span>Start Quiz</span>
              </router-link>
            </li>
            <li class="footer-list-item">
              <router-link to="/types" class="footer-link">
                <span class="list-icon">📚</span>
                <span>Browse Types</span>
              </router-link>
            </li>
            <li class="footer-list-item">
              <router-link to="/statistics" class="footer-link">
                <span class="list-icon">📊</span>
                <span>View Statistics</span>
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Technical Section -->
        <div class="footer-section">
          <h4 class="section-title">Architecture</h4>
          <ul class="footer-list">
            <li class="footer-list-item">
              <span class="list-icon">🏗️</span>
              <span>Clean Architecture</span>
            </li>
            <li class="footer-list-item">
              <span class="list-icon">⚡</span>
              <span>Vue.js 3 + TypeScript</span>
            </li>
            <li class="footer-list-item">
              <span class="list-icon">🧪</span>
              <span>Comprehensive Testing</span>
            </li>
            <li class="footer-list-item">
              <span class="list-icon">🚀</span>
              <span>Modern Development</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <div class="copyright">
          <p>&copy; {{ currentYear }} Pokemon Type Quiz. Built with Clean Architecture principles.</p>
        </div>
        <div class="footer-links">
          <a href="#" class="footer-bottom-link">Privacy Policy</a>
          <a href="#" class="footer-bottom-link">Terms of Service</a>
          <a href="#" class="footer-bottom-link">Contact</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
.app-footer {
  @apply bg-gradient-to-r from-gray-900 to-gray-800 text-white mt-20;
}

.footer-content {
  @apply container mx-auto px-4 py-16;
}

.footer-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12;
}

/* Footer Sections */
.footer-section {
  @apply space-y-6;
}

/* Brand Section */
.footer-brand {
  @apply flex items-center space-x-3 mb-4;
}

.brand-icon {
  @apply text-3xl;
}

.brand-title {
  @apply text-xl font-bold;
}

.brand-description {
  @apply text-gray-300 leading-relaxed mb-6;
}

.social-links {
  @apply flex space-x-4;
}

.social-link {
  @apply w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors text-decoration-none;
}

.social-icon {
  @apply text-lg;
}

/* Section Titles */
.section-title {
  @apply text-lg font-bold mb-4 text-gray-100;
}

/* Footer Lists */
.footer-list {
  @apply space-y-3;
}

.footer-list-item {
  @apply flex items-center space-x-3 text-gray-300;
}

.list-icon {
  @apply text-base flex-shrink-0;
}

.footer-link {
  @apply flex items-center space-x-3 text-gray-300 hover:text-white transition-colors text-decoration-none;
}

/* Footer Bottom */
.footer-bottom {
  @apply border-t border-gray-700 pt-8 flex flex-col md:flex-row items-center justify-between gap-4;
}

.copyright {
  @apply text-gray-400 text-sm;
}

.footer-links {
  @apply flex space-x-6;
}

.footer-bottom-link {
  @apply text-gray-400 hover:text-white transition-colors text-sm text-decoration-none;
}

/* Hover Effects */
.footer-link:hover .list-icon {
  @apply transform scale-110;
}

.social-link:hover {
  @apply transform scale-110;
}

/* Responsive Design */
@media (max-width: 768px) {
  .footer-grid {
    @apply grid-cols-1 gap-8;
  }
  
  .footer-bottom {
    @apply flex-col text-center;
  }
  
  .footer-links {
    @apply flex-wrap justify-center;
  }
}

@media (max-width: 640px) {
  .footer-content {
    @apply py-12;
  }
  
  .social-links {
    @apply justify-center;
  }
  
  .footer-section {
    @apply text-center;
  }
}

/* Animation */
.list-icon,
.social-icon {
  transition: transform 0.2s ease;
}
</style>