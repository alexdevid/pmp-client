<template>
    <div class="upload-page">
        <form enctype="multipart/form-data" novalidate class="upload-form"
              v-if="filesToUpload.length === 0 && !showEditForm">
            <p>You can upload not more that 10 files at once</p>
            <p>Each file should be less than 50MB</p>
            <p>Allowed file types are `mp3` and `m4a`</p>
            <a href="#" class="button file-select" @click="$refs.file.click()">Select files</a>
            <input type="file" multiple name="audio" ref="file" @change="onAddFiles($event.target.files)" accept="audio/mp3, audio/mp4">
        </form>

        <UploadProgress @upload-complete="onComplete" @upload-error="onError" @upload-finish="onFinish"
                        v-for="uploadedFile in filesToUpload" :file="uploadedFile">
        </UploadProgress>

        <div v-if="showNexButton" class="uploaded-form-next">
            <button class="button" @click="onShowEditForm">Next</button>
        </div>

        <form v-if="showEditForm">
            <div class="uploaded-form" :class="[saving ? 'saving': '', audio ? 'editing' : '']">
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
                    <button class="button" @click.prevent="skip(audio)">Okay</button>
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
                    <button class="button" @click.prevent="save(audio)">Save</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    import events from '../events';
    import client from '../services/api/api-client';
    import Message from '@/components/Message.vue';
    import UploadProgress from '@/components/upload/Progress.vue';

    const MAX_UPLOADED_FILES = 10;

    export default {
        name: 'Upload',
        data: function () {
            return {
                showEditForm: false,
                saving: null,
                audio: null,

                filesToUpload: [],
                uploadedFiles: [],
                uploadCompleteCount: 0,
                showNexButton: false,
            };
        },
        mounted() {

        },
        methods: {
            onComplete(file) {
                this.uploadedFiles.push(file);
            },
            onError(error) {
                console.error(error);
            },
            onFinish() {
                this.uploadCompleteCount++;
                if (this.uploadCompleteCount === this.filesToUpload.length) {
                    this.showNexButton = true;
                }
            },
            onShowEditForm() {
                this.filesToUpload = [];
                this.audio = this.uploadedFiles.shift();
                this.showNexButton = false;
                this.uploadCompleteCount = 0;
                if (this.audio) {
                    this.showEditForm = true;
                }
            },
            onAddFiles(files) {
                if (!files.length) {
                    this.error = 'Please select files to upload';
                    return;
                }
                if (files.length > MAX_UPLOADED_FILES) {
                    this.error = 'You can upload not more that 4 files at once';
                    return;
                }

                this.filesToUpload = files;
            },
            skip() {
                if (this.uploadedFiles.length) {
                    this.audio = this.uploadedFiles.shift();
                } else {
                    this.audio = null;
                    this.showEditForm = false;
                    this.$router.push('/profile');
                }
            },
            save(file) {
                this.saving = true;
                client.post('/audio/' + file.id, file).then(
                    response => {
                        this.saving = null;
                        if (this.uploadedFiles.length) {
                            this.audio = this.uploadedFiles.shift();
                        } else {
                            this.audio = null;
                            this.showEditForm = false;
                            this.$router.push('/profile');
                        }
                    }, (error) => {
                        console.error(error);
                    }
                );
            }
        },
        components: {Message, UploadProgress},
    }
</script>

<style lang="less">
    @import "../assets/less/playlist.less";

    .upload-form {
        padding: 30px 20px;
        text-align: center;

        p {
            margin: 5px;
        }

        input {
            display: none;
        }

        .file-select {
            display: inline-block;
            margin-top: 30px;
        }
    }

    .uploaded-form {
        width: 50%;
        margin: 0 auto 30px;
        display: none;
        position: relative;

        &-next {
            width: 480px;
            margin: 0 auto;
            text-align: right;
        }

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