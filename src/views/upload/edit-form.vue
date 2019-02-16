<template>
    <form class="uploaded-form" :class="[saving ? 'saving': '', audio ? 'editing' : '']">
        <div class="page-loading">
            <i class="fas fa-sync-alt fa-spin"></i>
        </div>
        <div class="track">
            <div class="track-image">
                <i class="fa fa-music" v-if="!audio.cover_thumb"></i>
                <img :src="audio.cover_thumb" v-if="audio.cover_thumb">
            </div>
            <div class="track-info">
                <div class="track-title">
                    {{ audio.title }}
                </div>
                <div class="track-artist">
                    <span v-if="audio.artist">{{ audio.artist.title }}</span>
                </div>
            </div>
            <div class="track-duration">
                {{ audio.durationFormatted }}
            </div>
            <div class="clear"></div>
        </div>
        <div class="added-before" v-if="audio.addedBefore">
            <p>
                This audio was added before by somebody. <br>
                You can not edit it, but it was added to your playlist.
            </p>
            <button class="button" @click.prevent="$emit('skip')">Okay</button>
        </div>
        <div v-if="!audio.addedBefore">
            <div class="input-group">
                <label>File:</label>
                <input type="text" class="input" disabled :value="audio.filename">
            </div>
            <div class="input-group">
                <label for="title">Title:</label>
                <input type="text" class="input" v-model="audio.title" id="title">
            </div>
            <div class="input-group">
                <label for="artist">Artist:</label>
                <input type="text" class="input" v-model="audio.artist.title" id="artist">
            </div>
            <div class="input-group">
                <label for="album">Album:</label>
                <input type="text" class="input" v-model="audio.album" id="album">
            </div>
            <div class="input-group">
                <label for="genre">Genre:</label>
                <input type="text" class="input" v-model="audio.genre" id="genre">
            </div>
            <div class="input-group">
                <label for="year">Year:</label>
                <input type="text" class="input" v-model="audio.year" id="year">
            </div>
            <button class="button" @click.prevent="$emit('save', audio)">Save</button>
        </div>
    </form>
</template>

<script>
    export default {
        name: "edit-form",
        props: {
            audio: {
                type: Object,
                required: true
            },
            saving: {
                type: Boolean,
                required: true,
            }
        }
    };
</script>

<style lang="less" scoped>
    .uploaded-form {
        width: 50%;
        margin: 0 auto 30px;
        display: none;
        position: relative;

        &.editing {
            display: block;
        }

        &.saving {
            opacity: .5;
            pointer-events: none;

            .page-loading {
                display: flex;
            }
        }

        .added-before {
            padding: 0 30px;

            .button {
                float: left;
            }
        }

        .page-loading {
            display: none;
            margin: 0 auto;
            position: absolute;
            flex-direction: column;
            justify-content: center;
            width: 100%;
            height: 100%;
        }

        .track {
            margin-left: 30px;
            margin-bottom: 10px;
            cursor: default;

            &:hover {
                background: none;
            }

            &-info {
                width: 335px;
            }
        }
        label {
            line-height: 26px;
            width: 100px;
            text-align: right;
            margin-right: 15px;
        }
        .button {
            float: right;
        }

        .input-group {
            display: flex;
        }
    }
</style>