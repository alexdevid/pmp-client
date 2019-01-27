<template>
    <div class="search">
        <input type="search" class="input" placeholder="Search" v-model="query">
    </div>
</template>

<script>
    import Events from '../events';

    export default {
        name: "Search",
        data() {
            return {
                query: null
            }
        },
        methods: {
            emit() {
                console.log(this.query);
                this.$root.$emit(Events.SEARCH.QUERY_CHANGE, this.query);
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
        .input {
            padding: 10px;
        }
    }
</style>
