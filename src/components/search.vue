<template>
    <div class="search">
        <input type="text" class="input" placeholder="Search" v-model="query" ref="input">
        <span class="search-loading" v-if="loading"><i class="fas fa-sync-alt fa-spin"></i></span>
    </div>
</template>

<script>
    import events from '../events';

    export default {
        props: {
            loading: {
                type: Boolean
            },
            autofocus: {
                type: Boolean,
                required: false
            }
        },
        name: "search",
        data() {
            return {
                query: null
            }
        },
        mounted() {
            if (this.autofocus) {
                this.$refs.input.focus();
            }
        },
        methods: {
            emit() {
                this.$emit('change', this.query);
            }
        },
        watch: {
            query: 'emit'
        }
    };
</script>

<style scoped lang="less">
    .search {
        margin: 0 10px 15px;
        position: relative;
        .input {
            padding: 10px;
        }

        &-loading {
            position: absolute;
            right: 15px;
            top: 8px;
        }
    }
</style>
