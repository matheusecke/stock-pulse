import { createRouter, createWebHistory } from 'vue-router'

import DefaultLayout from "@/layouts/DefaultLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";

import HomeView from '../views/HomeView.vue'
import LoginView2 from '../views/LoginView2.vue';
import DashboardView from '../views/DashboardView.vue';
import ProdutosView from '../views/ProdutosView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
     {
    path: "/",
    component: DefaultLayout,
    children: [
      { path: "home", name: "home", component: HomeView },
      { path: "dashboard", name: "dashboard", component: DashboardView },
      { path: "produtos", name: "produtos", component: ProdutosView },
    ],
    
  },
  {
    path: "/login",
    component: AuthLayout,
    children: [
      { path: "", name: "login", component: LoginView2 },
    ],
  },
  ],
})

export default router
