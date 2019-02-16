<template>
    <div class="login-page">
        <form class="login-form" @submit.prevent="login" :class="{loading: loading}">
            <div class="page-loading">
                <i class="fas fa-sync-alt fa-spin"></i>
            </div>
            <h1>Login</h1>
            <message :type="'error'" :message="error" v-if="error != null" @close="error = null"></message>
            <label>User name</label>
            <input required v-model="username" type="text" class="input"/>
            <label>Password</label>
            <input required v-model="password" type="password" class="input"/>
            <button type="submit" class="button">Login</button>
        </form>
    </div>
</template>

<style scoped lang="less">
    @import "../assets/less/form";

    .login-form {
        width: 50%;
        margin: 0 auto;
        position: relative;

        &.loading {
            opacity: .5;
            pointer-events: none;

            .page-loading {
                display: flex;
            }
        }

        .page-loading {
            display: none;
            margin: 0 auto;
            position: absolute;
            flex-direction: column;
            justify-content: center;
            width: 100%;
            height: 100%;
        }
    }
</style>
<script>
    import message from "../components/message.vue";
    import auth from '../services/authorization';
    import events from '../events';

    export default {
        name: "login",
        components: {message},
        data: function () {
            return {
                username: null,
                password: null,
                error: null,
                loading: false,
            };
        },
        methods: {
            login: function () {
                const {username, password} = this;
                this.loading = true;
                auth.login(username, password).then(response => {
                    this.error = null;
                    this.$root.$emit(events.AUTHORIZATION.SUCCESS, {
                        username: response.body.username,
                        roles: response.body.roles
                    });
                    this.loading = false;
                    this.$router.push("/");
                }, error => {
                    this.error = error.body.message;
                    this.loading = false;
                    this.$root.$emit(events.AUTHORIZATION.FAILURE, username)
                });
            }
        }
    };
</script>
