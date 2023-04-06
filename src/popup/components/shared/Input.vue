<script setup lang="ts">
type SupportCardFormInputProps = {
  modelValue: string;
};

const emit = defineEmits(['update:modelValue']);
defineProps<SupportCardFormInputProps>();
const handleEvent = (event: Event) => {
  const target = event.target as HTMLInputElement;

  emit('update:modelValue', target.value);
};
</script>

<template>
  <input
    :value="modelValue"
    type="text"
    @input="handleEvent"
    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm"
  />
</template>
