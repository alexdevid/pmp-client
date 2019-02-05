<template>
    <div class="playlist">
        <Search v-if="tracks.length > 0"></Search>
        <div class="playlist-controls">
            <router-link to="/upload" class="playlist-controls-item playlist-controls-item-right button button-alt"
                         v-if="$store.state.user !== null"><i class="fa fa-cloud-upload-alt"></i>
            </router-link>
        </div>
        <div class="page-loading" v-if="tracks.length === 0 && showLoadingIfEmpty">
            <i class="fas fa-sync-alt fa-spin"></i>
        </div>

        <Track v-for="track in tracks" :track="track" :active="active"/>

        <div class="playlist-load-more" v-if="loadMore">
            <a href="#" @click.prevent="loadNextCollection">Load more</a>
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

    export default {
        name: "Playlist",
        props: ['checkboxes', 'remove', 'hideSearch', 'showLoadingIfEmpty', 'apiParams'],
        data: function () {
            return {
                tracks: [],
                checked: [],
                active: null,
                loadMore: true,
                page: 1,
            };
        },
        created() {
            if (this.apiParams) {
                this.tracks = [];
                audioService.getAll(this.page).then(
                    (collection) => {
                        this.tracks = collection;
                        if (collection.length < 10) {
                            this.loadMore = false;
                        }
                    },
                    (error) => {
                        console.log(error.statusText);
                    });
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
                this.shuffle();
                this.active = track.id;
            });
            this.$root.$on(events.PLAYER.PLAY, track => {
                this.active = track.id;
            });
            this.$root.$on('add-to-playlist', () => {
                this.$emit('audioAdd', this.checked);
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
            loadNextCollection() {
                this.page++;

                audioService.getAll(this.page).then(
                    (collection) => {
                        this.tracks.push(...collection);
                        if (collection.length < 10) {
                            this.loadMore = false;
                        }
                    },
                    (error) => {
                        console.log(error.statusText);
                    });
            },
            shuffle() {
                for (let i = this.tracks.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [this.tracks[i], this.tracks[j]] = [this.tracks[j], this.tracks[i]];
                }
                this.$forceUpdate();
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
                client.post(
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
