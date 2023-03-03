<script setup lang="ts">
type ButtonProps = {
  disabled?: boolean;
};

defineProps<ButtonProps>();
</script>

<template>
  <button
    class="inline-flex items-center rounded-md border transition-colors duration-300"
    :disabled="disabled"
    :class="[
      'border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
      { 'bg-blue-300 hover:bg-blue-200 cursor-not-allowed': disabled },
    ]"
  >
    <span><slot /></span>
  </button>
</template>
