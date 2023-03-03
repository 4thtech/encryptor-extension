import { createApp } from 'vue';
import './style.css';
import App from './Popup.vue';
import { createRouter, createWebHistory } from 'vue-router';
import Welcome from './components/Welcome.vue';
import Create from './components/Create.vue';
import Seeds from './components/Seeds.vue';
import Main from './components/Main.vue';
import Unlock from './components/Unlock.vue';
import Restore from './components/Restore.vue';

const app = createApp(App);
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
app.use(router);
app.mount('#app');
