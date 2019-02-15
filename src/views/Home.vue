<template>
    <div class="homepage">
        <Playlist :showLoadingIfEmpty="false"></Playlist>
    </div>
</template>

<script>
    import Playlist from "@/components/Playlist.vue";
    import events from "../events";

    export default {
        name: "Home",
        mounted() {
            this.$root.$on("userLogout", () => {
                this.logout();
            });
        },
        components: {Playlist}
    };
</script>
