<template>
  <div class="flex items-center gap-4 rounded-lg border border-amber-500 bg-amber-50 p-6 dark:bg-gray-800 dark:border-amber-600">
    
    <div class="flex-shrink-0">
      <svg class="h-10 w-10 text-amber-500" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    </div>

    <div class="flex-grow">
      <h3 class="font-bold text-gray-800 dark:text-white">Acesso Restrito</h3>
      <p class="text-sm text-gray-600 dark:text-gray-300">Você precisa fazer login para ver este conteúdo.</p>
    </div>

    <div>
      <router-link to="/login"
        @click="$emit('login')"
        class="rounded-lg bg-amber-500 px-5 py-2 font-semibold text-white shadow-sm transition-colors hover:bg-amber-600"
      >
        Entrar
    </router-link>
    </div>

  </div>
</template>

<script setup>
// Define o evento que este componente pode emitir
defineEmits(['login']);
</script>