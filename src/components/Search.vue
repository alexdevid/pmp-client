<template>
    <div class="search">
        <input type="search" class="input" placeholder="Search">
    </div>
</template>

<script>
export default {
  name: "Search",
  props: {}
};
</script>

<style scoped lang="less">
.search {
  margin: 0 10px 15px;
  .input {
    padding: 10px;
  }
}
</style>
