<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  product: Object,
});

const emit = defineEmits(['close', 'save']);

const localProduct = ref({});

// Atualiza o formulário interno quando o produto passado como prop muda
watch(() => props.product, (newVal) => {
  localProduct.value = { ...newVal };
}, { immediate: true });

function save() {
  emit('save', localProduct.value);
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 backdrop-blur-sm">
    <div class="w-full max-w-lg p-6 bg-gradient-to-br from-gray-900 via-gray-800 rounded-xl shadow-2xl">
      <h2 class="text-2xl font-bold mb-4 text-gray-800 dark:text-white">{{ product.id ? 'Editar Produto' : 'Novo Produto' }}</h2>
      <form @submit.prevent="save" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome</label>
          <input v-model="localProduct.name" type="text" required class="mt-1 w-full px-3 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fb8500]">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Descrição</label>
          <textarea v-model="localProduct.description" required class="mt-1 w-full px-3 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fb8500] resize-none" rows="3"></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Preço</label>
          <input v-model.number="localProduct.price" type="number" step="0.01" required class="mt-1 w-full px-3 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fb8500]">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantidade</label>
          <input v-model.number="localProduct.quantity" type="number" required class="mt-1 w-full px-3 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#fb8500]">
        </div>
        <div class="flex justify-end gap-4 pt-4">
          <button type="button" @click="$emit('close')" class="px-4 py-2 text-gray-200 font-semibold rounded-lg bg-red-500 hover:bg-red-700 hover:text-white transition">Cancelar</button>
          <button type="submit" class="px-4 py-2 bg-[#fb8500] text-white font-semibold rounded-lg hover:bg-[#e67600] transition">Salvar</button>
        </div>
      </form>
    </div>
  </div>
</template>