<template>
    <div class="profile-favorites">
        <page-header :image="playlist.image" :title="playlist.title" v-if="playlist">
            <div slot="body">
                <div class="profile-genres">
                    {{ playlist.description }}
                </div>
                <div class="profile-artists">
                    <!--<a v-for="artist in user.artists" class="tag" href="#">{{ artist }}</a>-->
                </div>
            </div>
            <div slot="controls">

            </div>
        </page-header>

        <playlist :tracks="playlist.audio" v-if="playlist && playlist.audio.length > 0"></playlist>
        <preloader v-if="loading"></preloader>
        <xhr-error message="error" v-if="error != null" @retry="loadAudio"></xhr-error>
        <div class="row" v-if="playlist && playlist.audio.length === 0 && !loading">
            There are no any tracks uploaded :(
        </div>
    </div>
</template>

<script>
    import playlistService from '../services/api/playlist';
    import playlist from "../components/playlist/playlist.vue";
    import sorter from "../components/playlist/sorter.vue";
    import preloader from '../components/preloader.vue';
    import search from '../components/search.vue';
    import xhrError from '../components/xhr-error.vue';
    import pageHeader from './_partials/page-header.vue';

    export default {
        name: "playlist-page",
        components: {playlist, sorter, search, preloader, xhrError, pageHeader},
        data: function () {
            return {
                error: null,
                loading: false,
                searching: false,
                playlist: null
            };
        },
        created() {
            this.loadPlaylist();
        },
        methods: {
            onSearchValueChange(query) {
                console.log(query);
            },
            loadPlaylist() {
                if (this.loading) {
                    return;
                }

                this.error = null;
                this.loading = true;
                const id = this.$route.params.id;

                playlistService.getById(id).then(data => {
                    this.loading = false;
                    this.playlist = data;
                }, error => {
                    this.loading = false;
                    this.error = error.statusText;
                });
            }
        }
    };
</script>