<template>
    <div class="playlists-page">
        <div class="playlist-thumb" @click="addPlaylist()">
            <div class="playlist-thumb-image">
                <img src="../../assets/userpic.jpg" alt="">
            </div>
            <div class="playlist-thumb-title">
                Add new playlist
            </div>
        </div>
        <div class="page-loading page-loading-fixed" v-if="!playlists">
            <i class="fas fa-sync-alt fa-spin"></i>
        </div>
        <div class="playlist-thumb" v-for="playlist in playlists">
            <div class="playlist-thumb-image">
                <img src="../../assets/userpic.jpg" alt="">
            </div>
            <div class="playlist-thumb-count">
                <i class="fa fa-music"></i> {{ playlist.audioCount }}
            </div>
            <div class="playlist-thumb-title">
                {{ playlist.title }}
            </div>
            <div class="playlist-thumb-author">
                {{ playlist.user }}
            </div>
        </div>
    </div>
</template>

<style lang="less">
    .playlists-page {
        position: relative;
    }

    .playlist-thumb {
        width: 160px;
        float: left;
        padding: 10px;
        overflow: hidden;
        position: relative;
        cursor: pointer;
        border-radius: 2px;

        &:hover {
            background-color: #f4f9fc;
        }

        .playlist-thumb-author,
        .playlist-thumb-title {
            width: 140px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        &-count {
            position: absolute;
            top: 10px;
            right: 10px;
            color: #fff;
            padding: 2px 5px;
            border-radius: 2px;
            background-color: rgba(0, 0, 0, 0.3);
        }

        &-image {
            width: 140px;
            height: 140px;
            img {
                border-radius: 2px;
                width: 140px;
                height: 140px;
            }
        }
    }
</style>
<script>
    import Playlist from "@/components/Playlist.vue";
    import Client from "../../client";

    export default {
        name: "Playlists",

        data: function () {
            return {
                playlists: null
            };
        },
        methods: {
            addPlaylist() {
                this.$router.push('/profile/playlist/add');
            }
        },
        mounted() {
            Client.get(
                "/playlists/" + this.$store.state.user.username,
                response => {
                    this.playlists = response.data;
                },
                error => {
                    console.error(error);
                }
            );
        },
        components: {Playlist}
    };
</script>
