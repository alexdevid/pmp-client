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
        <router-link class="thumb" to="#" v-for="playlist in playlists">
            <div class="thumb-image">
                <img src="../../../assets/userpic.jpg" alt="">
            </div>
            <div class="thumb-count">
                <i class="fa fa-music"></i> {{ playlist.audio_count }}
            </div>
            <div class="thumb-title">
                {{ playlist.title }}
            </div>
        </router-link>
    </div>
</template>
<script>
    export default {
        name: "profile-playlists",

        data: function () {
            return {
                playlists: [
                    {
                        id: 1,
                        title: 'Sample playlist',
                        audio_count: 43
                    },
                    {
                        id: 1,
                        title: 'Sample playlist',
                        audio_count: 43
                    },
                    {
                        id: 1,
                        title: 'Sample playlist',
                        audio_count: 43
                    },
                    {
                        id: 1,
                        title: 'Sample playlist',
                        audio_count: 43
                    },
                    {
                        id: 1,
                        title: 'Sample playlist',
                        audio_count: 43
                    },
                    {
                        id: 1,
                        title: 'Sample playlist',
                        audio_count: 43
                    },
                    {
                        id: 1,
                        title: 'Sample playlist',
                        audio_count: 43
                    },
                ]
            };
        },
        methods: {
            addPlaylist() {
                this.$router.push('/profile/playlist/add');
            },
        },
        mounted() {
        },
        components: {}
    };
</script>

<style lang="less" src="../../../assets/less/thumb.less"></style>
