<template>
  <nav class="breadcrumb-nav" aria-label="Breadcrumb">
    <div class="container mx-auto px-4">
      <ol class="breadcrumb-list">
        <li
          v-for="(item, index) in items"
          :key="item.path"
          class="breadcrumb-item"
        >
          <router-link
            v-if="!item.current"
            :to="item.path"
            class="breadcrumb-link"
          >
            <span v-if="item.icon" class="breadcrumb-icon">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </router-link>
          
          <span v-else class="breadcrumb-current">
            <span v-if="item.icon" class="breadcrumb-icon">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </span>
          
          <span
            v-if="index < items.length - 1"
            class="breadcrumb-separator"
            aria-hidden="true"
          >
            /
          </span>
        </li>
      </ol>
    </div>
  </nav>
</template>

<script setup lang="ts">
interface BreadcrumbItem {
  path: string;
  label: string;
  icon?: string;
  current?: boolean;
}

interface Props {
  items: BreadcrumbItem[];
}

defineProps<Props>();
</script>

<style scoped>
.breadcrumb-nav {
  @apply bg-gray-50 border-b border-gray-200 py-3 mt-20;
}

.breadcrumb-list {
  @apply flex items-center space-x-2 text-sm;
}

.breadcrumb-item {
  @apply flex items-center;
}

.breadcrumb-link {
  @apply flex items-center text-gray-600 hover:text-blue-600 transition-colors text-decoration-none;
}

.breadcrumb-current {
  @apply flex items-center text-gray-900 font-medium;
}

.breadcrumb-icon {
  @apply mr-1;
}

.breadcrumb-separator {
  @apply mx-2 text-gray-400;
}

/* Responsive Design */
@media (max-width: 640px) {
  .breadcrumb-nav {
    @apply py-2;
  }
  
  .breadcrumb-list {
    @apply text-xs;
  }
  
  .breadcrumb-icon {
    @apply text-sm;
  }
}

/* Animation */
.breadcrumb-link:hover .breadcrumb-icon {
  @apply transform scale-110;
}

.breadcrumb-icon {
  transition: transform 0.2s ease;
}
</style>