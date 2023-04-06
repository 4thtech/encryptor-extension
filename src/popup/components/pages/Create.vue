<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import { MessageType } from '@/types';
import { store } from '@/state/store';
import Label from '@shared/Label.vue';
import Input from '@shared/Input.vue';
import Button from '@shared/Button.vue';

const form = ref({
  password: '',
  passwordConfirmation: '',
});

const isDisabled = computed(() => {
  return form.value.password === '' || form.value.password !== form.value.passwordConfirmation;
});

const router = useRouter();

const createWallet = async () => {
  if (isDisabled.value) return;

  store.wallet = await chrome.runtime.sendMessage({
    msg: MessageType.CREATE_NEW_WALLET,
    data: {
      password: form.value.password,
    },
  });

  await router.push({ path: '/seeds' });
};
</script>

<template>
  <div class="p-4 bg-gray-100 shadow-m flex items-center space-x-4">
    <router-link to="/popup.html">
      <ArrowLeftIcon class="h-6 w-6 cursor-pointer" />
    </router-link>
    <div class="text-[1rem]">Protect your Encryptor</div>
  </div>
  <div class="p-4">
    <div>
      <Label>Enter password</Label>
      <Input
        v-model="form.password"
        placeholder="Password"
        type="password"
        @keyup.enter="createWallet()"
      />
    </div>
    <div class="pt-2">
      <Label>Enter password confirmation</Label>
      <Input
        v-model="form.passwordConfirmation"
        placeholder="Password confirmation"
        type="password"
        @keyup.enter="createWallet()"
      />
    </div>
    <div class="pt-4">
      <Button :disabled="isDisabled" @click="createWallet()">Next</Button>
    </div>
  </div>
</template>
