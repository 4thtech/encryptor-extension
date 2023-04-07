import { createApp } from 'vue';
import './style.css';
import App from '@/popup/Popup.vue';
import router from '@/router';
import { MessageType, WalletState } from '@/types';

createApp(App).use(router).mount('#app');

chrome.runtime
  .sendMessage({
    msg: MessageType.GET_ENCRYPTOR_STATE,
  })
  .then(async ({ state }) => {
    switch (state) {
      case WalletState.UNLOCKED:
        return router.push('/main');

      case WalletState.LOCKED:
        return router.push('/unlock');

      case WalletState.NOT_GENERATED:
      default:
        return router.push('/welcome');
    }
  });
