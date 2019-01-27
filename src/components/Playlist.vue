<template>
    <div class="playlist">
        <Search v-if="tracks.length > 0"></Search>
        <div class="playlist-controls" v-if="tracks.length > 0">
            <router-link to="/upload" class="playlist-controls-item playlist-controls-item-right button button-alt"
                         v-if="$store.state.user !== null"><i class="fa fa-cloud-upload-alt"></i>
            </router-link>
        </div>
        <div class="page-loading" v-if="tracks.length === 0 && showLoadingIfEmpty">
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
                <div class="track-play-overlay track-play-overlay-playing"
                     v-if="playing === track.id && loading !== track.id">
                    <i class="fa fa-play" v-if="playing !== track.id || !playing || paused && playing === track.id"></i>
                    <i class="fa fa-pause" v-if="!paused && playing === track.id"></i>
                </div>
                <div class="track-play-overlay track-play-overlay-playing" v-if="loading === track.id">
                    <i class="fas fa-sync-alt fa-spin"></i>
                </div>
            </div>
            <div class="track-info">
                <div class="track-title">
                    {{ track.title }}
                </div>
                <div class="track-artist">
                    <span v-if="track.artist">{{ track.artist.title }}</span>
                    <span v-if="!track.artist">Unknown</span>
                </div>
            </div>
            <div class="track-duration">
                {{ track.durationFormatted }}
            </div>
            <div class="track-controls">
                <span class="player-control player-control-checkbox" v-if="remove">
                    <i class="fa fa-times" @click.stop="removeTrack(track)"></i>
                </span>
                <span class="player-control player-control-checkbox" v-if="checkboxes && !isChecked(track)">
                    <i class="far fa-square" @click.stop="checkTrack(track)"></i>
                </span>
                <span class="player-control player-control-checkbox" v-if="checkboxes && isChecked(track)">
                        <i class="far fa-check-square" @click.stop="uncheckTrack(track)"></i>
                    </span>
                <span class="player-control control-fav" @click.stop="handleFav(track)" v-if="!checkboxes && !remove">
                        <i class="far fa-heart" v-if="!track.favourite"></i>
                        <i class="fas fa-heart" v-if="track.favourite"></i>
                    </span>
                <span class="player-control" @click.stop="false" v-if="!checkboxes && !remove"><i
                        class="fa fa-ellipsis-v"></i></span>
            </div>
            <div class="clear"></div>
        </div>
    </div>
</template>

<style src="../assets/less/playlist.less" lang="less">
</style>

<script>
    import Search from "@/components/Search.vue";
    import Client from "../services/api-client";
    import events from "../events";

    export default {
        name: "Playlist",
        props: ["tracks", "checkboxes", 'remove', 'hideSearch', 'showLoadingIfEmpty'],
        data: function () {
            return {
                checked: [],
                playing: null,
                paused: null,
                loaded: false,
                loading: null
            };
        },
        mounted() {
            this.$root.$on(events.PLAYER.CAN_PLAY, (id) => {
                this.loading = null;
            });
            this.$root.$on(events.PLAYER.SHUFFLE, () => {
                console.log('PLAYLIST-SHUFFLE');
                this.shuffle();
                this.$forceUpdate()
            });
            this.$root.$on('add-to-playlist', () => {
                this.$emit('audioAdd', this.checked);
            });
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
            shuffle() {
                for (let i = this.tracks.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [this.tracks[i], this.tracks[j]] = [this.tracks[j], this.tracks[i]];
                }
            },
            isChecked(track) {
                return this.checked.indexOf(track) !== -1;
            },
            checkTrack(track) {
                if (!this.isChecked(track)) {
                    this.$emit(events.PLAYLIST.AUDIO_CHECK, track);
                    this.checked.push(track);
                }
            },
            uncheckTrack(track) {
                if (this.isChecked(track)) {
                    this.$emit(events.PLAYLIST.AUDIO_UNCHECK, track);
                    this.checked = this.checked.filter(function (value, index, arr) {
                        return value !== track;
                    });
                }
            },
            removeTrack(track) {
                this.$emit('audioRemove', track);
            },
            handleFav: function (track) {
                Client.post(
                    "/audio/favorite/" + track.id,
                    {},
                    response => {
                        track.favourite = !track.favourite;
                        if (
                            track.favourite === false &&
                            this.$router.currentRoute.name === "profile-music"
                        ) {
                            this.tracks.splice(this.tracks.indexOf(track), 1);
                        }
                    },
                    error => {
                        console.error(error);
                    }
                );
            },
            play(track) {
                //pause current
                if (this.playing && this.playing === track.id && !this.paused) {
                    this.$root.$emit("audioPause", track);
                    this.paused = track.id;
                    return;
                }

                //remove pause from current
                if (this.playing && this.playing === track.id && this.paused) {
                    this.$root.$emit(events.PLAYER.PLAY, track);
                    this.paused = null;
                    this.playing = track.id;
                    return;
                }

                this.$root.$emit(events.PLAYER.PLAY, track);
                this.paused = null;
                this.playing = track.id;
                this.loading = track.id;
            }
        },
        components: {
            Search
        }
    };
</script>
