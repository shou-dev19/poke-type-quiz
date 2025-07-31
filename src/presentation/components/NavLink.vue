<template>
  <router-link
    :to="to"
    :class="navLinkClass"
    @click="handleClick"
  >
    <span v-if="icon" class="nav-icon">{{ icon }}</span>
    <span class="nav-label">{{ label }}</span>
    <span v-if="badge" class="nav-badge">{{ badge }}</span>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

interface Props {
  to: string;
  icon?: string;
  label: string;
  badge?: string | number | null;
  mobile?: boolean;
}

interface Emits {
  (e: 'click'): void;
}

const props = withDefaults(defineProps<Props>(), {
  mobile: false
});

const emit = defineEmits<Emits>();
const route = useRoute();

const isActive = computed(() => {
  if (props.to === '/') {
    return route.path === '/';
  }
  return route.path.startsWith(props.to);
});

const navLinkClass = computed(() => {
  const baseClasses = 'nav-link';
  const mobileClasses = props.mobile ? 'mobile' : 'desktop';
  const activeClass = isActive.value ? 'active' : '';
  
  return `${baseClasses} ${mobileClasses} ${activeClass}`;
});

function handleClick() {
  emit('click');
}
</script>

<style scoped>
.nav-link {
  @apply flex items-center text-decoration-none transition-all duration-200 font-medium;
}

/* Desktop Navigation Link */
.nav-link.desktop {
  @apply px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 relative;
}

.nav-link.desktop.active {
  @apply text-blue-600 bg-blue-50;
}

.nav-link.desktop.active::after {
  @apply content-[''] absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-blue-600 rounded-full;
}

/* Mobile Navigation Link */
.nav-link.mobile {
  @apply w-full px-4 py-3 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50;
}

.nav-link.mobile.active {
  @apply text-blue-600 bg-blue-50 shadow-sm;
}

/* Icon Styling */
.nav-icon {
  @apply text-lg mr-3;
}

.nav-link.desktop .nav-icon {
  @apply mr-2;
}

/* Label Styling */
.nav-label {
  @apply flex-1;
}

/* Badge Styling */
.nav-badge {
  @apply ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center;
}

.nav-link.active .nav-badge {
  @apply bg-blue-500;
}

/* Hover Effects */
.nav-link:hover .nav-icon {
  @apply transform scale-110;
}

.nav-link.mobile:hover {
  @apply transform translateX-1;
}

/* Focus States */
.nav-link:focus {
  @apply outline-none ring-2 ring-blue-500 ring-opacity-50;
}

/* Animation */
.nav-link {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-icon {
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>