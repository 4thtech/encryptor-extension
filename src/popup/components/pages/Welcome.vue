<script setup lang="ts">
import Button from '../../shared/Button.vue';
</script>
<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <router-link to="/create"><Button>Create new Encryptor</Button></router-link>
    <router-link to="/restore" class="mt-4 cursor-pointer hover:underline"
      >I want to restore Encryptor</router-link
    >
  </div>
</template>
