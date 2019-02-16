<template>
    <div class="albums-page">
        <h1>hello albums</h1>
    </div>
</template>

<script>
    import Playlist from "@/components/Playlist.vue";
    import PlaylistHeader from "@/components/PlaylistHeader.vue";
    import Client from "../services/api/api-client";

    export default {
        name: "albums",

        data () {
            return {};
        },
        components: {}
    };
</script>
