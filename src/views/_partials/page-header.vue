<template>
    <div class="page-header">
        <div class="page-header-header">
            <div class="page-header-image">
                <img :src="image">
            </div>
            <div class="page-header-info">
                <h1>{{ title }}</h1>
                <div class="page-header-body">
                    <slot name="body"></slot>
                </div>
                <div class="page-header-controls">
                    <slot name="controls"></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            image: {
                type: String,
                required: true
            },
            title: {
                type: String,
                required: true
            }
        },
        name: "page-header",
    };
</script>

<style lang="less" scoped>
    @import "../../assets/less/tag.less";

    .page-header {
        h1 {
            margin: 0 0 10px;
            line-height: 26px;
        }

        &-header {
            display: flex;
            padding: 0 10px;
            margin-bottom: 30px;
        }

        &-image img {
            width: 150px;
            height: 150px;
            border: 1px solid #cecece;
            border-radius: 2px;
        }
        &-info {
            margin-left: 20px;
            display: flex;
            flex-direction: column;
            height: 152px;
        }

        &-controls {
            margin-top: auto;
            text-transform: uppercase;

            a {
                margin: 0 20px;

                &:first-child {
                    margin-left: 0;
                }
            }
        }
    }
</style>