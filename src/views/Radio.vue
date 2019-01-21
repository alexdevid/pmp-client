<template>
    <div class="playlist">
        <Search></Search>
        <div class="page-loading" v-if="!loaded">
            <i class="fas fa-sync-alt fa-spin"></i>
        </div>
        <div class="track" v-for="station in stations" @click="play(station)" v-bind:class="{active: playing === station.id}">
            <div class="track-image">
                <img src="../assets/trackpic.jpg" alt="">
                <div class="track-play-overlay">
                    <i class="fa fa-play" v-if="playing !== station.id || !playing || paused && playing === station.id"></i>
                    <i class="fa fa-pause" v-if="!paused && playing === station.id"></i>
                </div>
                <div class="track-play-overlay track-play-overlay-playing" v-if="playing === station.id">
                    <i class="fa fa-play" v-if="playing !== station.id || !playing || paused && playing === station.id"></i>
                    <i class="fa fa-pause" v-if="!paused && playing === station.id"></i>
                </div>
            </div>
            <div class="track-info">
                <div class="track-title">
                    {{ station.title }}
                </div>
                <div class="track-artist">
                    {{ station.genre }}
                </div>
            </div>
            <div class="track-duration">
                {{ station.country }}
            </div>
            <div class="track-controls">
                    <span class="player-control control-fav" @click.stop="handleFav(station)">
                        <i class="far fa-heart" v-if="!station.favourite"></i>
                        <i class="fas fa-heart" v-if="station.favourite"></i>
                    </span>
                <span class="player-control" @click.stop="false"><i class="fa fa-ellipsis-v"></i></span>
            </div>
            <div class="clear"></div>
        </div>
    </div>
</template>

<style src="../assets/less/playlist.less" lang="less"></style>
<script>
    import Search from "@/components/Search.vue";
    import Events from '../events';

    export default {
        name: 'radio',
        data: function () {
            return {
                playing: null,
                paused: null,
                loaded: false,
                stations: []
            };
        },
        created: function () {
            this.$http
                .get("http://music.test/index.php/api/radio")
                .then(function (response) {
                    this.stations = response.data;
                    this.loaded = true;
                });
        },
        methods: {
            handleFav: function (station) {
                station.favourite = !station.favourite;
            },
            play(station) {
                this.$root.$emit(Events.PLAYER.PLAY, station);
                this.paused = null;
                this.playing = station.id;
            }
        },
        components: {
            Search
        }
    }
</script>