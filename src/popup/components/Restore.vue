<script setup lang="ts">
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import Label from '../../shared/Label.vue';
import Input from '../../shared/Input.vue';
import { computed, ref } from 'vue';
import Button from '../../shared/Button.vue';
import { store } from '../../state/store';
import { useRouter } from 'vue-router';

const form = ref({
  seeds: '',
  password: '',
  password_confirmation: '',
});

const router = useRouter();
const error = ref();
const isDisabled = computed(() => {
  return (
    form.value.password === '' ||
    form.value.password !== form.value.password_confirmation ||
    form.value.seeds === ''
  );
});

const restore = async () => {
  if (isDisabled.value) return;

  const wallet = await chrome.runtime.sendMessage({
    msg: 'restoreWallet',
    data: {
      password: form.value.password,
      seeds: form.value.seeds,
    },
  });
  if (wallet) {
    store.wallet = wallet;
    router.push({ path: '/main' });
  } else {
    error.value = 'Invalid seeds.';
  }
};
</script>

<template>
  <div class="p-4 bg-gray-100 shadow-m flex items-center space-x-4">
    <router-link to="/popup.html">
      <ArrowLeftIcon class="h-6 w-6 cursor-pointer" />
    </router-link>
    <div class="text-[1rem]">Restore</div>
  </div>
  <div class="p-4">
    <div>
      <Label>Enter seeds</Label>
      <textarea
        name="seeds"
        v-model="form.seeds"
        placeholder="Seeds"
        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
      />
    </div>

    <div class="pt-2">
      <Label>Enter password</Label>
      <Input
        name="password"
        type="password"
        v-model="form.password"
        placeholder="Password"
        @keyup.enter="restore()"
      ></Input>
    </div>
    <div class="pt-2">
      <Label>Enter password confirmation</Label>
      <Input
        name="password_confirmation"
        v-model="form.password_confirmation"
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
