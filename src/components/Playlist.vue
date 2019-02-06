<template>
    <div class="playlist">
        <Search v-if="tracks.length > 0"></Search>
        <div class="playlist-controls">
            <router-link to="/upload" class="playlist-controls-item playlist-controls-item-right button button-alt"
                         v-if="$store.state.user !== null"><i class="fa fa-cloud-upload-alt"></i>
            </router-link>
        </div>
        <Track v-for="track in tracks" :track="track" :active="active" :key="track.id"/>
        <div class="playlist-error" v-if="showRetryButton">
            There was error loading audio data. Please try again <br>
            <button class="button" @click="loadAudioData()">Retry</button>
        </div>
        <div class="page-loading" v-if="loadMore" v-show="showHorizontalLoader">
            <i class="fas fa-sync-alt fa-spin"></i>
        </div>
    </div>
</template>

<style src="../assets/less/playlist.less" lang="less">
</style>

<script>
    import Search from "@/components/Search.vue";
    import Track from '@/components/playlist/track.vue';
    import client from "../services/api/api-client";
    import audioService from '../services/api/audio';
    import events from "../events";

    const COLLECTION_LENGTH = 30;

    export default {
        name: "Playlist",
        props: ['checkboxes', 'remove', 'hideSearch', 'showLoadingIfEmpty', 'user'],
        data: function () {
            return {
                tracks: [],
                checked: [],
                active: null,
                loadMore: true,

                page: 1,

                showHorizontalLoader: false,
                bottom: false,
                showRetryButton: false
            };
        },
        watch: {
            bottom(bottom) {
                if (bottom) {
                    this.loadNextCollection();
                }
            }
        },
        created() {
            this.loadAudioData();
            window.addEventListener('scroll', () => {
                this.bottom = this.bottomVisible()
            });
            if (localStorage.getItem('playing-track-id')) {
                this.active = parseInt(localStorage.getItem('playing-track-id'));
            }
        },
        mounted() {
            this.$root.$on(events.PLAYLIST.FAV, track => {
                if (track.favourite === false && this.$router.currentRoute.name === 'profile-music') {
                    this.tracks.splice(this.tracks.indexOf(track), 1);
                }
            });
            this.$root.$on(events.SEARCH.QUERY_CHANGE, query => {
                this.filterAudio(query);
            });
            this.$root.$on(events.PLAYER.SHUFFLE, track => {
                this.shuffle(track.id);
            });
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
                    this.loadNextCollection();
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
            loadAudioData() {
                this.showRetryButton = false;
                this.showHorizontalLoader = true;
                if (this.user) {
                    audioService.getByUsername(this.user, this.page).then(
                        (collection) => {
                            this._onGetAudioSuccess(collection)
                        },
                        (error) => {
                            this._onGetAudioFail(error);
                        });
                } else {
                    audioService.getAll(this.page).then(
                        (collection) => {
                            this._onGetAudioSuccess(collection)
                        },
                        (error) => {
                            this._onGetAudioFail(error);
                        });
                }
            },
            _onGetAudioSuccess(collection){
                this.showRetryButton = false;
                this.tracks = collection;
                if (collection.length < COLLECTION_LENGTH) {
                    this.loadMore = false;
                }
            },
            _onGetAudioFail(error){
                this.showHorizontalLoader = false;
                this.showRetryButton = true;
            },
            bottomVisible() {
                if (!this.loadMore) {
                    return false;
                }

                const scrollY = window.scrollY;
                const visible = document.documentElement.clientHeight;
                const pageHeight = document.documentElement.scrollHeight;
                const bottomOfPage = visible + scrollY >= pageHeight;

                return bottomOfPage || pageHeight < visible;
            },
            loadNextCollection() {
                this.page++;
                this.showHorizontalLoader = true;
                this.loadAudioData();
            },
            shuffle(id) {
                for (let i = this.tracks.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [this.tracks[i], this.tracks[j]] = [this.tracks[j], this.tracks[i]];
                }
                this.$forceUpdate();
                this.active = id;
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
            filterAudio(query) {
                client.get(this.apiParams.url, {'query': query}).then(response => {
                    this.tracks = response.data.collection;
                });
            },
        },
        components: {
            Search, Track
        }
    };
</script>
