<template>
    <transition name="modal">
        <div class="modal">
            <div class="modal-overlay">
                <div class="modal-container" :style="{width: width}">
                    <div class="modal-header">
                        <slot name="header">
                            default body
                        </slot>
                    </div>
                    <div class="modal-body">
                        <slot name="body">
                            default body
                        </slot>
                    </div>
                    <div class="modal-footer">
                        <slot name="footer">
                            <button class="button" @click="$emit('close')">
                                Close
                            </button>
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
  name: "Modal",
  props: ["width"],
  data: function() {
    return {};
  }
};
</script>

<style lang="less">
.modal {
  &-overlay {
    position: fixed;
    z-index: 1100;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    transition: opacity 0.1s ease;
  }
  &-container {
    max-width: 600px;
    margin: 200px auto;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.1s ease;
    font-family: Helvetica, Arial, sans-serif;
  }
  &-header {
    background-color: #2f4f4f;
    padding: 10px 20px;
    color: #fff;
  }
  &-body {
    padding: 10px 20px;
  }
  &-footer {
    padding: 15px 20px;
    text-align: right;
  }
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  transform: translate(0, -30px);
}
</style>
