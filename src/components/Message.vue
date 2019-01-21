<template>
    <div class="message" :class="type" v-if="!hide">
        <div class="message-header">
            <slot name="header"></slot>
            <i class="fa fa-times" @click="hide = true;"></i>
        </div>
        <div class="message-body">
            <slot name="body"></slot>
        </div>
    </div>
</template>

<script>
export default {
  name: "Message",
  props: ["type"],
  data: function() {
    return {
      hide: false
    };
  }
};
</script>

<style lang="less">
@import "../assets/less/form";

.message {
  position: fixed;
  top: 70px;
  right: 20px;
  border-radius: 2px;
  border: 1px solid #d2d2d2;
  background-color: #dddddd;

  &.relative {
    position: relative !important;
    top: auto !important;
    right: auto !important;
  }

  &.error {
    border-color: #db2828;
    background-color: #ffe8e6;
    color: #db2828;
  }

  &-header {
    padding: 5px 40px 0 10px;
    font-weight: bold;
    position: relative;

    .fa {
      cursor: pointer;
      position: absolute;
      top: 9px;
      right: 10px;
    }
  }
  &-body {
    padding: 5px 10px;
  }
}
</style>
