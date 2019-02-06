<template>
    <div class="player">
        <div class="player-container">
            <div class="player-track">
                <div class="track" v-if="audio">
                    <div class="track-image">
                        <i class="fa fa-music" v-if="!audio.coverThumb"></i>
                        <img :src="audio.coverThumb" v-if="audio.coverThumb">
                    </div>
                    <div class="track-info">
                        <div class="track-title">
                            <span>{{ audio.title }}</span>
                        </div>
                        <div class="track-artist">
                            <span v-if="audio.artist">{{ audio.artist.title }}</span>
                            <span v-if="!audio.artist">Unknown</span>
                        </div>
                    </div>
                    <div class="clear"></div>
                </div>
            </div>
            <div class="player-duration" v-if="audio">
                <span class="track-duration" @click="showCurrentTime = !showCurrentTime">{{ getPlayerTime() }}</span>
            </div>
            <div class="player-volume" v-if="audio">
                <div class="player-vol-control player-control" @click="mute()" v-if="volume > 0">
                    <i class="fa fa-volume-up"></i>
                </div>
                <div class="player-vol-control player-control" @click="unmute()" v-if="volume === 0">
                    <i class="fa fa-volume-mute"></i>
                </div>
                <vue-slider v-model="volume" :width="100" :height="'3px'" :tooltip="false" :speed="0"
                            @callback="changeVolume" :style="{padding: '0', height: '3px'}"></vue-slider>
            </div>
            <div class="player-controls" v-if="audio">
                <span class="player-control" @click="shuffle()"><i class="fa fa-random"></i></span>
                <!--<span class="player-control"><i class="fa fa-redo"></i></span>-->

                <span class="player-control" @click="playPrev"><i class="fa fa-backward"></i></span>

                <span class="player-control player-control-play" v-if="!playing" @click="play(audio)">
                    <i class="fa fa-play-circle"></i>
                </span>
                <span class="player-control player-control-play" v-if="playing" @click="pause()">
                    <i class="fa fa-pause-circle"></i>
                </span>

                <span class="player-control" @click="playNext"><i class="fa fa-forward"></i></span>
            </div>
        </div>
        <div class="player-container player-progress">
            <div class="player-progress-buffered" :style="{width: buffered + '%'}"></div>
            <vue-slider v-model="progress" :width="'100%'" :height="'3px'" :tooltip="false" :speed="0"
                        @callback="changePosition" :style="{padding: '0', height: '3px'}"></vue-slider>
        </div>
    </div>
</template>

<script>
    import events from "../events";
    import vueSlider from 'vue-slider-component/src/vue2-slider.vue'

    export default {
        name: "Player",
        data: function () {
            return {
                volume: 100,
                volumeBeforeMute: 100,
                progress: 0,
                buffered: 0,
                currentTime: 0,
                audioSource: null,
                audio: this.current,
                playing: false,
                loading: null,
                showCurrentTime: true
            };
        },
        mounted() {
            this.audioSource = new Audio();
            this.audioSource.volume = this.volume / 100;

            this.$root.$on(events.PLAYLIST.START_PLAY, track => {
                this.play(track);
            });
            this.$root.$on(events.PLAYLIST.AUDIO_PAUSE, () => {
                this.pause();
            });
            this.audioSource.addEventListener('canplay', () => {
                document.title = this.audio.artist.title + ' - ' + this.audio.title;
                this.$root.$emit(events.PLAYER.CAN_PLAY);
            });
            this.audioSource.addEventListener('timeupdate', () => {
                this.progress = Math.round(this.audioSource.currentTime * 100 / this.audioSource.duration);
                if (this.progress === 100) {
                    document.title = 'PMP';
                    this.$root.$emit(events.PLAYER.ENDED, this.audio);
                    this.playNext();
                }
            });
            this.audioSource.addEventListener('progress', () => {
                if (this.audioSource.buffered.length) {
                    this.loading = null;
                    let loaded = 100 * this.audioSource.buffered.end(0);
                    this.buffered = loaded.toFixed(2) / this.audioSource.duration;
                }
            });
        },
        methods: {
            play(track) {
                document.title = 'PMP';
                if (!this.audio || this.audio.id !== track.id) {
                    this.loading = track.id;
                    this.buffered = 0;
                    this.audio = track;
                    this.progress = 0;
                    this.audioSource.src = track.src;
                }

                this.playing = true;
                this.audioSource.play();
                this.$root.$emit(events.PLAYER.PLAY, this.audio);
            },
            pause() {
                this.audioSource.pause();
                this.playing = false;
                this.$root.$emit(events.PLAYER.PAUSE, this.audio);
            },
            playNext() {
                this.$root.$emit(events.PLAYER.PLAY_NEXT, this.audio);
            },
            playPrev() {
                this.$root.$emit(events.PLAYER.PLAY_PREV, this.audio);
            },
            mute() {
                this.volumeBeforeMute = this.volume;
                this.audioSource.volume = 0;
                this.volume = 0;
            },
            unmute() {
                this.audioSource.volume = this.volumeBeforeMute / 100;
                this.volume = this.volumeBeforeMute;
            },
            changeVolume() {
                this.audioSource.volume = this.volume / 100;
            },
            changePosition() {
                this.audioSource.currentTime = this.progress * this.audioSource.duration / 100;
            },
            shuffle() {
                this.$root.$emit(events.PLAYER.SHUFFLE, this.audio);
            },
            getPlayerTime() {
                if (this.showCurrentTime) {
                    return this.secondsToTime(this.audioSource.currentTime);
                }

                return this.secondsToTime(this.audioSource.duration - this.audioSource.currentTime);
            },
            secondsToTime(seconds) {
                let date = new Date(null);
                date.setSeconds(seconds);
                if (seconds / 3600 >= 1) {
                    return date.toISOString().substr(11, 8);
                }

                return date.toISOString().substr(14, 5);
            }
        },
        components: {vueSlider}
    };
</script>
<style lang="less">
    @import "../assets/less/mixins.less";

    .player {
        width: 100%;
        height: 60px;
        position: fixed;
        top: 50px;
        left: 0;
        background: #f4f9fc;
        padding: 10px;
        z-index: 1000;
        border-bottom: 3px solid #ddd;

        &.active {
            display: block;
        }

        &-container {
            max-width: 960px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            padding: 0 10px;

            .responsive(450px, { padding: 0; });
        }
        .track-image {
            width: 40px;
        }
        .track-info {
            width: 460px;
            padding-left: 15px;
            .responsive(450px, { width: 335px; });
        }
        .track-duration {
            cursor: pointer;
        }

        &-track {
            float: left;
            width: 500px;
            min-height: 40px;
            .responsive(450px, { width: 100%; });

            .track {
                padding: 0;
            }

            .audio-fav {
                display: none;
                position: absolute;
                top: 0;
                left: 0;
                width: 40px;
                height: 40px;
                color: #fff;
                text-align: center;
                padding-top: 1px;
                font-size: 25px;
                background-color: rgba(0, 0, 0, 0.3);
            }
        }
        &:hover {
            .audio-fav {
                display: block;
            }
        }
        &-duration {
            float: left;
            width: 50px;
            .responsive(450px, { display: none; });
        }
        &-volume {
            float: left;
            width: 150px;
            display: flex;
            align-items: center;
            .responsive(450px, { display: none; });
            .vue-slider {
                cursor: pointer;
                border-radius: 2px;
                height: 3px;
            }
            &:hover {
                .vue-slider-dot-handle {
                    opacity: 1;
                }
            }
            .vue-slider-dot-handle {
                opacity: 0;
                width: 10px !important;
                height: 10px !important;
                background-color: #2f4f4f !important;
                margin-top: -4px;
                transition-duration: .3s;
            }
            .vue-slider-process {
                height: 3px;
                width: 100px;
                border-radius: 2px;
                background-color: #2f4f4f;
                display: inline-block;
            }
        }
        &-controls {
            float: left;
            width: 240px;
            text-align: right;
            .fa-backward {
                margin-left: 30px;
            }
            .responsive( 450px, {
                .fa-random,
                .fa-redo {
                    display: none;
                }
                position: fixed;
                top: 61px;
                right: 10px;
            });
        }
        &-progress {
            padding-top: 7px;
            position: relative;

            .responsive(450px, { margin: 0 -10px; });

            &-buffered {
                width: 940px;
                height: 3px;
                position: absolute;
                background-color: #ababab;
                top: 7px;
                left: 10px;

                .responsive(450px, { margin: 0 -10px; });
            }
            .vue-slider-dot-handle {
                opacity: 0;
            }
            .vue-slider {
                cursor: pointer;
                border-radius: 2px;
                height: 3px;
                background: none;
            }
            .vue-slider-process {
                background-color: #2f4f4f;
                .responsive(450px, { position: absolute; top: 100px; left: 0; });
            }
        }
        &-control {
            color: #a1a1a1;
            cursor: pointer;
            padding: 0 10px;
            font-size: 14px;
            display: inline-block;
            transition-duration: 0.3s;
            position: relative;
            &-play {
                margin: 0 5px;
                font-size: 20px;
                top: 2px;
            }
            &:last-child {
                padding-right: 0;
            }
            &:hover {
                color: #000;
            }
        }
    }
</style>
