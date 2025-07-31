<template>
  <Teleport to="body">
    <Transition name="modal" appear>
      <div
        v-if="show"
        class="modal-overlay"
        @click="handleOverlayClick"
      >
        <div
          :class="modalClass"
          @click.stop
        >
          <!-- Header -->
          <div v-if="$slots.header || title" class="modal-header">
            <slot name="header">
              <h3 class="modal-title">{{ title }}</h3>
            </slot>
            <button
              v-if="closable"
              @click="handleClose"
              class="modal-close"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
          
          <!-- Body -->
          <div class="modal-body">
            <slot></slot>
          </div>
          
          <!-- Footer -->
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';

interface Props {
  show: boolean;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  closeOnOverlay?: boolean;
  persistent?: boolean;
}

interface Emits {
  (e: 'close'): void;
  (e: 'update:show', value: boolean): void;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closable: true,
  closeOnOverlay: true,
  persistent: false
});

const emit = defineEmits<Emits>();

const modalClass = computed(() => {
  const baseClasses = 'modal-content bg-white rounded-lg shadow-xl';
  
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full mx-4'
  };
  
  return `${baseClasses} ${sizeClasses[props.size]}`;
});

function handleClose() {
  if (!props.persistent) {
    emit('close');
    emit('update:show', false);
  }
}

function handleOverlayClick() {
  if (props.closeOnOverlay && !props.persistent) {
    handleClose();
  }
}

// Handle escape key
watch(() => props.show, (newShow) => {
  if (newShow) {
    document.addEventListener('keydown', handleEscapeKey);
    document.body.style.overflow = 'hidden';
  } else {
    document.removeEventListener('keydown', handleEscapeKey);
    document.body.style.overflow = '';
  }
});

function handleEscapeKey(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.closable && !props.persistent) {
    handleClose();
  }
}
</script>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4;
}

.modal-content {
  @apply w-full max-h-screen overflow-y-auto;
}

.modal-header {
  @apply flex items-center justify-between p-6 border-b border-gray-200;
}

.modal-title {
  @apply text-xl font-bold text-gray-900;
}

.modal-close {
  @apply text-gray-400 hover:text-gray-600 text-3xl font-light leading-none transition-colors;
}

.modal-body {
  @apply p-6;
}

.modal-footer {
  @apply p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9);
}
</style>