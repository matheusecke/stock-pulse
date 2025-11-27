<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import {
  ChevronUp,
  ChevronDown,
  Home,
  LayoutDashboard,
  Package,
  LogIn
} from 'lucide-vue-next'
import { isAuthenticated, logout } from "@/auth"

const isMenuOpen = ref(false)
const userMenu = ref(null)

const handleClickOutside = (event) => {
  if (userMenu.value && !userMenu.value.contains(event.target)) {
    isMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<template>
  <div
    class="fixed top-0 left-0 h-screen font-sans w-64 bg-gradient-to-br from-gray-900 via-gray-800 to-black -2xl border-r border-t border-b border-blue-100/40 shadow-2xl shadow-black/60 flex flex-col justify-between overflow-hidden"
  >
    <div>
      <div class="px-6 pt-8">
        <div class="flex items-center justify-center">
          <h3 class="font-semibold text-2xl text-white">StockPulse</h3>
        </div>
      </div>
      <div class="px-6 pt-8">
        <hr class="border-yellow-600" />
      </div>

      <div class="px-6 pt-4">
        <ul class="flex flex-col space-y-2">
          <li>
            <router-link
              to="/home"
              exact
              class="flex items-center p-2 rounded-lg text-gray-300 hover:bg-gray-900 hover:text-white group transition-all duration-100"
              active-class="bg-gray-900 text-white border-l-4 border-yellow-600"
            >
              <Home class="w-5 h-5" />
              <span class="ms-3 text-base">Home</span>
            </router-link>
          </li>

          
            <li>
              <router-link
                to="/dashboard"
                exact
                class="flex items-center p-2 rounded-lg text-gray-300 hover:bg-gray-900 hover:text-white group transition-all duration-100"
                active-class="bg-gray-900 text-white border-l-4 border-yellow-600"
              >
                <LayoutDashboard class="w-5 h-5" />
                <span class="ms-3 text-base">Dashboard</span>
              </router-link>
            </li>
            <li>
              <router-link
                to="/produtos"
                exact
                class="flex items-center p-2 rounded-lg text-gray-300 hover:bg-gray-900 hover:text-white group transition-all duration-100"
                active-class="bg-gray-900 text-white border-l-4 border-yellow-600"
              >
                <Package class="w-5 h-5" />
                <span class="ms-3 text-base">Produtos</span>
              </router-link>
            </li>
        </ul>
      </div>
    </div>

    <div class="relative" ref="userMenu">
      <template v-if="isAuthenticated">
        <transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 translate-y-2 scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 translate-y-2 scale-95"
        >
          <div
            v-if="isMenuOpen"
            class="absolute left-0 right-0 bottom-full mb-4 mx-2 p-2 bg-gray-800 rounded-lg shadow-lg"
          >
            <ul class="space-y-1">
              <li>
                <a href="#" class="block p-2 text-sm text-gray-300 rounded hover:bg-gray-700 hover:text-white">Meu Perfil</a>
              </li>
              <li>
                <button @click="logout" class="w-full text-left p-2 text-sm text-red-400 rounded hover:bg-red-500 hover:text-white">Sair</button>
              </li>
            </ul>
          </div>
        </transition>

        <button
          @click="isMenuOpen = !isMenuOpen"
          class="w-full flex items-center border-t border-yellow-600 p-6 text-left hover:bg-gray-800 transition-colors duration-200"
          :class="{ 'bg-gray-800': isMenuOpen }"
          aria-haspopup="true"
          :aria-expanded="isMenuOpen"
        >
          <img
            src="https://ui-avatars.com/api/?name=Admin&background=c7d2fe&color=3730a3&bold=true"
            alt="Avatar"
            class="w-10 h-10 rounded"
          />
          <div class="ml-3 text-left flex-1">
            <p class="text-base font-semibold text-white">Admin</p>
            <p class="text-sm text-gray-400">admin@admin.com</p>
          </div>
          <ChevronUp v-if="isMenuOpen" class="text-yellow-600" />
          <ChevronDown v-else class="text-yellow-600" />
        </button>
      </template>

      <template v-else>
        <router-link
          to="/login"
          class="w-full flex items-center border-t border-yellow-600 p-6 text-left hover:bg-gray-800 transition-colors duration-200"
        >
          <img
            src="https://ui-avatars.com/api/?name=?&background=fca5a5&color=7f1d1d&bold=true"
            alt="Avatar Padrão"
            class="w-10 h-10 rounded"
          />
          <div class="ml-3 text-left flex-1">
            <p class="text-base font-semibold text-white">Não Logado</p>
            <p class="text-sm text-gray-400">Acesse sua conta</p>
          </div>
          <LogIn class="w-5 h-5 text-yellow-600" />
        </router-link>
      </template>
    </div>
  </div>
</template>