<template>
    <div class="playlist">
        <Playlist :showLoadingIfEmpty="false" :apiParams="apiParams"></Playlist>
    </div>
</template>

<style src="../assets/less/playlist.less" lang="less">
</style>
<script>
    import Playlist from "@/components/Playlist.vue";

    export default {
        name: "radio",
        data() {
            return {
                apiParams: {
                    url: '/radio'
                }
            }
        },
        created: function () {
//            client.get('/radio').then(
//                response => {
//                    this.stations = response.body;
//                    this.loaded = true;
//                }, error => {
//                    console.error(error);
//                });
        },
        methods: {
            handleFav: function (station) {
//                station.favourite = !station.favourite;
            },
            play(station) {
//                this.$root.$emit(Events.PLAYER.PLAY, station);
//                this.paused = null;
//                this.playing = station.id;
            }
        },
        components: {
            Playlist
        }
    };
</script>
