<template>
    <div class="login-page">
        <form class="login-form" @submit.prevent="login" :class="{loading: loading}">
            <div class="page-loading">
                <i class="fas fa-sync-alt fa-spin"></i>
            </div>
            <h1>Login</h1>
            <Message v-if="error" :type="'error relative'">
                <div slot="body">
                    {{ error }}
                </div>
            </Message>
            <label>User name</label>
            <input required v-model="username" type="text" class="input"/>
            <label>Password</label>
            <input required v-model="password" type="password" class="input"/>
            <button type="submit" class="button">Login</button>
        </form>
    </div>
</template>

<style src="../assets/less/form.less" lang="less">
</style>
<style scoped lang="less">
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
    import Message from "@/components/Message.vue";
    import auth from '../services/authorization';
    import events from '../events';

    export default {
        name: "login",
        data: function () {
            return {
                username: null,
                password: null,
                error: null,
                loading: false
            };
        },
        components: {Message},
        methods: {
            login: function () {
                const {username, password} = this;
                this.loading = true;
                auth.login(username, password).then(response => {
                    this.$root.$emit(events.AUTHORIZATION.SUCCESS, {
                        username: response.body.username,
                        roles: response.body.roles
                    });
                    this.loading = false;
                    this.$router.push("/");
                }, error => {
                    this.error = error.message;
                    this.loading = false;
                    this.$root.$emit(events.AUTHORIZATION.FAILURE, username)
                });
            }
        }
    };
</script>
