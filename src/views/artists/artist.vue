<template>
    <div class="artist-page">
        <page-header :image="artist.image" :title="artist.title" v-if="artist">
            <div slot="body">
                <div class="artist-genres">
                    <a v-for="genre in artist.genres" class="tag" href="#">{{ genre }}</a>
                </div>
            </div>
            <div slot="controls">
                <a href="#" class="button button-alt">{{ artist.audioCount }} tracks</a>
            </div>
        </page-header>
        <div class="page-loading page-loading-fixed" v-if="loading">
            <i class="fas fa-sync-alt fa-spin"></i>
        </div>
    </div>
</template>

<script>
    import pageHeader from '../_partials/page-header.vue';
    import artistService from '../../services/api/artist';

    export default {
        name: "artist",
        data () {
            return {
                loading: true,
                artist: null
            };
        },
        created() {
            const id = this.$route.params.id;
            artistService.getArtist(id).then(
                artist => {
                    this.artist = artist;
                    this.loading = false;
                },
                error => {
                    this.loading = false;
                    console.error(error);
                }
            )
        },
        components: {pageHeader}
    };
</script>

<style lang="less" scoped>
    @import "../../assets/less/tag.less";
</style>