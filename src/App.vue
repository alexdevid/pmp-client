<template>
    <div id="app" v-bind:class="{ homepage: $router.currentRoute.name === 'home' }">
        <div class="header">
            <TopNav></TopNav>
        </div>
        <Player></Player>
        <div class="page-loading" v-if="!displayView">
            <i class="fas fa-sync-alt fa-spin"></i>
        </div>
        <div class="content" v-if="displayView">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import Player from "./components/Player.vue";
    import TopNav from "./components/TopNav.vue";
    import Client from "./services/api/api-client.js";
    import events from "./events";

    export default {
        name: "app",
        data: function () {
            return {
                authorized: false,
                displayView: false
            };
        },
        mounted() {
            this.$root.$on(events.AUTHORIZATION.LOGOUT, () => {
                this.logout();
            });
            this.$root.$on(events.AUTHORIZATION.SUCCESS, username => {
                this.authorized = true;
                this.showLoginMessage = false;
            });
            this.$root.$on(events.AUTHORIZATION.FAILURE, () => {
                this.authorized = false;
                this.showLoginMessage = true;
            });
            this.$root.$on(events.AUTHORIZATION.COMPLETE, () => {
                this.displayView = true;
            });
        },
        methods: {
            logout() {
                this.authorized = false;
                this.$store.state.user = null;
                localStorage.removeItem("credentials");
                this.$router.push("/");
            }
        },
        components: {
            Player,
            TopNav
        },
    };
</script>
<style src="./assets/less/globals.less" lang="less">
</style>
<style src="./assets/less/form.less" lang="less">
</style>
<style src="./assets/less/track.less" lang="less">
</style>
<style scoped lang="less">
    .header {
        position: fixed;
        height: 50px;
        width: 100%;
        top: 0;
        left: 0;
        background-color: #2f4f4f;
        z-index: 1001;
    }
</style>
