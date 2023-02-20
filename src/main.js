import { createApp } from 'vue';
import App from './App.vue';
import NewsGearsWebPlugin from '@/newsgears-web/newsgears-web-plugin';
import NewsGearsThemePlugin from '@/newsgears-theme/newsgears-theme-plugin';
import router from './router';
import { autoAnimatePlugin } from '@formkit/auto-animate/vue';
import VuePlyr from 'vue-plyr';
import VueAnnouncer from '@vue-a11y/announcer'

import '@vue-a11y/announcer/dist/style.css'
import 'vue-plyr/dist/vue-plyr.css'
import 'font-awesome/scss/font-awesome.scss'
import 'flag-icons/css/flag-icons.min.css';

// import { loadStripe } from '@stripe/stripe-js'
// import { defineComponent, ref, onBeforeMount } from 'vue'

// export default defineComponent({
//   // ...
//   setup() {
//     onBeforeMount(() => {
//       const stripeLoaded = ref(false)
//       const stripePromise = loadStripe('your_key')
//       stripePromise.then(() => {
//         stripeLoaded.value = true
//       })
//     })
//   },
// })

createApp(App, {})
    .use(NewsGearsWebPlugin, {})
    .use(NewsGearsThemePlugin)
    .use(router)
    .use(autoAnimatePlugin)
    .use(VuePlyr, {
      plyr: {}
    })
    .use(VueAnnouncer)
    .mount('#app');
