<template>
  <div class="not-found-view">
    <div class="container-lg">
      <div class="text-center py-16">
        <div class="text-8xl mb-8">🤔</div>
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p class="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <div class="space-y-4">
          <router-link to="/" class="btn btn-primary block mx-auto w-fit">
            🏠 Go Home
          </router-link>
          <div class="text-sm text-gray-500">
            or try one of these pages:
          </div>
          <div class="flex flex-wrap gap-2 justify-center">
            <router-link to="/quiz" class="btn btn-secondary btn-sm">Quiz</router-link>
            <router-link to="/types" class="btn btn-secondary btn-sm">Types</router-link>
            <router-link to="/statistics" class="btn btn-secondary btn-sm">Statistics</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
  document.title = 'Pokemon Type Quiz - Page Not Found';
});
</script>

<style scoped>
.not-found-view {
  min-height: 80vh;
}
</style>