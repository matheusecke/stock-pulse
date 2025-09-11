<script setup>
defineProps({
  isOpen: Boolean,
  product: Object,
});

defineEmits(['close', 'confirm']);
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 backdrop-blur-sm">
    <div class="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
      <h2 class="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Confirmar Exclusão</h2>
      <p class="text-gray-600 dark:text-gray-300 mb-6">
        Tem certeza que deseja excluir o produto "<strong>{{ product?.nome }}</strong>"? Esta ação não pode ser desfeita.
      </p>
      <div class="flex justify-end gap-4">
        <button @click="$emit('close')" class="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition">Cancelar</button>
        <button @click="$emit('confirm')" class="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition">Confirmar Exclusão</button>
      </div>
    </div>
  </div>
</template>