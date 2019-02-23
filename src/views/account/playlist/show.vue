<template>
    <div class="profile-favorites">
        <search :loading="searching" @change="onSearchValueChange" v-if="tracks.length > 0 || searching"></search>
        <sorter></sorter>
        <playlist :tracks="tracks" @loadMore="loadAudio"></playlist>
        <preloader v-if="loading"></preloader>
        <xhr-error message="error" v-if="error != null" @retry="loadAudio"></xhr-error>
        <div class="row" v-if="tracks.length === 0 && !loading">
            There are no any tracks uploaded :(
        </div>
    </div>
</template>

<script>
    import audioService from '../../../services/api/audio';
    import playlist from "../../../components/playlist/playlist.vue";
    import sorter from "../../../components/playlist/sorter.vue";
    import preloader from '../../../components/preloader.vue';
    import search from '../../../components/search.vue';
    import xhrError from '../../../components/xhr-error.vue';

    export default {
        name: "playlist-page",
        components: {playlist, sorter, search, preloader, xhrError},
        data: function () {
            return {
                error: null,
                loadMore: true,
                loading: false,
                searching: false,
                request: {
                    page: 1,
                    query: null,
                    user: this.$store.state.user.username
                },
                tracks: []
            };
        },
        created() {
            this.loadAudio();
        },
        methods: {
            onSearchValueChange(query) {
                console.log(query);
            },
            loadAudio() {
                if (this.loadMore === false) {
                    return;
                }
                if (this.loading) {
                    return;
                }

                this.error = null;
                this.loading = true;
                audioService.get(this.request).then(data => {
                    this.loading = false;
                    const tracks = data._embedded.items;
                    if (this.tracks.length + data.limit === data.total) {
                        this.loadMore = false;
                    } else {
                        this.request.page++;
                    }
                    this.tracks.push.apply(this.tracks, tracks);
                }, error => {
                    this.loading = false;
                    this.error = error.statusText;
                });
            }
        }
    };
</script>