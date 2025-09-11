<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Variáveis reativas para os campos do formulário
const email = ref('');
const password = ref('');
const errorMessage = ref(null); // Para exibir mensagens de erro

const router = useRouter(); // Instância do Vue Router para navegação

const handleLogin = async () => {
  // Limpa erros anteriores
  errorMessage.value = null; 

  console.log('Tentando fazer login com:', {
    email: email.value,
    password: password.value,
  });

  // --- LÓGICA DE CONEXÃO COM O BACKEND IRIA AQUI ---
  // Este é um exemplo de como seria a chamada para a sua API NestJS
  try {
    // const response = await axios.post('http://localhost:3000/auth/login', {
    //   email: email.value,
    //   password: password.value,
    // });
    
    // const token = response.data.access_token;
    // localStorage.setItem('jwt_token', token); // Salva o token

    // Simulação de sucesso para este exemplo:
    alert('Login realizado com sucesso! Redirecionando...');
    
    // Redireciona o usuário para o dashboard após o login
    router.push('/dashboard');

  } catch (error) {
    console.error('Erro no login:', error);
    errorMessage.value = 'Email ou senha inválidos. Tente novamente.';
    // No caso real, você pegaria a mensagem de erro da resposta da API
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center ">

    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-800">Acesse sua Conta</h2>
        <p class="text-gray-500">Bem-vindo de volta ao StockPulse!</p>
      </div>

      <form @submit.prevent="handleLogin">
        
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input 
            v-model="email"
            type="email" 
            id="email"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="voce@email.com"
          >
        </div>

        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700">Senha</label>
          <input 
            v-model="password"
            type="password" 
            id="password"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="••••••••"
          >
        </div>

        <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {{ errorMessage }}
        </div>

        <div>
          <button 
            type="submit"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Entrar
          </button>
        </div>

        <div class="text-center mt-6">
          <p class="text-sm text-gray-600">
            Não tem uma conta?
            <router-link to="/cadastro" class="font-medium text-indigo-600 hover:text-indigo-500">
              Cadastre-se
            </router-link>
          </p>
        </div>

      </form>
    </div>
  </div>
</template>