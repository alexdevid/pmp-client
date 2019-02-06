<template>
    <div class="homepage">
        <Playlist :showLoadingIfEmpty="false" :apiParams="apiParams"></Playlist>
    </div>
</template>

<script>
    import Playlist from "@/components/Playlist.vue";
    import events from "../events";

    export default {
        name: "Home",

        data: function () {
            return {
                apiParams: {
                    url: '/audio'
                }
            };
        },
        mounted() {
            this.$root.$on(events.SEARCH.QUERY_CHANGE, query => {
                this.filterAudio(query);
            });
            this.$root.$on("userLogout", () => {
                this.logout();
            });
        },
        components: {Playlist}
    };
</script>
