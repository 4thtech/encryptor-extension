<script setup lang="ts">
type ButtonProps = {
  disabled?: boolean;
};

defineProps<ButtonProps>();
</script>

<template>
  <button
    :disabled="disabled"
    :class="[
      'inline-flex items-center rounded-md border transition-all duration-300',
      'border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:brightness-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
      { 'opacity-50 cursor-not-allowed': disabled },
    ]"
  >
    <span><slot /></span>
  </button>
</template>
