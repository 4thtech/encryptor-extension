import { createRouter, createWebHistory } from 'vue-router';
import Welcome from '@pages/Welcome.vue';
import Create from '@pages/Create.vue';
import Seeds from '@pages/Seeds.vue';
import Main from '@pages/Main.vue';
import Unlock from '@pages/Unlock.vue';
import Restore from '@pages/Restore.vue';
import Loading from '@pages/Loading.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: 'loading' },
    { path: '/popup.html', redirect: 'loading' },
    { path: '/welcome', component: Welcome },
    { path: '/create', component: Create },
    { path: '/seeds', component: Seeds },
    { path: '/main', component: Main },
    { path: '/unlock', component: Unlock },
    { path: '/restore', component: Restore },
    { path: '/loading', component: Loading },
  ],
});

export default router;
