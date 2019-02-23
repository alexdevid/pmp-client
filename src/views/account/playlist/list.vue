<template>
    <div class="profile-playlists">
        <router-link class="thumb" to="playlist/add">
            <div class="thumb-image">
                <i class="fa fa-plus"></i>
            </div>
            <div class="thumb-title">
                Add new playlist
            </div>
        </router-link>
        <router-link class="thumb" to="#" v-for="playlist in playlists" :to="{name: 'playlist-page', params: {id: playlist.id}}">
            <div class="thumb-image">
                <i class="fa fa-music" v-if="!playlist.image"></i>
                <img :src="playlist.image" v-if="playlist.image">
            </div>
            <div class="thumb-count">
                <i class="fa fa-music"></i> {{ playlist.audio_count }}
            </div>
            <div class="thumb-title">
                {{ playlist.title }}
            </div>
        </router-link>

        <xhr-error message="error" v-if="error != null" @retry="loadPlaylists"></xhr-error>
    </div>
</template>
<script>
    import playlistService from '../../../services/api/playlist';
    import xhrError from '../../../components/xhr-error.vue';

    export default {
        name: "profile-playlists",

        data: function () {
            return {
                loading: false,
                error: null,
                request: {
                    page: 1,
                    user: this.$store.state.user.username
                },
                playlists: []
            };
        },
        methods: {
            loadPlaylists() {
                this.error = null;
                this.loading = true;
                playlistService.get(this.request).then(
                    data => {
                        this.playlists = data._embedded.items;
                        this.loading = false;
                    },
                    error => {
                        this.loading = false;
                        console.log(error);
                    }
                )
            }
        },
        created () {
            this.loadPlaylists();
        },
        components: {xhrError}
    };
</script>

<style lang="less" src="../../../assets/less/thumb.less"></style>
