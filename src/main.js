import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueResource from "vue-resource";
import auth from './services/authorization';
import client from './services/api/api-client';
import events from './events';

Vue.config.productionTip = false;
Vue.use(VueResource);

new Vue({
    router,
    store,
    mounted() {

        this.$root.$on(events.AUTHORIZATION.SUCCESS, user => {
            this.$store.state.user = user;
            this.$root.$emit(events.AUTHORIZATION.COMPLETE, user);
        });
        this.$root.$on(events.AUTHORIZATION.FAILURE, username => {
            this.$store.state.user = null;
        });
        this.$root.$on(events.AUTHORIZATION.LOGOUT, () => {
            auth.logout();
            client.setToken(null);
            this.$store.state.user = null;
            this.$router.push('/');
        });

        const promise = auth.checkToken();
        if (!promise) {
            this.$root.$emit(events.AUTHORIZATION.COMPLETE, null);
        } else {
            promise.then(
                response => {
                    this.$root.$emit(events.AUTHORIZATION.SUCCESS, {
                        username: response.body.username,
                        roles: response.body.roles
                    });
                }, error => {
                    this.$root.$emit(events.AUTHORIZATION.FAILURE, null);
                    this.$root.$emit(events.AUTHORIZATION.COMPLETE, null);
                }
            );
        }
    },
    created() {
    },
    render: h => h(App)
}).$mount("#app");
