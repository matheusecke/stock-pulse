
import { ref } from "vue";
import { apiRequest } from "./config/api.js";

export const isAuthenticated = ref(!!localStorage.getItem('jwt_token'));

export async function login(email, password) {
  try {
    const response = await apiRequest('/auth/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response && response.access_token) {
      localStorage.setItem('jwt_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      isAuthenticated.value = true;
      return { success: true };
    } else {
      return { success: false, error: 'Resposta inválida do servidor' };
    }
  } catch (error) {
    console.error('Login failed:', error);
    return { success: false, error: 'Email ou senha inválidos' };
  }
}

export async function signup(email, password, name) {
  try {
    const response = await apiRequest('/auth/users/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });

    if (response.access_token) {
      localStorage.setItem('jwt_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      isAuthenticated.value = true;
      return { success: true };
    }
  } catch (error) {
    console.error('Signup failed:', error);
    return { success: false, error: 'Erro ao criar conta' };
  }
}

export function logout() {
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('refresh_token');
  isAuthenticated.value = false;
}

// Verificar se o token ainda é válido ao inicializar
export function checkAuthStatus() {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    // Aqui você poderia verificar se o token ainda é válido
    // Por enquanto, apenas assume que é válido se existe
    isAuthenticated.value = true;
  }
}