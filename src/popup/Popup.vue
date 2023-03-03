<script setup lang="ts">
import { onMounted } from 'vue';
import { store } from '../state/store';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(async () => {
  const wallet = await chrome.runtime.sendMessage({
    msg: 'getWallet',
  });
  if (wallet.locked === false) {
    router.push('/main');
  } else if (wallet.locked === true) {
    router.push('/unlock');
  } else {
    router.push('/popup.html');
  }
  store.wallet = wallet;
});
</script>

<template>
  <main class="min-w-[300px] min-h-[300px]">
    <router-view></router-view>
  </main>
</template>
