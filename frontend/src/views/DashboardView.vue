<script setup>
import { ref, computed, onMounted } from "vue";
import { isAuthenticated, logout } from "@/auth";
import Naologado from "@/components/Naologado.vue";
import { getProducts } from "@/services/products.js";

const loggedin = computed(() => isAuthenticated.value);
const produtos = ref([]);
const isLoading = ref(false);

function handleLogout() {
  logout();
}

// Estatísticas calculadas
const totalProdutos = computed(() => produtos.value.length);
const totalEstoque = computed(() => 
  produtos.value.reduce((total, produto) => total + (produto.quantity || 0), 0)
);
const produtosBaixoEstoque = computed(() => 
  produtos.value.filter(produto => (produto.quantity || 0) <= 10).length
);
const valorTotalEstoque = computed(() => 
  produtos.value.reduce((total, produto) => 
    total + ((produto.price || 0) * (produto.quantity || 0)), 0
  )
);

// Carregar produtos da API
async function loadProducts() {
  if (!loggedin.value) return;
  
  isLoading.value = true;
  try {
    const response = await getProducts();
    produtos.value = response;
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
  } finally {
    isLoading.value = false;
  }
}

// Inicializar dados
onMounted(() => {
  loadProducts();
});
</script>

<template>
  <div class="min-h-screen p-6 text-gray-900">
    <div v-if="loggedin" class="space-y-8">
      <header>
        <h1 class="text-4xl font-bold text-blue-300">Bem-vindo ao StockPulse</h1>
        <p class="mt-2 text-gray-600">Painel de controle completo do seu estoque.</p>
      </header>

      <!-- Cards -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fb8500]"></div>
        <span class="ml-3 text-gray-600">Carregando estatísticas...</span>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow hover:shadow-lg transition">
          <div class="flex items-center space-x-4">
            <div class="bg-blue-100 p-3 rounded-full">
              <span class="text-blue-600 text-2xl">📦</span>
            </div>
            <div>
              <p class="text-sm text-gray-600">Total de Produtos</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalProdutos }}</p>
            </div>
          </div>
          <router-link to="/produtos" class="mt-4 inline-block px-3 py-1 bg-[#fb8500] text-white rounded-lg text-sm hover:bg-[#e67600] transition">Ver produtos</router-link>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow hover:shadow-lg transition">
          <div class="flex items-center space-x-4">
            <div class="bg-green-100 p-3 rounded-full">
              <span class="text-green-600 text-2xl">📊</span>
            </div>
            <div>
              <p class="text-sm text-gray-600">Total em Estoque</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalEstoque }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow hover:shadow-lg transition">
          <div class="flex items-center space-x-4">
            <div class="bg-yellow-100 p-3 rounded-full">
              <span class="text-yellow-600 text-2xl">⚠️</span>
            </div>
            <div>
              <p class="text-sm text-gray-600">Estoque Baixo</p>
              <p class="text-2xl font-bold text-gray-900">{{ produtosBaixoEstoque }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow hover:shadow-lg transition">
          <div class="flex items-center space-x-4">
            <div class="bg-purple-100 p-3 rounded-full">
              <span class="text-purple-600 text-2xl">💰</span>
            </div>
            <div>
              <p class="text-sm text-gray-600">Valor Total</p>
              <p class="text-2xl font-bold text-gray-900">R$ {{ valorTotalEstoque.toFixed(2) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Gráfico -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow p-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Vendas da Semana</h2>
        <div class="w-full h-48 bg-gray-100 rounded-lg flex items-end space-x-2 p-2">
          <div v-for="n in 7" :key="n" :style="{ height: `${Math.floor(Math.random() * 100) + 20}px` }"
               class="bg-yellow-500 rounded w-6 transition-all duration-300 hover:bg-yellow-400"></div>
        </div>
      </div>

      <!-- Produtos com Estoque Baixo -->
      <div v-if="!isLoading">
        <h2 class="text-2xl font-bold text-blue-300 mb-4">Produtos com Estoque Baixo</h2>
        <div class="bg-white rounded-2xl border border-gray-200 shadow">
          <div v-if="produtos.filter(p => (p.quantity || 0) <= 10).length === 0" class="p-6 text-center text-gray-500">
            ✅ Todos os produtos têm estoque adequado!
          </div>
          <div v-else class="overflow-y-auto max-h-[300px]">
            <table class="min-w-full text-left border-collapse">
              <thead class="sticky top-0 bg-gray-100 text-gray-700">
                <tr>
                  <th class="px-4 py-2 text-sm font-semibold">Produto</th>
                  <th class="px-4 py-2 text-sm font-semibold">Descrição</th>
                  <th class="px-4 py-2 text-sm font-semibold">Estoque</th>
                  <th class="px-4 py-2 text-sm font-semibold">Preço</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="produto in produtos.filter(p => (p.quantity || 0) <= 10)" :key="produto.id" class="border-t border-gray-200 hover:bg-gray-50 transition">
                  <td class="px-4 py-2 text-gray-800 font-medium">{{ produto.name }}</td>
                  <td class="px-4 py-2 text-gray-600">{{ produto.description }}</td>
                  <td class="px-4 py-2">
                    <span class="px-2 py-1 text-xs font-semibold rounded-full bg-red-200 text-red-800">
                      {{ produto.quantity }}
                    </span>
                  </td>
                  <td class="px-4 py-2 text-gray-700">R$ {{ produto.price?.toFixed(2) || '0.00' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <Naologado></Naologado>
    </div>
  </div>
</template>
