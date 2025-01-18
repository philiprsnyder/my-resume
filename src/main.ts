import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
/*
const app = createApp(App)
app.use(router)
app.mount('#app')
*/

// import { IonicVue } from '@ionic/vue';
// import '@ionic/vue/css/core.css';
// import '@ionic/vue/css/ionic.bundle.css';

const app = createApp(App)
  // .use(IonicVue)
  .use(router);

app.mount('#app');
