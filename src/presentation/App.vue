<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-blue-600 text-white shadow-lg">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="text-3xl">🎯</div>
            <div>
              <h1 class="text-2xl font-bold">Pokemon Type Quiz</h1>
              <p class="text-blue-200">Master the type effectiveness system</p>
            </div>
          </div>
          <nav class="hidden md:flex space-x-6">
            <router-link 
              to="/" 
              class="hover:text-blue-200 transition-colors"
              active-class="text-yellow-300"
            >
              Home
            </router-link>
            <router-link 
              to="/quiz" 
              class="hover:text-blue-200 transition-colors"
              active-class="text-yellow-300"
            >
              Quiz
            </router-link>
            <router-link 
              to="/types" 
              class="hover:text-blue-200 transition-colors"
              active-class="text-yellow-300"
            >
              Types
            </router-link>
            <router-link 
              to="/stats" 
              class="hover:text-blue-200 transition-colors"
              active-class="text-yellow-300"
            >
              Statistics
            </router-link>
          </nav>
          <button 
            @click="toggleMobileMenu"
            class="md:hidden text-white hover:text-blue-200"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
        
        <!-- Mobile Menu -->
        <div v-if="showMobileMenu" class="md:hidden mt-4 pt-4 border-t border-blue-500">
          <nav class="flex flex-col space-y-2">
            <router-link 
              to="/" 
              @click="closeMobileMenu"
              class="py-2 hover:text-blue-200 transition-colors"
              active-class="text-yellow-300"
            >
              Home
            </router-link>
            <router-link 
              to="/quiz" 
              @click="closeMobileMenu"
              class="py-2 hover:text-blue-200 transition-colors"
              active-class="text-yellow-300"
            >
              Quiz
            </router-link>
            <router-link 
              to="/types" 
              @click="closeMobileMenu"
              class="py-2 hover:text-blue-200 transition-colors"
              active-class="text-yellow-300"
            >
              Types
            </router-link>
            <router-link 
              to="/stats" 
              @click="closeMobileMenu"
              class="py-2 hover:text-blue-200 transition-colors"
              active-class="text-yellow-300"
            >
              Statistics
            </router-link>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white mt-16">
      <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="text-lg font-semibold mb-4">Pokemon Type Quiz</h3>
            <p class="text-gray-400">
              Learn and master Pokemon type effectiveness with interactive quizzes and comprehensive type information.
            </p>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Features</h3>
            <ul class="text-gray-400 space-y-2">
              <li>Interactive Quiz System</li>
              <li>Comprehensive Type Database</li>
              <li>Performance Statistics</li>
              <li>Progress Tracking</li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Architecture</h3>
            <ul class="text-gray-400 space-y-2">
              <li>Clean Architecture</li>
              <li>TypeScript + Vue.js</li>
              <li>Comprehensive Testing</li>
              <li>Modern Development</li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Pokemon Type Quiz. Built with Clean Architecture principles.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Mobile menu state
const showMobileMenu = ref(false);

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

const closeMobileMenu = () => {
  showMobileMenu.value = false;
};
</script>

<style scoped>
/* Component-specific styles */
.router-link-active {
  @apply font-medium;
}

/* Mobile-first responsive design */
.container {
  max-width: 1200px;
}

/* Custom animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>