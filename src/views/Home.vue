<template>
    <div class="homepage">
        <Playlist :tracks="tracks" :showLoadingIfEmpty="false"></Playlist>
        <div class="row" v-if="empty">
            There are no any tracks uploaded :(
        </div>
    </div>
</template>

<script>
    import Playlist from "@/components/Playlist.vue";
    import events from "../events";
    import client from "../services/api-client";
    import auth from "../services/authorization";

    export default {
        name: "Home",

        data: function () {
            return {
                empty: false,
                tracks: []
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
            client.get('/audio').then(response => {
                this._updateAudioFromResponse(response);
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
