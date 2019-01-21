<template>
    <div class="login-page">
        <form class="login-form" @submit.prevent="login">
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
}
</style>
<script>
import Message from "@/components/Message.vue";
import Client from "../client.js";

export default {
  name: "login",
  data: function() {
    return {
      username: null,
      password: null,
      error: null
    };
  },
  components: { Message },
  methods: {
    login: function() {
      const { username, password } = this;
      Client.getToken(
        { username: username, password: password },
        () => {
          this.$store.state.user = { username: username };
          localStorage.setItem(
            "credentials",
            JSON.stringify({ username: username, password: password })
          );
          this.$root.$emit("userLogged", username);
          this.$router.push("/");
        },
        error => {
          this.error = error.message;
        }
      );
    }
  }
};
</script>
