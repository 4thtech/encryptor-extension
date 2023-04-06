<script lang="ts" setup>
import Encryptor from '../../shared/svg/Encryptor.vue';
import { ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline';
import { useRouter } from 'vue-router';
import { store } from '../../state/store';
const router = useRouter();
const logout = () => {
  chrome.runtime.sendMessage({
    msg: 'lockWallet',
  });
  store.wallet = undefined;
  router.push('/unlock');
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="flex flex-col items-center space-y-4">
      <Encryptor class="h-20 w-20" />
      <div class="text-[1rem]">Your Encryptor is ready to use.</div>
      <div class="flex items-center hover:underline cursor-pointer" @click="logout">
        Logout <ArrowRightOnRectangleIcon class="h-4 w-4" />
      </div>
    </div>
  </div>
</template>
