/**
 * Vue 3 TypeScript Shims
 * Type definitions for Vue.js components
 */

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}