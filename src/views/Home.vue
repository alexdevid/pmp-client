<template>
    <div class="homepage">
        <Playlist :showLoadingIfEmpty="false" :apiParams="apiParams"></Playlist>
    </div>
</template>

<script>
    import Playlist from "@/components/Playlist.vue";
    import events from "../events";
    import client from "../services/api/api-client";
    import auth from "../services/authorization";

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
        },
        created: function () {
            this.$root.$on("userLogout", () => {
                this.logout();
            });
        },
        methods: {
            filterAudio(query) {
                client.get("/audio", {'query': query}).then(response => {
                    this._updateAudioFromResponse(response);
                });
            },

            /**
             * @param {Object} response
             * @private
             */
            _updateAudioFromResponse(response) {
                this.tracks = response.data.collection;
                if (response.data.length === 0) {
                    this.empty = true;
                }
            }
        },
        components: {Playlist}
    };
</script>
