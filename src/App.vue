<template>
    <div id="app" v-bind:class="{ homepage: $router.currentRoute.name === 'home' }">
        <div class="header" v-if="authorized">
            <TopNav></TopNav>
        </div>
        <Player v-if="authorized"></Player>
        <div class="navigation" v-if="authorized">
            <router-link to="/profile/music">My Music</router-link>
            <router-link to="/profile/playlists">My Playlists</router-link>
            <router-link to="/upload" class="audio-upload"><i class="fa fa-cloud-upload-alt"></i> Upload</router-link>
        </div>
        <div class="content">
            <div class="page-loading" v-if="!authorized">
                <i class="fas fa-sync-alt fa-spin"></i>
            </div>
            <router-view v-if="authorized"></router-view>
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
    import Client from "./client.js";
    import Events from "./events";

    export default {
        name: "app",
        data: function () {
            return {
                authorized: false,
                showLoginMessage: false
            };
        },
        mounted() {
            this.$root.$on(Events.PLAYER.PLAY, track => {
            });
            this.$root.$on("userLogout", () => {
                this.logout();
            });
            this.$root.$on(Events.AUTHORIZATION.SUCCESS, username => {
                console.log(Events.AUTHORIZATION.SUCCESS);
                this.authorized = true;
                this.showLoginMessage = false;
                this.$store.state.user = {username: username};
            });
            this.$root.$on(Events.AUTHORIZATION.FAILURE, username => {
                console.log(Events.AUTHORIZATION.FAILURE);
                this.authorized = false;
                this.$store.state.user = null;
                this.showLoginMessage = true;
            });
            this.$root.$on(Events.AUTHORIZATION.UNKNOWN, () => {
                console.log(Events.AUTHORIZATION.UNKNOWN);
                this.$router.push("/login");
            });
        },
        methods: {
            checkLogin() {
            },
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

    .navigation {
        margin: 0 10px 15px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #7d7d7d;

        a {
            text-transform: uppercase;
            display: inline-block;
            margin-right: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid transparent;
            color: #7d7d7d;

            &.router-link-exact-active {
                color: #000;
                pointer-events: none;
                border-color: #000;
            }
        }

        .audio-upload {
            margin-left: auto;
            margin-right: 0;
        }
    }
</style>
