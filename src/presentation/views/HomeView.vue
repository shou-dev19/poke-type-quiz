<template>
  <div class="home-view">
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-16">
      <div class="container-lg">
        <div class="text-center">
          <div class="text-6xl mb-6 animate-bounce-slow">🎯</div>
          <h1 class="text-5xl font-bold mb-4">ポケモンタイプ相性クイズ</h1>
          <p class="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            インタラクティブなクイズと総合的な学習ツールでポケモンタイプ相性をマスターしよう
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link 
              to="/quiz" 
              class="btn bg-yellow-500 hover:bg-yellow-600 text-gray-900 text-lg px-8 py-3 font-bold"
            >
クイズ開始 🚀
            </router-link>
            <router-link 
              to="/types" 
              class="btn bg-white/20 hover:bg-white/30 text-white text-lg px-8 py-3 border border-white/30"
            >
タイプ一覧 📚
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 bg-gray-50">
      <div class="container-lg">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">機能</h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            ポケモンタイプ相性をマスターするためのすべてがここに
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Interactive Quiz -->
          <div class="card text-center hover:shadow-lg transition-shadow">
            <div class="text-4xl mb-4">🎮</div>
            <h3 class="text-xl font-bold mb-3 text-gray-900">インタラクティブクイズ</h3>
            <p class="text-gray-600 mb-4">
              あなたのスキルレベルに合わせて調整されるアダプティブクイズで知識をテスト
            </p>
            <router-link to="/quiz" class="btn btn-primary">クイズ開始</router-link>
          </div>

          <!-- Type Database -->
          <div class="card text-center hover:shadow-lg transition-shadow">
            <div class="text-4xl mb-4">📖</div>
            <h3 class="text-xl font-bold mb-3 text-gray-900">タイプデータベース</h3>
            <p class="text-gray-600 mb-4">
              18種類のポケモンタイプとその相性関係に関する総合情報
            </p>
            <router-link to="/types" class="btn btn-primary">タイプ一覧</router-link>
          </div>

          <!-- Progress Tracking -->
          <div class="card text-center hover:shadow-lg transition-shadow">
            <div class="text-4xl mb-4">📊</div>
            <h3 class="text-xl font-bold mb-3 text-gray-900">進捗追跡</h3>
            <p class="text-gray-600 mb-4">
              詳細な統計とパフォーマンス指標で学習進捗を監視
            </p>
            <router-link to="/statistics" class="btn btn-primary">統計表示</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-16">
      <div class="container-lg">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">使い方</h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            3つの簡単なステップでポケモンタイプ相性を学びましょう
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 class="text-xl font-bold mb-3">レベルを選択</h3>
            <p class="text-gray-600">
              あなたの経験に基づいて、初級・中級・上級の難易度レベルから選択
            </p>
          </div>

          <div class="text-center">
            <div class="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl font-bold text-green-600">2</span>
            </div>
            <h3 class="text-xl font-bold mb-3">問題に答える</h3>
            <p class="text-gray-600">
              タイプ相性の問題に答えて、即座にフィードバックと解説を受け取り
            </p>
          </div>

          <div class="text-center">
            <div class="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl font-bold text-purple-600">3</span>
            </div>
            <h3 class="text-xl font-bold mb-3">進捗を追跡</h3>
            <p class="text-gray-600">
              上達を監視し、より多くの練習が必要な領域を特定
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Statistics Preview -->
    <section class="py-16 bg-gray-50">
      <div class="container-lg">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">システム概要</h2>
          <p class="text-lg text-gray-600">
            クリーンアーキテクチャとモダンテクノロジーで構築
          </p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-600 mb-2">18</div>
            <div class="text-gray-600">ポケモンタイプ</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-green-600 mb-2">324</div>
            <div class="text-gray-600">タイプ組み合わせ</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-purple-600 mb-2">3</div>
            <div class="text-gray-600">難易度レベル</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-red-600 mb-2">∞</div>
            <div class="text-gray-600">学習ポテンシャル</div>
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
  document.title = 'ポケモンタイプ相性クイズ - ホーム';
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