<template>
    <div class="playlist">
        <Search v-if="tracks.length > 0"></Search>
        <div class="page-loading" v-if="tracks.length === 0">
            <i class="fas fa-sync-alt fa-spin"></i>
        </div>
        <div class="track" v-for="track in tracks" @click="play(track)" v-bind:class="{active: playing === track.id}">
            <div class="track-image">
                <img src="../assets/trackpic.jpg" v-if="!track.cover">
                <img :src="track.cover" v-if="track.cover">
                <div class="track-play-overlay">
                    <i class="fa fa-play" v-if="playing !== track.id || !playing || paused && playing === track.id"></i>
                    <i class="fa fa-pause" v-if="!paused && playing === track.id"></i>
                </div>
                <div class="track-play-overlay track-play-overlay-playing" v-if="playing === track.id">
                    <i class="fa fa-play" v-if="playing !== track.id || !playing || paused && playing === track.id"></i>
                    <i class="fa fa-pause" v-if="!paused && playing === track.id"></i>
                </div>
            </div>
            <div class="track-info">
                <div class="track-title">
                    {{ track.title }}
                </div>
                <div class="track-artist">
                    <span v-if="track.artist">{{ track.artist.title }}</span>
                    <span  v-if="!track.artist">Unknown</span>
                </div>
            </div>
            <div class="track-duration">
                {{ track.durationFormatted }}
            </div>
            <div class="track-controls">
                    <span class="player-control control-fav" @click.stop="handleFav(track)">
                        <i class="far fa-heart" v-if="!track.favourite"></i>
                        <i class="fas fa-heart" v-if="track.favourite"></i>
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
    import Client from '../client';
    import Events from '../events';

    export default {
        name: "Playlist",
        props: ['tracks'],
        data: function () {
            return {
                playing: null,
                paused: null,
                loaded: false
            };
        },
        mounted() {
            this.$root.$on("playerPaused", track => {
                this.paused = track.id;
            });
            this.$root.$on("playerPlayNext", track => {
                let next = null;
                const index = this.tracks.indexOf(track);

                if (index >= 0 && index < this.tracks.length - 1) {
                    next = this.tracks[index + 1];
                    this.play(next);
                }
            });
            this.$root.$on("playerPlayPrev", track => {
                let prev = null;
                const index = this.tracks.indexOf(track);

                if (index > 0) {
                    prev = this.tracks[index - 1];
                    this.play(prev);
                }
            });
        },
        methods: {
            handleFav: function (track) {
                Client.post('/audio/favorite/' + track.id, {}, (response) => {
                    track.favourite = !track.favourite;
                    if (track.favourite === false && this.$router.currentRoute.name === 'profile-music') {
                        this.tracks.splice(this.tracks.indexOf(track), 1);
                    }

                }, (error) => {
                    console.error(error);
                });
            },
            play(track) {
                if (this.playing && this.playing === track.id && !this.paused) {
                    this.$root.$emit("audioPause", track);
                    this.paused = track.id;
                    return;
                }

                if (this.playing && this.playing === track.id && this.paused) {
                    this.$root.$emit(Events.PLAYER.PLAY, track);
                    this.paused = null;
                    this.playing = track.id;
                    return;
                }

                this.$root.$emit(Events.PLAYER.PLAY, track);
                this.paused = null;
                this.playing = track.id;
            }
        },
        components: {
            Search
        }
    };
</script>