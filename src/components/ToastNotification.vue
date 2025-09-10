<script setup>
import { CheckCircle, AlertTriangle } from 'lucide-vue-next';

defineProps({
  message: String,
  type: {
    type: String,
    default: 'success', // 'success' or 'error'
  },
});
</script>

<template>
  <div
    class="fixed top-6 z-50 flex items-center gap-4 rounded-lg p-4 shadow-lg"
    :class="{
      'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-700': type === 'success',
      'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700': type === 'error',
    }"
  >
    <CheckCircle v-if="type === 'success'" class="h-6 w-6" />
    <AlertTriangle v-if="type === 'error'" class="h-6 w-6" />
    <span>{{ message }}</span>
  </div>
</template>