<template>
    <div class="homepage">
        <Playlist :tracks="tracks"></Playlist>
    </div>
</template>

<script>
import Playlist from "@/components/Playlist.vue";
import Client from "../client";

export default {
  name: "Home",

  data: function() {
    return {
      tracks: []
    };
  },
  created: function() {
    this.$root.$on("userLogout", () => {
      this.logout();
    });
    Client.get("/audio", response => {
      this.tracks = response.data;
    });
  },
  components: { Playlist }
};
</script>
