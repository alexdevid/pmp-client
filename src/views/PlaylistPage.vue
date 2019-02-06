<template>
    <div class="playlist-page">
        <PlaylistHeader :playlist="playlist"></PlaylistHeader>
        <Playlist :tracks="tracks" v-if="!empty" :hideSearch="true"></Playlist>
        <div class="row" v-if="empty">
            There are no any tracks in this playlist :(
        </div>
    </div>
</template>

<script>
    import Playlist from "@/components/Playlist.vue";
    import PlaylistHeader from "@/components/PlaylistHeader.vue";
    import Client from "../services/api/api-client";

    export default {
        name: "PlaylistPage",

        data: function () {
            return {
                empty: false,
                playlist: {},
                tracks: []
            };
        },
        created: function () {
            Client.get('/audio/playlist/' + this.$route.params.id, {}, response => {
                this.tracks = response.data;
                if (response.data.length === 0) {
                    this.empty = true;
                }
            }, error => {console.log(error)});

            Client.get('/playlist/' + this.$route.params.id, {}, response => {
                this.playlist = response.data;
            }, error => {console.log(error)});
        },
        components: {Playlist, PlaylistHeader}
    };
</script>
