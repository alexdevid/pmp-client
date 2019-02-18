<template>
    <div class="homepage">
        <search :loading="searching" @change="onSearchValueChange"></search>
    </div>
</template>

<script>
    import search from "../components/search.vue";

    export default {
        name: "home",
        components: {search},
        data() {
            return {
                searching: false
            }
        },
        methods: {
            onSearchValueChange(query) {
                if (query.length < 3) {
                    return;
                }

                console.log(query)
            }
        }
    };
</script>

<style scoped lang="less">
    .homepage {
        padding: 100px 0;
    }
</style>
