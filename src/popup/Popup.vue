<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { MessageType, WalletState } from '@/types';
import { store } from '@/state/store';

const router = useRouter();

onMounted(async () => {
  const wallet = await chrome.runtime.sendMessage({
    msg: MessageType.GET_WALLET,
  });

  switch (wallet.state) {
    case WalletState.UNLOCKED:
      await router.push('/main');
      break;

    case WalletState.LOCKED:
      await router.push('/unlock');
      break;

    case WalletState.NOT_GENERATED:
    default:
      await router.push('/popup.html');
      break;
  }

  store.wallet = wallet;
});
</script>

<template>
  <main class="min-w-[300px] min-h-[300px]">
    <router-view></router-view>
  </main>
</template>
