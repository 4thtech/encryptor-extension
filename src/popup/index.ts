import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import './style.css';
import App from '@/popup/Popup.vue';
import Welcome from '@pages/Welcome.vue';
import Create from '@pages/Create.vue';
import Seeds from '@pages/Seeds.vue';
import Main from '@pages/Main.vue';
import Unlock from '@pages/Unlock.vue';
import Restore from '@pages/Restore.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/popup.html', component: Welcome },
    { path: '/create', component: Create },
    { path: '/seeds', component: Seeds },
    { path: '/main', component: Main },
    { path: '/unlock', component: Unlock },
    { path: '/restore', component: Restore },
  ],
});

createApp(App).use(router).mount('#app');
