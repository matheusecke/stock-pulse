<script setup>
import { inject } from "vue";

// 1. useContext é substituído por inject para consumir o estado fornecido.
const expanded = inject("sidebar-expanded");

// 2. As props são definidas com defineProps.
//    A prop 'icon' é do tipo Object, pois receberá um componente Vue.
defineProps({
  icon: Object,
  text: String,
  active: Boolean,
  alert: Boolean,
});
</script>

<template>
  <li
    :class="`
      relative flex items-center py-2 px-3 my-1
      font-medium rounded-md cursor-pointer
      transition-colors group
      ${
        active
          ? 'bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800'
          : 'hover:bg-indigo-50 text-gray-600'
      }
    `"
  >
    <component :is="icon" />
    <span
      :class="`overflow-hidden transition-all ${
        expanded ? 'w-52 ml-3' : 'w-0'
      }`"
    >
      {{ text }}
    </span>

    <div
      v-if="alert"
      :class="`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
        expanded ? '' : 'top-2'
      }`"
    />

    <div
      v-if="!expanded"
      class="
        absolute left-full rounded-md px-2 py-1 ml-6
        bg-indigo-100 text-indigo-800 text-sm
        invisible opacity-20 -translate-x-3 transition-all
        group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      "
    >
      {{ text }}
    </div>
  </li>
</template>