<script lang="ts" setup>
import { store } from '../../state/store';
import Button from '../../shared/Button.vue';
import { useRouter } from 'vue-router';
import Label from '../../shared/Label.vue';
import Input from '../../shared/Input.vue';
import { ref } from 'vue';

const router = useRouter();
const password = ref('');
const error = ref();
const unlock = async () => {
  error.value = undefined;
  if (!password.value) return;
  const wallet = await chrome.runtime.sendMessage({
    msg: 'unlockWallet',
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
  router.push('/main');
};
</script>

<template>
  <div class="flex flex-col min-h-screen">
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
  </div>
</template>
