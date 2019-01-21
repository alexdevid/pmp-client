<template>
    <div class="player">
        <div class="player-container">
            <div class="player-track">
                <div class="track" v-if="audio">
                    <div class="track-image">
                        <img src="../assets/trackpic.jpg" v-if="!audio.cover">
                        <img :src="audio.cover" v-if="audio.cover">
                        <div class="audio-fav">
                            <i class="far fa-heart"></i>
                            <!--<i class="fa fa-pause"></i>-->
                        </div>
                    </div>
                    <div class="track-info">
                        <div class="track-title">
                            <span>{{ audio.title }}</span>
                        </div>
                        <div class="track-artist">
                            <span v-if="audio.artist">{{ audio.artist.title }}</span>
                            <span  v-if="!audio.artist">Unknown</span>
                        </div>
                    </div>
                    <div class="clear"></div>
                </div>
            </div>
            <div class="player-duration" v-if="audio">
                <span class="track-duration">00:00</span>
            </div>
            <div class="player-volume" v-if="audio">
                <div class="player-vol-control player-control"><i class="fa fa-volume-up"></i></div>
                <div class="player-volume-bar"></div>
            </div>
            <div class="player-controls" v-if="audio">
                <span class="player-control"><i class="fa fa-random"></i></span>
                <span class="player-control"><i class="fa fa-redo"></i></span>

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
        <div class="player-container">
            <div class="player-progress"></div>
        </div>
    </div>
</template>

<script>
    import Events from '../events';

    export default {
        name: "Player",
        data: function () {
            return {
                audioSource: null,
                audio: this.current,
                playing: false
            };
        },
        mounted() {
            this.audioSource = new Audio();
            this.$root.$on(Events.PLAYER.PLAY, track => {
                this.play(track);
            });
            this.$root.$on("audioPause", () => {
                this.pause();
            });
        },
        methods: {
            play(track) {
                console.log(track);
                if (!this.audio || this.audio.id !== track.id) {
                    this.audio = track;
                    this.audioSource.src = track.src;
                }

                this.playing = true;
                this.audioSource.play();
            },
            pause() {
                this.$root.$emit("playerPaused", this.audio);
                this.audioSource.pause();
                this.playing = false;
            },
            playNext() {
                this.$root.$emit("playerPlayNext", this.audio);
            },
            playPrev() {
                this.$root.$emit("playerPlayPrev", this.audio);
            }
        }
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

            .responsive(450px, {
                display: block;
                padding: 0;
            });
        }
        .track-image {
            width: 40px;
        }
        .track-info {
            width: 460px;
            padding-left: 15px;

            .responsive(450px, { width: 335px; });
        }
        &-track {
            float: left;
            width: 500px;
            min-height: 40px;
            .responsive(450px, { width: 100%; });
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
            &-bar {
                height: 3px;
                width: 100px;
                border-radius: 2px;
                background-color: #a1a1a1;
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

            .responsive(450px, {

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
            width: 100%;
            height: 3px;
            background-color: #c1c1c1;
            margin-top: 7px;

            .responsive(450px, {
                position: fixed;
                top: 100px;
                left: 0;
            });
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
