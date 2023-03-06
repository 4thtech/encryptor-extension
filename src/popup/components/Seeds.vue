<script lang="ts" setup>
import { store } from '../../state/store';
import Button from '../../shared/Button.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <div class="p-4 bg-gray-100 shadow-m flex items-center space-x-4">
      <div class="text-[1rem]">Seed words</div>
    </div>

    <div class="flex-1 flex items-center">
      <div class="text-center">
        <div class="text-center text-[1rem] bg-gray-100 p-2 select-all">
          {{ store.wallet?.mnemonic?.phrase }}
        </div>
        <Button class="mt-10" @click="router.push('/main')">I wrote them somewhere safe</Button>
      </div>
    </div>
  </div>
</template>
