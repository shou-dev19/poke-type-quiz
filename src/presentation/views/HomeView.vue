<template>
  <div class="home-view">
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-16">
      <div class="container-lg">
        <div class="text-center">
          <div class="text-6xl mb-6 animate-bounce-slow">🎯</div>
          <h1 class="text-5xl font-bold mb-4">Pokemon Type Quiz</h1>
          <p class="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Master Pokemon type effectiveness with interactive quizzes and comprehensive learning tools
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link 
              to="/quiz" 
              class="btn bg-yellow-500 hover:bg-yellow-600 text-gray-900 text-lg px-8 py-3 font-bold"
            >
              Start Quiz 🚀
            </router-link>
            <router-link 
              to="/types" 
              class="btn bg-white/20 hover:bg-white/30 text-white text-lg px-8 py-3 border border-white/30"
            >
              Browse Types 📚
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 bg-gray-50">
      <div class="container-lg">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Features</h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to master Pokemon type effectiveness
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Interactive Quiz -->
          <div class="card text-center hover:shadow-lg transition-shadow">
            <div class="text-4xl mb-4">🎮</div>
            <h3 class="text-xl font-bold mb-3 text-gray-900">Interactive Quiz</h3>
            <p class="text-gray-600 mb-4">
              Test your knowledge with adaptive quizzes that adjust to your skill level
            </p>
            <router-link to="/quiz" class="btn btn-primary">Start Quiz</router-link>
          </div>

          <!-- Type Database -->
          <div class="card text-center hover:shadow-lg transition-shadow">
            <div class="text-4xl mb-4">📖</div>
            <h3 class="text-xl font-bold mb-3 text-gray-900">Type Database</h3>
            <p class="text-gray-600 mb-4">
              Comprehensive information about all 18 Pokemon types and their relationships
            </p>
            <router-link to="/types" class="btn btn-primary">Browse Types</router-link>
          </div>

          <!-- Progress Tracking -->
          <div class="card text-center hover:shadow-lg transition-shadow">
            <div class="text-4xl mb-4">📊</div>
            <h3 class="text-xl font-bold mb-3 text-gray-900">Progress Tracking</h3>
            <p class="text-gray-600 mb-4">
              Monitor your learning progress with detailed statistics and performance metrics
            </p>
            <router-link to="/statistics" class="btn btn-primary">View Stats</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-16">
      <div class="container-lg">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Learn Pokemon type effectiveness in three simple steps
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 class="text-xl font-bold mb-3">Choose Your Level</h3>
            <p class="text-gray-600">
              Select from Easy, Normal, or Hard difficulty levels based on your experience
            </p>
          </div>

          <div class="text-center">
            <div class="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl font-bold text-green-600">2</span>
            </div>
            <h3 class="text-xl font-bold mb-3">Answer Questions</h3>
            <p class="text-gray-600">
              Answer type effectiveness questions with instant feedback and explanations
            </p>
          </div>

          <div class="text-center">
            <div class="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl font-bold text-purple-600">3</span>
            </div>
            <h3 class="text-xl font-bold mb-3">Track Progress</h3>
            <p class="text-gray-600">
              Monitor your improvement and identify areas that need more practice
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Statistics Preview -->
    <section class="py-16 bg-gray-50">
      <div class="container-lg">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">System Overview</h2>
          <p class="text-lg text-gray-600">
            Built with clean architecture and modern technologies
          </p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-600 mb-2">18</div>
            <div class="text-gray-600">Pokemon Types</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-green-600 mb-2">324</div>
            <div class="text-gray-600">Type Combinations</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-purple-600 mb-2">3</div>
            <div class="text-gray-600">Difficulty Levels</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-red-600 mb-2">∞</div>
            <div class="text-gray-600">Learning Potential</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
  // Set page title
  document.title = 'Pokemon Type Quiz - Home';
});
</script>

<style scoped>
.home-view {
  min-height: 100vh;
}

.animate-bounce-slow {
  animation: bounce 2s infinite;
}

@media (prefers-reduced-motion: reduce) {
  .animate-bounce-slow {
    animation: none;
  }
}
</style>