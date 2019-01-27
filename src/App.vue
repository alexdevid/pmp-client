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
        <Message v-if="showLoginMessage" :type="'error'">
            <div slot="header">Authorization Error</div>
            <div slot="body">
                <p>
                    There was an error with your authorization. <br>
                    Please log-in again
                </p>
            </div>
        </Message>
    </div>
</template>

<script>
    import Player from "@/components/Player.vue";
    import TopNav from "@/components/TopNav.vue";
    import Message from "@/components/Message.vue";
    import Client from "./services/api-client.js";
    import Events from "./events";

    export default {
        name: "app",
        data: function () {
            return {
                authorized: false,
                showLoginMessage: false,
                displayView: false
            };
        },
        mounted() {
            this.$root.$on("userLogout", () => {
                this.logout();
            });
            this.$root.$on(Events.AUTHORIZATION.SUCCESS, username => {
                this.authorized = true;
                this.showLoginMessage = false;
            });
            this.$root.$on(Events.AUTHORIZATION.FAILURE, username => {
                this.authorized = false;
                this.showLoginMessage = true;
            });
            this.$root.$on(Events.AUTHORIZATION.COMPLETE, () => {
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
            TopNav,
            Message
        },
        watch: {
            $route: function (from, to) {
                //                this.checkLogin();
            }
        }
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
