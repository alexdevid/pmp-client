<template>
    <div class="top-nav">
        <router-link to="/" class="top-nav-item">
            <i class="fa fa-music"></i> Music
        </router-link>
        <router-link to="/radio" class="top-nav-item">
            <i class="fa fa-broadcast-tower"></i> Radio
        </router-link>
        <router-link to="/users" class="top-nav-item">
            <i class="fa fa-users"></i> Users
        </router-link>
        <router-link to="/profile" class="top-nav-item top-nav-item-user" v-if="$store.state.user !== null">
            <i class="fa fa-user"></i> {{ $store.state.user.username }}
        </router-link>
        <router-link to="/login" class="top-nav-item top-nav-item-user" v-if="$store.state.user === null">
            Login
        </router-link>
    </div>
</template>

<script>
export default {
  name: "TopNav",
  components: {},
  mounted() {}
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

    &-user {
      margin-left: auto;
    }

    &:hover {
      color: #fff;
      background-color: lighten(#2f4f4f, 10);
    }
  }
}
</style>
