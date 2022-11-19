import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import "../src/assets/style.css";
import BootstrapVue3 from 'bootstrap-vue-3'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import {BToastPlugin} from 'bootstrap-vue-3'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faFaceSmile, faFaceSurprise, faFaceGrinStars, faTrashCan,  } from '@fortawesome/free-regular-svg-icons';
import { faCamera, faXmark } from '@fortawesome/free-solid-svg-icons'
import VueAxios from 'vue-axios';
import axios from 'axios';

library.add(faFaceSmile, faFaceSurprise, faFaceGrinStars, faCamera, faTrashCan, faXmark)

const app = createApp(App)
app.use(BootstrapVue3)
app.use(router)
app.use(BToastPlugin)
app.use(VueAxios, axios)
app.component("font-awesome-icon", FontAwesomeIcon)
app.mount('#app')
