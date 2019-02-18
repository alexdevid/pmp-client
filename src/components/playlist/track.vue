<template>
    <div class="track" @click="play" v-bind:class="{active: active === track.id, loading: loading}">
        <div class="track-image">
            <i class="fa fa-music" v-if="!track.cover_thumb"></i>
            <img :src="track.cover_thumb" v-if="track.cover_thumb">

            <div class="track-play-overlay" v-if="active !== track.id">
                <i class="fa fa-play"></i>
            </div>

            <div class="track-play-overlay track-play-overlay-playing" v-if="active === track.id">
                <i class="fa fa-play" v-if="showPlayOverlay"></i>
                <i class="fa fa-pause" v-if="showPauseOverlay"></i>
                <i class="fas fa-sync-alt fa-spin" v-if="loading"></i>
            </div>
        </div>
        <div class="track-info">
            <div class="track-title">
                {{ track.title }}
            </div>
            <div class="track-artist">
                <span v-if="track.artist" @click.stop="redirectToArtist(track.artist.id)">{{ track.artist.title
                    }}</span>
            </div>
        </div>
        <div class="track-duration">
            {{ track.durationFormatted }}
        </div>
        <div class="track-controls">
            <div class="player-control" v-if="track.added && !showRemove">
                <i class="fa fa-check"></i>
            </div>
            <div class="player-control" @click.stop="$emit('add', track);" v-if="showAdd && !track.added">
                <i class="fa fa-plus"></i>
            </div>
            <div class="player-control" @click.stop="$emit('remove', track)" v-if="showRemove">
                <i class="fa fa-times"></i>
            </div>
            <div class="player-control control-fav" @click.stop="fav"
                 v-if="!showAdd && !showRemove && $store.state.user">
                <i class="far fa-heart" v-if="!track.favorite"></i>
                <i class="fas fa-heart" v-if="track.favorite"></i>
            </div>
            <a class="player-control" @click.stop="" v-if="!showAdd && !showRemove"
               :download="track.artist.title + ' - ' + track.title + '.mp3'" :href="track.src">
                <i class="fa fa-download"></i>
            </a>
        </div>
        <div class="clear"></div>
    </div>
</template>

<script>
    import events from '../../events';
    import audioService from '../../services/api/audio';

    export default {
        name: 'Track',
//        props: ['track', 'addCheckbox', 'addRemove', 'active'],
        props: {
            track: {
                type: Object
            },
            active: {
                type: Number
            },
            showAdd: {
                type: Boolean,
                required: false
            },
            showRemove: {
                type: Boolean,
                required: false
            }
        },
        data: function () {
            return {
                loading: false,
                playing: false,
                paused: false,
            };
        },
        created() {
            if (localStorage.getItem('playing-track-id') && localStorage.getItem('playing-track-id') == this.track.id) {
                this.playing = true;
            }
        },
        computed: {
            showPauseOverlay() {
                return this.playing && this.active === this.track.id && !this.paused && !this.loading
            },
            showPlayOverlay() {
                //!playing || paused && playing
                return !this.playing && this.active === this.track.id || this.paused && this.playing
            }
        },
        mounted() {
            this.$root.$on(events.PLAYER.CAN_PLAY, (id) => {
                this.loading = false;
            });
            this.$root.$on(events.PLAYER.PAUSE, track => {
                this.paused = track.id === this.track.id;
            });
            this.$root.$on(events.PLAYLIST.PLAY, track => {
                this.playing = false;
                if (track.id === this.track.id) {
                    this.play();
                }
            });
            this.$root.$on(events.PLAYER.PLAY, track => {
                this.paused = false;
                this.playing = track.id === this.track.id;
            });
        },
        methods: {
            play() {
                //pause current
                if (this.playing && !this.paused) {
                    this.$root.$emit(events.PLAYLIST.AUDIO_PAUSE, this.track);
                    this.paused = true;
                    return;
                }

                //remove pause from current
                if (this.playing && this.paused) {
                    this.$root.$emit(events.PLAYLIST.START_PLAY, this.track);
                    this.paused = false;
                    this.playing = true;
                    return;
                }

                this.$root.$emit(events.PLAYLIST.START_PLAY, this.track);
                this.paused = false;
                this.playing = true;
                this.loading = true;
            },
            fav() {
                audioService.fav(this.track.id).then(
                    response => {
                        this.track.favorite = response.favorite;
                        this.$root.$emit(events.PLAYLIST.FAV, this.track);
                    }, error => console.error(error));
            },
            check() {

            },
            uncheck() {

            },
            remove() {

            },
            redirectToArtist(id) {
                return this.$router.push('/artist/' + id);
            }
        }
    };
</script>

<style lang="less" scoped="">
    @import "../../assets/less/mixins";

    .track {
        display: flex;
        align-items: center;

        &-image {
            width: 40px;
            height: 40px;
            background-color: #f4f9fc;
            border-radius: 2px;
            display: flex;
            align-items: center;
            justify-content: center;

            img {
                display: block;
                width: 40px;
                height: 40px;
                border-radius: 3px;
            }
        }
        &-info {
            padding: 0 15px;
            flex: 5;

            .responsive(450px, { width: 285px; });

            .responsive(960px, { });
        }
        &-title {
            color: #000;
            font-size: 14px;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100%;
            height: 25px;
            white-space: nowrap;
        }
        &-artist {
            cursor: pointer;
            float: left;
            font-size: 12px;
            line-height: 10px;

            &:hover {
                color: #000;
                text-decoration: underline;
            }
        }
        &-duration {
            margin-left: auto;
        }
        &-controls {
            text-align: right;
            margin-left: auto;

            .responsive(450px, { width: 25px; });
        }
    }
</style>