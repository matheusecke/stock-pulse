<script setup>
import { login } from "@/auth"
import { useRouter } from "vue-router"

const router = useRouter()

function handleLogin() {
  // por enquanto não checa usuário/senha
  login()
  router.push("/home") // redireciona ao logar
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
        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">E-mail</label>
          <input
            type="email"
            placeholder="seu@email.com"
            class="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#fb8500] focus:border-transparent transition"
          />
        </div>

        <!-- Senha -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Senha</label>
          <input
            type="password"
            placeholder="••••••••"
            class="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#fb8500] focus:border-transparent transition"
          />
        </div>

        <!-- Esqueci a senha -->
        <div class="flex justify-end">
          <a href="#" class="text-sm text-[#fb8500] hover:underline">Esqueci minha senha</a>
        </div>

        <!-- Botão login -->
        <button
          type="submit"
          class="w-full py-3 px-4 rounded-lg font-semibold text-white bg-[#fb8500] hover:bg-[#e67600] transition-colors duration-200 shadow-lg shadow-[#fb8500]/30"
        >
          Entrar
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
