<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { MessageType } from '@/types';
import { store } from '@/state/store';
import Button from '@shared/Button.vue';
import Label from '@shared/Label.vue';
import Input from '@shared/Input.vue';

const router = useRouter();
const password = ref('');
const error = ref();

const unlock = async () => {
  if (!password.value) return;

  const wallet = await chrome.runtime.sendMessage({
    msg: MessageType.UNLOCK_WALLET,
    data: {
      password: password.value,
    },
  });

  if (!wallet) {
    error.value = 'Wrong password';
    password.value = '';
    return;
  }

  store.wallet = wallet;
  await router.push('/main');
};
</script>

<template>
  <div class="p-4 bg-gray-100 shadow-m flex items-center space-x-4">
    <div class="text-[1rem]">Unlock encryptor</div>
  </div>

  <div class="flex-1 flex flex-col justify-center m-4">
    <Label>Password</Label>
    <Input v-model="password" type="password" @keyup.enter="unlock" />
    <div v-if="error" class="bg-red-100 p-2 rounded-md mt-2">{{ error }}</div>
    <div class="mt-4">
      <Button @click="unlock" :disabled="!password">Unlock</Button>
    </div>
  </div>
</template>
