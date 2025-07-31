<template>
  <header class="app-header">
    <nav class="navbar">
      <div class="nav-container">
        <!-- Logo and Brand -->
        <router-link to="/" class="brand-link" @click="$emit('close-mobile-menu')">
          <div class="brand-content">
            <div class="brand-icon">🎯</div>
            <div class="brand-text">
              <h1 class="brand-title">Pokemon Type Quiz</h1>
              <p class="brand-subtitle">Master the type effectiveness system</p>
            </div>
          </div>
        </router-link>

        <!-- Desktop Navigation -->
        <div class="desktop-nav">
          <NavLink
            v-for="item in navigationItems"
            :key="item.path"
            :to="item.path"
            :icon="item.icon"
            :label="item.label"
            :badge="item.badge"
            class="nav-item"
          />
        </div>

        <!-- Mobile Menu Toggle -->
        <button
          @click="$emit('toggle-mobile-menu')"
          class="mobile-menu-toggle"
          :class="{ 'active': isMobileMenuOpen }"
          aria-label="Toggle mobile menu"
        >
          <div class="hamburger">
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
          </div>
        </button>
      </div>

      <!-- Mobile Navigation Overlay -->
      <Transition name="mobile-menu">
        <div v-if="isMobileMenuOpen" class="mobile-nav-overlay" @click="$emit('close-mobile-menu')">
          <div class="mobile-nav-content" @click.stop>
            <div class="mobile-nav-header">
              <div class="mobile-brand">
                <div class="brand-icon">🎯</div>
                <span class="brand-title">Pokemon Type Quiz</span>
              </div>
              <button
                @click="$emit('close-mobile-menu')"
                class="mobile-close-btn"
                aria-label="Close mobile menu"
              >
                ×
              </button>
            </div>
            
            <div class="mobile-nav-links">
              <NavLink
                v-for="item in navigationItems"
                :key="item.path"
                :to="item.path"
                :icon="item.icon"
                :label="item.label"
                :badge="item.badge"
                class="mobile-nav-item"
                mobile
                @click="$emit('close-mobile-menu')"
              />
            </div>
          </div>
        </div>
      </Transition>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import NavLink from './NavLink.vue';

interface Props {
  isMobileMenuOpen: boolean;
}

interface Emits {
  (e: 'toggle-mobile-menu'): void;
  (e: 'close-mobile-menu'): void;
}

defineProps<Props>();
defineEmits<Emits>();

const navigationItems = computed(() => [
  {
    path: '/',
    icon: '🏠',
    label: 'Home',
    badge: null
  },
  {
    path: '/quiz',
    icon: '🎮',
    label: 'Quiz',
    badge: null
  },
  {
    path: '/types',
    icon: '📚',
    label: 'Types',
    badge: null
  },
  {
    path: '/statistics',
    icon: '📊',
    label: 'Statistics',
    badge: null
  }
]);
</script>

<style scoped>
.app-header {
  @apply fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b border-gray-200;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.navbar {
  @apply relative;
}

.nav-container {
  @apply container mx-auto px-4 py-4 flex items-center justify-between;
}

/* Brand Styling */
.brand-link {
  @apply flex items-center space-x-3 text-decoration-none hover:opacity-80 transition-opacity;
}

.brand-content {
  @apply flex items-center space-x-3;
}

.brand-icon {
  @apply text-3xl;
}

.brand-text {
  @apply hidden sm:block;
}

.brand-title {
  @apply text-xl font-bold text-gray-900 leading-tight;
}

.brand-subtitle {
  @apply text-sm text-gray-600;
}

/* Desktop Navigation */
.desktop-nav {
  @apply hidden md:flex items-center space-x-8;
}

.nav-item {
  @apply transition-all duration-200;
}

/* Mobile Menu Toggle */
.mobile-menu-toggle {
  @apply md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors;
}

.hamburger {
  @apply w-6 h-6 flex flex-col justify-center items-center;
}

.hamburger-line {
  @apply w-6 h-0.5 bg-gray-700 transition-all duration-300 origin-center;
}

.hamburger-line:not(:last-child) {
  @apply mb-1;
}

.mobile-menu-toggle.active .hamburger-line:nth-child(1) {
  @apply transform rotate-45 translate-y-1.5;
}

.mobile-menu-toggle.active .hamburger-line:nth-child(2) {
  @apply opacity-0;
}

.mobile-menu-toggle.active .hamburger-line:nth-child(3) {
  @apply transform -rotate-45 -translate-y-1.5;
}

/* Mobile Navigation Overlay */
.mobile-nav-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden;
}

.mobile-nav-content {
  @apply absolute top-0 right-0 w-80 max-w-sm h-full bg-white shadow-2xl;
}

.mobile-nav-header {
  @apply flex items-center justify-between p-6 border-b border-gray-200;
}

.mobile-brand {
  @apply flex items-center space-x-3;
}

.mobile-close-btn {
  @apply w-8 h-8 flex items-center justify-center text-2xl text-gray-500 hover:text-gray-700 transition-colors;
}

.mobile-nav-links {
  @apply p-6 space-y-2;
}

.mobile-nav-item {
  @apply w-full;
}

/* Mobile Menu Transitions */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.3s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
}

.mobile-menu-enter-active .mobile-nav-content,
.mobile-menu-leave-active .mobile-nav-content {
  transition: transform 0.3s ease;
}

.mobile-menu-enter-from .mobile-nav-content,
.mobile-menu-leave-to .mobile-nav-content {
  transform: translateX(100%);
}

/* Responsive Design */
@media (max-width: 640px) {
  .brand-text {
    @apply hidden;
  }
  
  .mobile-nav-content {
    @apply w-full;
  }
}
</style>