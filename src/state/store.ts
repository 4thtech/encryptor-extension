// store.js
import { reactive } from 'vue';
import { HDNodeWallet } from 'ethers';

export const store = reactive<{ wallet: HDNodeWallet | undefined }>({
  wallet: undefined,
});
