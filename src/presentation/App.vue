<template>
  <div id="app" class="app-container">
    <!-- Navigation Header -->
    <AppNavigation 
      :is-mobile-menu-open="showMobileMenu"
      @toggle-mobile-menu="toggleMobileMenu"
      @close-mobile-menu="closeMobileMenu"
    />

    <!-- Breadcrumb Navigation -->
    <BreadcrumbNavigation 
      v-if="showBreadcrumbs"
      :items="breadcrumbItems"
    />

    <!-- Main Content Area -->
    <main class="main-content">
      <router-view v-slot="{ Component, route }">
        <Transition :name="getTransitionName(route)" mode="out-in" appear>
          <component :is="Component" :key="route.path" />
        </Transition>
      </router-view>
    </main>

    <!-- Back to Top Button -->
    <BackToTopButton v-if="showBackToTop" />

    <!-- Footer -->
    <AppFooter />

    <!-- Loading Bar -->
    <div v-if="isNavigating" class="loading-bar"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppNavigation from './components/AppNavigation.vue';
import BreadcrumbNavigation from './components/BreadcrumbNavigation.vue';
import BackToTopButton from './components/BackToTopButton.vue';
import AppFooter from './components/AppFooter.vue';

const route = useRoute();
const router = useRouter();

// Navigation state
const showMobileMenu = ref(false);
const isNavigating = ref(false);
const showBackToTop = ref(false);

// Breadcrumb configuration
const showBreadcrumbs = computed(() => {
  return route.path !== '/' && route.meta?.showBreadcrumbs !== false;
});

const breadcrumbItems = computed(() => {
  const items = [];
  const pathSegments = route.path.split('/').filter(segment => segment);
  
  // Always include home
  items.push({
    path: '/',
    label: 'Home',
    icon: '🏠',
    current: false
  });
  
  // Add path segments
  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === pathSegments.length - 1;
    
    items.push({
      path: currentPath,
      label: getBreadcrumbLabel(segment, route),
      icon: getBreadcrumbIcon(segment),
      current: isLast
    });
  });
  
  return items;
});

// Mobile menu handlers
function toggleMobileMenu() {
  showMobileMenu.value = !showMobileMenu.value;
}

function closeMobileMenu() {
  showMobileMenu.value = false;
}

// Route transition names
function getTransitionName(route: any) {
  return route.meta?.transition || 'fade';
}

// Breadcrumb helpers
function getBreadcrumbLabel(segment: string, route: any): string {
  const labelMap: Record<string, string> = {
    quiz: 'Quiz',
    types: 'Types',
    statistics: 'Statistics'
  };
  
  return route.meta?.breadcrumbLabel || labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
}

function getBreadcrumbIcon(segment: string): string {
  const iconMap: Record<string, string> = {
    quiz: '🎮',
    types: '📚',
    statistics: '📊'
  };
  
  return iconMap[segment] || '📄';
}

// Scroll tracking for back to top button
function handleScroll() {
  showBackToTop.value = window.scrollY > 400;
}

// Navigation loading state
router.beforeResolve((to, from) => {
  if (to.path !== from.path) {
    isNavigating.value = true;
  }
});

router.afterEach(() => {
  isNavigating.value = false;
  // Close mobile menu on navigation
  closeMobileMenu();
  // Scroll to top on route change (optional)
  if (route.meta?.scrollToTop !== false) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

// Close mobile menu when clicking outside or pressing Escape
function handleGlobalClick(event: MouseEvent) {
  if (showMobileMenu.value && !(event.target as Element)?.closest('.mobile-nav-content')) {
    closeMobileMenu();
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && showMobileMenu.value) {
    closeMobileMenu();
  }
}

// Lifecycle
onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  document.addEventListener('click', handleGlobalClick);
  document.addEventListener('keydown', handleKeydown);
  handleScroll(); // Check initial scroll position
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  document.removeEventListener('click', handleGlobalClick);
  document.removeEventListener('keydown', handleKeydown);
});

// Prevent body scroll when mobile menu is open
watch(showMobileMenu, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});
</script>

<style scoped>
.app-container {
  @apply min-h-screen bg-gray-50 flex flex-col;
}

.main-content {
  @apply flex-1 pt-20;
}

/* Loading Bar */
.loading-bar {
  @apply fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 z-50;
  animation: loading 2s ease-in-out infinite;
}

@keyframes loading {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Route Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(50px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-50px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(50px);
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.scale-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.scale-leave-to {
  opacity: 0;
  transform: scale(1.1);
}

/* Responsive Container */
.container {
  @apply max-w-7xl;
}

/* Focus Management */
.app-container:focus-within {
  @apply outline-none;
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active,
  .slide-left-enter-active,
  .slide-left-leave-active,
  .slide-right-enter-active,
  .slide-right-leave-active,
  .scale-enter-active,
  .scale-leave-active {
    transition: none;
  }
  
  .loading-bar {
    animation: none;
  }
}

/* Print Styles */
@media print {
  .app-header,
  .breadcrumb-nav,
  .back-to-top-btn,
  .app-footer {
    @apply hidden;
  }
  
  .main-content {
    @apply pt-0;
  }
}
</style>