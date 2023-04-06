<script setup lang="ts">
type InputProps = {
  modelValue: string;
};

defineProps<InputProps>();
const emit = defineEmits(['update:modelValue']);

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};
</script>

<template>
  <input
    :value="modelValue"
    type="text"
    @input="onInput"
    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm"
  />
</template>
