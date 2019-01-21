<template>
    <div class="playlist favorites">
        <Playlist :tracks="tracks" v-if="!empty"></Playlist>
        <p v-if="empty">
            This playlist does not have any audios yet.
        </p>
    </div>
</template>

<script>
    import Playlist from '@/components/Playlist.vue';
    import Client from '../../client';

    export default {
        name: "Favorites",

        data: function () {
            return {
                empty: false,
                tracks: []
            };
        },
        mounted() {
            Client.get('/audio/' + this.$store.state.user.username, (response) => {
                if (response.data.length === 0) {
                    this.empty = true;
                }
                this.tracks = response.data;
            }, (error) => {
                console.error(error);
            });
        },
        components: {Playlist}
    };
</script>