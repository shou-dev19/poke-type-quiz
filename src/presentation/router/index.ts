/**
 * Vue Router Configuration
 * Defines application routes and navigation
 */

import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

// Lazy-loaded views for better performance
const Home = () => import('@/presentation/views/HomeView.vue');
const Quiz = () => import('@/presentation/views/QuizView.vue');
const Types = () => import('@/presentation/views/TypesView.vue');
const Statistics = () => import('@/presentation/views/StatisticsView.vue');
const NotFound = () => import('@/presentation/views/NotFoundView.vue');

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Pokemon Type Quiz - Home',
      description: 'Learn Pokemon type effectiveness with interactive quizzes',
      showBreadcrumbs: false,
      transition: 'fade',
      icon: '🏠'
    }
  },
  {
    path: '/quiz',
    name: 'Quiz',
    component: Quiz,
    meta: {
      title: 'Pokemon Type Quiz - Quiz',
      description: 'Test your knowledge of Pokemon type effectiveness',
      breadcrumbLabel: 'Quiz',
      transition: 'slide-left',
      icon: '🎮'
    }
  },
  {
    path: '/quiz/session/:sessionId',
    name: 'QuizSession',
    component: Quiz,
    props: true,
    meta: {
      title: 'Pokemon Type Quiz - Active Session',
      description: 'Continue your quiz session',
      breadcrumbLabel: 'Active Session',
      transition: 'scale',
      icon: '🎯',
      scrollToTop: false
    }
  },
  {
    path: '/types',
    name: 'Types',
    component: Types,
    meta: {
      title: 'Pokemon Type Quiz - Type Information',
      description: 'Browse comprehensive Pokemon type information and effectiveness charts',
      breadcrumbLabel: 'Types',
      transition: 'slide-right',
      icon: '📚'
    }
  },
  {
    path: '/types/:typeId',
    name: 'TypeDetail',
    component: Types,
    props: true,
    meta: {
      title: 'Pokemon Type Quiz - Type Details',
      description: 'Detailed information about a specific Pokemon type',
      breadcrumbLabel: 'Type Details',
      transition: 'scale',
      icon: '🔍'
    }
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: Statistics,
    alias: '/stats',
    meta: {
      title: 'Pokemon Type Quiz - Statistics',
      description: 'View your quiz performance and learning progress',
      breadcrumbLabel: 'Statistics',
      transition: 'slide-left',
      icon: '📊'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: 'Pokemon Type Quiz - Page Not Found',
      description: 'The requested page could not be found',
      showBreadcrumbs: false,
      transition: 'fade',
      icon: '❓'
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Return to saved position if available (browser back/forward)
    if (savedPosition) {
      return savedPosition;
    }
    
    // Scroll to anchor if present
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      };
    }
    
    // Scroll to top for new pages
    return { top: 0, behavior: 'smooth' };
  }
});

// Global navigation guards
router.beforeEach((to, from, next) => {
  // Update document title
  if (to.meta.title) {
    document.title = to.meta.title as string;
  }
  
  // Update meta description
  if (to.meta.description) {
    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      descriptionMeta.setAttribute('content', to.meta.description as string);
    }
  }
  
  next();
});

// Handle routing errors
router.onError((error) => {
  console.error('Router error:', error);
});

export default router;