<template>
  <Transition name="back-to-top">
    <button
      v-if="isVisible"
      @click="scrollToTop"
      class="back-to-top-btn"
      aria-label="Back to top"
    >
      <span class="btn-icon">↑</span>
      <span class="btn-text">Top</span>
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const isVisible = ref(false);
const scrollThreshold = 400;

function handleScroll() {
  isVisible.value = window.scrollY > scrollThreshold;
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Check initial scroll position
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.back-to-top-btn {
  @apply fixed bottom-8 right-8 z-40 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center min-w-14 min-h-14;
}

.btn-icon {
  @apply text-lg font-bold leading-none;
}

.btn-text {
  @apply text-xs font-medium leading-none mt-1;
}

/* Hover Effects */
.back-to-top-btn:hover {
  @apply transform scale-110;
}

.back-to-top-btn:active {
  @apply transform scale-95;
}

/* Focus State */
.back-to-top-btn:focus {
  @apply outline-none ring-4 ring-blue-300 ring-opacity-50;
}

/* Transitions */
.back-to-top-enter-active,
.back-to-top-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.back-to-top-enter-from,
.back-to-top-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

/* Responsive Design */
@media (max-width: 640px) {
  .back-to-top-btn {
    @apply bottom-6 right-6 min-w-12 min-h-12 p-2;
  }
  
  .btn-icon {
    @apply text-base;
  }
  
  .btn-text {
    @apply text-2xs;
  }
}

/* Dark Mode Support (if needed) */
@media (prefers-color-scheme: dark) {
  .back-to-top-btn {
    @apply bg-gray-700 hover:bg-gray-600;
  }
}
</style>