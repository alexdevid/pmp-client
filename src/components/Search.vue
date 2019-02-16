<template>
    <div class="search">
        <input type="text" class="input" placeholder="Search" v-model="query">
        <span class="search-loading" v-if="loading"><i class="fas fa-sync-alt fa-spin"></i></span>
    </div>
</template>

<script>
    import events from '../events';

    export default {
        props: ['loading'],
        name: "Search",
        data() {
            return {
                query: null
            }
        },
        methods: {
            emit() {
                this.$root.$emit(events.SEARCH.QUERY_CHANGE, this.query);
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
