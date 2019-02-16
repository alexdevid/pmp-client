<template>
    <div class="artist-thumb" @click="redirect(artist.id)">
        <div class="artist-thumb-image">
            <img src="../../assets/userpic.jpg" alt="">
        </div>
        <div class="artist-thumb-count">
            <i class="fa fa-music"></i> {{ artist.audioCount }}
        </div>
        <div class="artist-thumb-title">
            {{ artist.title }}
        </div>
        <div class="artist-thumb-genre">
            {{ artist.genres }}
        </div>
    </div>
</template>

<script>
    export default {
        props: ['artist'],
        name: "artist-thumb",
        methods: {
            redirect(id) {
                return this.$router.push('/artist/' + id);
            }
        }
    };
</script>

<style lang="less" scoped>
    .artist-thumb {
        width: 320px;
        padding: 10px;
        overflow: hidden;
        position: relative;
        cursor: pointer;
        border-radius: 2px;
        box-sizing: border-box;
        display: inline-block;

        &:hover {
            background-color: #f4f9fc;
        }

        .playlist-thumb-genre,
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
            width: 300px;
            height: 300px;
            img {
                border-radius: 2px;
                width: 300px;
                height: 300px;
            }
        }
    }
</style>