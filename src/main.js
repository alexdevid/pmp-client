import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueResource from "vue-resource";
import Client from './client';
import Events from './events'

Vue.config.productionTip = false;
Vue.use(VueResource);

new Vue({
    router,
    store,
    mounted () {
        if (localStorage.hasOwnProperty("credentials")) {
            const credentials = JSON.parse(localStorage.getItem('credentials'));
            //check authorization and get new token
            Client.getToken({username: credentials.username, password: credentials.password}, () => {
                this.$root.$emit(Events.AUTHORIZATION.SUCCESS, credentials.username);
            }, () => {
                this.$root.$emit(Events.AUTHORIZATION.FAILURE, credentials.username);
            });
        } else {
            this.$root.$emit(Events.AUTHORIZATION.UNKNOWN);
        }
    },
    render: h => h(App)
}).$mount("#app");
