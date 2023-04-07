<template>
  <div>
    <div class="min-h-screen flex items-center justify-center">
      <div class="flex flex-col items-center space-y-4">
        <Logo class="animate-spin h-20 w-20" />
        <div class="text-[1rem]">Loading...</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Logo from '@shared/Logo.vue';
</script>
