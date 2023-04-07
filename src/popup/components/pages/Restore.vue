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
  seeds: '',
  password: '',
  passwordConfirmation: '',
});
const error = ref();

const router = useRouter();

const isDisabled = computed(() => {
  const { password, passwordConfirmation, seeds } = form.value;
  return !password || !seeds || password !== passwordConfirmation;
});

const restore = async () => {
  if (isDisabled.value) return;

  const wallet = await chrome.runtime.sendMessage({
    msg: MessageType.RESTORE_WALLET,
    data: {
      password: form.value.password,
      seeds: form.value.seeds,
    },
  });

  if (wallet) {
    store.wallet = wallet;
    await router.push({ path: '/main' });
  } else {
    error.value = 'Invalid seeds.';
  }
};
</script>

<template>
  <div class="p-4 bg-gray-100 shadow-m flex items-center space-x-4">
    <router-link to="/welcome">
      <ArrowLeftIcon class="h-6 w-6 cursor-pointer" />
    </router-link>
    <div class="text-[1rem]">Restore</div>
  </div>
  <div class="p-4">
    <div>
      <Label>Enter seeds</Label>
      <textarea
        v-model="form.seeds"
        placeholder="Seeds"
        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm"
      />
    </div>
    <div class="pt-2">
      <Label>Enter password</Label>
      <Input
        v-model="form.password"
        placeholder="Password"
        type="password"
        @keyup.enter="restore()"
      ></Input>
    </div>
    <div class="pt-2">
      <Label>Enter password confirmation</Label>
      <Input
        v-model="form.passwordConfirmation"
        placeholder="Password confirmation"
        type="password"
        @keyup.enter="restore()"
      ></Input>
    </div>
    <div v-if="error" class="bg-red-100 p-2 rounded-md mt-2">{{ error }}</div>
    <div class="pt-4">
      <Button :disabled="isDisabled" @click="restore()">Restore</Button>
    </div>
  </div>
</template>
