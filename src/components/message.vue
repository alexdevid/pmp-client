<template>
    <div class="message" :class="className">
        <div class="message-header" v-if="header">
            <div v-html="header"></div>
        </div>
        <div class="message-body" v-html="message"></div>
        <i class="fa fa-times" @click="$emit('close')"></i>
    </div>
</template>

<script>
    const MESSAGE_TYPE_INFO = 'info';
    const MESSAGE_TYPE_ERROR = 'error';

    export default {
        name: "message",
        props: ['message', 'header', 'type'],
//        props: {
//            message: {
//                type: String,
//                required: true
//            },
//            header: {
//                type: String,
//                required: false
//            },
//            type: {
//                type: String,
//                required: true
//            },
//            hide: {
//                type: Boolean,
//                required: true
//            }
//        },
        data() {
            return {
                className: 'message-' + this.type
            };
        }
    };
</script>

<style lang="less">
    @import "../assets/less/form";

    .message {
        position: relative;
        border-radius: 2px;
        border: 1px solid #d2d2d2;
        background-color: #dddddd;
        margin-bottom: 20px;

        &-error {
            border-color: #db2828;
            background-color: #ffe8e6;
            color: #db2828;
        }

        .fa {
            cursor: pointer;
            position: absolute;
            top: 9px;
            right: 10px;
        }

        &-header {
            padding: 5px 40px 0 10px;
            font-weight: bold;
            position: relative;
        }
        &-body {
            padding: 5px 10px;
        }
    }
</style>
