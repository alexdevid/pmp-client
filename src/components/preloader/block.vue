<template>
    <div class="page-loading" v-if="show" :class="{fixed: 'page-loading-fixed'}">
        <i class="fas fa-sync-alt fa-spin"></i>
    </div>
</template>

<script>
    export default {
        name: "block-preloader",
        props: ['show', 'fixed']
    };
</script>

<style lang="less" scoped>
    .page-loading {
        text-align: center;
        font-size: 20px;
        margin: 100px auto;

        &.page-loading-fixed {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            z-index: 10;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0;
            background-color: rgba(255, 255, 255, 0.5);
        }
    }
</style>