<template>
    <div class="playlist">
        <transition-group name="list" tag="p">
            <Track v-for="track in tracks"
                   :track="track"
                   :active="active"
                   :key="track.id"
                   :showAdd="showCheckboxes"
                   :showRemove="showRemove"
                   @add="$emit('add', track)"
                   @remove="$emit('remove', track)"
            />
        </transition-group>
    </div>
</template>

<style src="../../assets/less/playlist.less" lang="less"></style>

<script>
    import Track from './track.vue';
    import events from "../../events";

    export default {
        name: "playlist",
        props: {
            tracks: {
                type: Array,
                required: true,
            },
            showCheckboxes: {
                type: Boolean,
                required: false,
                default: false
            },
            showRemove: {
                type: Boolean,
                required: false,
                default: false
            }
        },
        data: function () {
            return {
                bottom: false,
                active: null,
            };
        },
        watch: {
            bottom(bottom) {
                if (bottom) {
                    this.$emit('loadMore');
                }
            }
        },
        created() {
            window.addEventListener('scroll', () => {
                this.bottom = this.bottomVisible()
            });
            if (localStorage.getItem('playing-track-id')) {
                this.active = parseInt(localStorage.getItem('playing-track-id'));
            }
        },
        mounted() {
            this.$root.$on(events.PLAYER.PLAY, track => {
                this.active = track.id;
                localStorage.setItem('playing-track-id', track.id);
            });
            this.$root.$on('add-to-playlist', () => {
                this.$emit('audioAdd', this.checked);
            });
            this.$root.$on(events.PLAYER.ENDED, (track) => {
                const index = this.tracks.indexOf(track);
                if (index + 2 >= this.tracks.length && this.loadMore) {
                    this.$root.$emit(events.PLAYLIST.LOAD_MORE);
                }
            });
            this.$root.$on(events.PLAYER.PLAY_NEXT, track => {
                const index = this.tracks.indexOf(track);
                if (index >= 0 && index < this.tracks.length - 1) {
                    this.$root.$emit(events.PLAYLIST.PLAY, this.tracks[index + 1]);
                    this.active = this.tracks[index + 1].id;
                }
            });
            this.$root.$on(events.PLAYER.PLAY_PREV, track => {
                const index = this.tracks.indexOf(track);
                if (index > 0) {
                    this.$root.$emit(events.PLAYLIST.PLAY, this.tracks[index - 1]);
                    this.active = this.tracks[index - 1].id;
                }
            });
        },
        methods: {
            bottomVisible() {
                const scrollY = window.scrollY;
                const visible = document.documentElement.clientHeight;
                const pageHeight = document.documentElement.scrollHeight;
                const bottomOfPage = visible + scrollY >= pageHeight;

                return bottomOfPage || pageHeight < visible;
            }
        },
        components: {Track}
    };
</script>
