<template>
    <div class="homepage">
        <Playlist :tracks="tracks" v-if="!empty"></Playlist>
        <div class="row" v-if="empty">
            There are no any tracks uploaded :(
        </div>
    </div>
</template>

<script>
    import Playlist from "@/components/Playlist.vue";
    import Client from "../client";

    export default {
        name: "Home",

        data: function () {
            return {
                empty: false,
                tracks: []
            };
        },
        created: function () {
            this.$root.$on("userLogout", () => {
                this.logout();
            });
            Client.get("/audio", response => {
                this.tracks = response.data;
                if (response.data.length === 0) {
                    this.empty = true;
                }
            });
        },
        components: {Playlist}
    };
</script>
