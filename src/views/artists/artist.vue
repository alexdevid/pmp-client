<template>
    <div class="artist-page">
        <page-header :image="artist.image" :title="artist.title + artist.id">
            <div slot="body">
                <div class="artist-genres">
                    <a v-for="genre in artist.genres" class="tag" href="#">{{ genre }}</a>
                </div>
            </div>
            <div slot="controls">
                <a href="#" class="button button-alt">{{ artist.audioCount }} tracks</a>
            </div>
        </page-header>
        <playlist :showLoadingIfEmpty="true" :user="this.$store.state.user.username"></playlist>
    </div>
</template>

<script>
    import Playlist from '../../components/Playlist.vue';
    import PageHeader from '../_partials/page-header.vue';

    export default {
        name: "artist",
        data () {
            return {
                artist: {
                    id: 2,
                    title: 'Metallica',
                    genres: ['Metall'],
                    audioCount: 43,
                    image: 'http://freevectorlogo.net/wp-content/uploads/2012/04/metallica-logo-vector-400x400.png'
                }
            };
        },
        created() {
            const id = this.$route.params.id;
            this.artist.id = id;
        },
        components: {Playlist, PageHeader}
    };
</script>

<style lang="less" scoped>
    @import "../../assets/less/tag.less";
</style>