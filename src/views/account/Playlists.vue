<template>
    <div class="playlists-page">
        <div class="page-loading" v-if="playlists.length === 0 && !empty">
            <i class="fas fa-sync-alt fa-spin"></i>
        </div>
        <p v-if="empty">
            There are no any playlists yet
        </p>
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
.playlist-thumb {
  width: 160px;
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

  data: function() {
    return {
      empty: false,
      playlists: []
    };
  },
  mounted() {
    Client.get(
      "/playlists/" + this.$store.state.user.username,
      response => {
        if (response.data.length === 0) {
          this.empty = true;
        }
        this.playlists = response.data;
      },
      error => {
        console.error(error);
      }
    );
  },
  components: { Playlist }
};
</script>
