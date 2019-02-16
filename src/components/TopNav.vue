<template>
    <div class="top-nav">
        <router-link to="/" class="top-nav-item">
            Music
        </router-link>
        <router-link to="/profile" class="top-nav-item top-nav-item-user" v-if="$store.state.user !== null">
            {{ $store.state.user.username }} <i class="fa fa-user"></i>
        </router-link>
        <router-link to="/login" class="top-nav-item top-nav-item-user" v-if="$store.state.user === null && authorized">
            Login
        </router-link>
    </div>
</template>

<script>
    import events from '../events';

    export default {
        name: "TopNav",
        components: {},
        data: function () {
            return {
                authorized: false
            };
        },
        mounted() {
            this.$root.$on(events.AUTHORIZATION.COMPLETE, user => {
                this.authorized = true;
            });
        }
    };
</script>

<style lang="less">
    .top-nav {
        max-width: 960px;
        margin: 0 auto;
        display: flex;

        &-item {
            padding: 14px 10px;
            color: #fff;
            display: inline-block;

            &-user {
                margin-left: auto;
            }

            &:hover,
            &.router-link-exact-active {
                color: #fff;
                text-decoration: none;
                background-color: lighten(#2f4f4f, 10);
            }
        }
    }
</style>
