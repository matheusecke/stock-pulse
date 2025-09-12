<script setup>
import { ref } from "vue"
import { login } from "@/auth"
import { useRouter } from "vue-router"

const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

async function handleLogin() {
  if (!email.value || !password.value) {
    errorMessage.value = 'Por favor, preencha todos os campos'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const result = await login(email.value, password.value)
    
    if (result.success) {
      router.push("/home")
    } else {
      errorMessage.value = result.error || 'Erro no login'
    }
  } catch (error) {
    errorMessage.value = 'Erro de conexão. Tente novamente.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
    <div class="w-full max-w-md bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700 p-8">
        
      <!-- Logo / título -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-white">StockPulse</h1>
        <p class="text-gray-400 text-sm mt-2">Entre com sua conta</p>
      </div>

      <!-- Formulário -->
      <form class="space-y-5" @submit.prevent="handleLogin">
        <!-- Mensagem de erro -->
        <div v-if="errorMessage" class="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm">
          {{ errorMessage }}
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">E-mail</label>
          <input
            v-model="email"
            type="email"
            placeholder="seu@email.com"
            :disabled="isLoading"
            class="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#fb8500] focus:border-transparent transition disabled:opacity-50"
          />
        </div>

        <!-- Senha -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Senha</label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            :disabled="isLoading"
            class="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#fb8500] focus:border-transparent transition disabled:opacity-50"
          />
        </div>


        <!-- Botão login -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-3 px-4 rounded-lg font-semibold text-white bg-[#fb8500] hover:bg-[#e67600] transition-colors duration-200 shadow-lg shadow-[#fb8500]/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isLoading">Entrando...</span>
          <span v-else>Entrar</span>
        </button>
      </form>

      <!-- Divider -->
      <div class="flex items-center my-6">
        <div class="flex-grow border-t border-gray-700"></div>
        <span class="mx-3 text-gray-500 text-sm">ou</span>
        <div class="flex-grow border-t border-gray-700"></div>
      </div>

      <!-- Registro -->
      <p class="mt-6 text-center text-sm text-gray-400">
        Não tem conta?
        <a href="#" class="text-[#fb8500] font-medium hover:underline">Criar conta</a>
      </p>
    </div>
  </div>
</template>
