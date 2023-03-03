<script setup lang="ts">
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import Label from '../../shared/Label.vue';
import Input from '../../shared/Input.vue';
import { computed, ref } from 'vue';
import Button from '../../shared/Button.vue';
import { store } from '../../state/store';
import { useRouter } from 'vue-router';

const form = ref({
  password: '',
  password_confirmation: '',
});

const isDisabled = computed(() => {
  return form.value.password === '' || form.value.password !== form.value.password_confirmation;
});

const router = useRouter();

const createWallet = async () => {
  if (isDisabled.value) return;
  store.wallet = await chrome.runtime.sendMessage({
    msg: 'createNewWallet',
    data: {
      password: form.value.password,
    },
  });
  router.push({ path: '/seeds' });
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
        name="password"
        type="password"
        v-model="form.password"
        placeholder="Password"
        @keyup.enter="createWallet()"
      ></Input>
    </div>
    <div class="pt-2">
      <Label>Enter password confirmation</Label>
      <Input
        name="password_confirmation"
        v-model="form.password_confirmation"
        placeholder="Password confirmation"
        type="password"
        @keyup.enter="createWallet()"
      ></Input>
    </div>
    <div class="pt-4">
      <Button :disabled="isDisabled" @click="createWallet()">Next</Button>
    </div>
  </div>
</template>
