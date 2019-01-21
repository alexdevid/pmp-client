<template>
    <div class="upload-page">
        <Message v-if="error" :type="'error relative'">
            <div slot="body" v-html="error"></div>
        </Message>
        <div class="page-loading" v-if="showLoader">
            <i class="fas fa-sync-alt fa-spin"></i>
        </div>
        <form enctype="multipart/form-data" novalidate class="upload-form" v-if="showUploadForm">
            <p>
                Cras risus arcu, finibus sed luctus vel, ultricies eu urna. Nam placerat cursus mi vitae aliquam.
                Fusce maximus feugiat mauris, ac mattis odio euismod in. Suspendisse hendrerit sed sapien sit amet pellentesque.
                Aenean pulvinar in est quis sodales. Morbi in aliquet elit. Integer eget orci non sem ornare aliquam.
                Morbi gravida laoreet felis vel placerat.
            </p>
            <a href="#" class="button" v-if="!uploading && !uploaded"
               @click="$refs.file.click()">Select a file</a>
            <input type="file" multiple name="audio" :disabled="uploading" ref="file"
                   @change="onAddFile($event.target.name, $event.target.files); fileCount = $event.target.files.length"
                   style="display: none">
        </form>
        <form v-if="showEditForm">
            <div class="uploaded-form" v-for="file in uploadedFiles"
                 :class="[saving === file.id ? 'saving': '', editing === file.id ? 'editing' : '']">
                <div class="track">
                    <div class="track-image">
                        <img src="../assets/trackpic.jpg" v-if="!file.cover">
                        <img :src="file.cover" v-if="file.cover">
                    </div>
                    <div class="track-info">
                        <div class="track-title">
                            {{ file.title }}
                        </div>
                        <div class="track-artist">
                            <span v-if="file.artist">{{ file.artist.title }}</span>
                        </div>
                    </div>
                    <div class="track-duration">
                        {{ file.durationFormatted }}
                    </div>
                    <div class="clear"></div>
                </div>
                <div class="input-group">
                    <label for="">File:</label>
                    <input type="text" class="input" disabled :value="file.filename">
                </div>
                <div class="input-group">
                    <label :for="'artist[' + file.id + ']'">Artist:</label>
                    <input type="text" class="input" v-model="file.artist.title" :name="'artist[' + file.id + ']'">
                </div>
                <div class="input-group">
                    <label :for="'title[' + file.id + ']'">Title:</label>
                    <input type="text" class="input" v-model="file.title" :name="'title[' + file.id + ']'">
                </div>
                <div class="input-group">
                    <label :for="'album[' + file.id + ']'">Album:</label>
                    <input type="text" class="input" v-model="file.album" :name="'album[' + file.id + ']'">
                </div>
                <div class="input-group">
                    <label :for="'genre[' + file.id + ']'">Genre:</label>
                    <input type="text" class="input" v-model="file.genre" :name="'genre[' + file.id + ']'">
                </div>
                <div class="input-group">
                    <label :for="'year[' + file.id + ']'">Year:</label>
                    <input type="text" class="input" v-model="file.year" :name="'year[' + file.id + ']'">
                </div>
                <button class="button" @click.prevent="save(file)">Save</button>
            </div>

            <!--<div class="upload-progress" v-if="uploading && !uploaded" :style="{width: percentUploaded + '%'}">-->
            <!--<div class="upload-progress-inner"></div>-->
            <!--</div>-->
        </form>
    </div>
</template>

<style lang="less">
    @import "../assets/less/playlist.less";

    .upload-form {
        padding: 30px 20px;
        text-align: center;

        p {
            text-align: left;
        }
    }

    .upload-progress {
        height: 20px;
        width: 100%;
        background-color: fade(#2f4f4f, 10%);

        &-inner {
            height: 100%;
            background-color: #2f4f4f;
        }
    }

    .uploaded-form {
        width: 50%;
        margin: 0 auto 30px;
        display: none;

        &.editing {
            display: block;
        }

        &.saving {
            opacity: .5;
            pointer-events: none;
        }

        .track {
            margin-left: 30px;
            margin-bottom: 10px;
            cursor: default;

            &:hover {
                background: none;
            }

            &-info {
                width: 375px;
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

<script>
    import Client from '../client';
    import Message from '@/components/Message.vue';

    const MAX_UPLOADED_FILES = 4;
    const MAX_UPLOADED_FILE_SIZE = 50 * 1024 * 1024; //50MB
    const UPLOAD_ALLOWED_TYPES = ['audio/mp3', 'audio/x-m4a'];
    const UPLOAD_ALLOWED_EXTENSIONS = ['mp3', 'm4a'];

    export default {
        name: 'Upload',
        data: function () {
            return {
                showUploadForm: true,
                showEditForm: false,
                showLoader: false,
                error: null,
                saving: null,
                editing: null,

                uploading: false,
                uploaded: false,
                uploadedFiles: [],
                uploadError: null,
                currentStatus: null,
            };
        },
        mounted() {
            if (window.innerWidth <= 450) {
                this.width = 96 + '%';
            }
        },
        methods: {
            onAddFile(name, files) {
                if (!files.length) {
                    this.error = 'Please select files to upload';
                    return;
                }
                if (files.length > MAX_UPLOADED_FILES) {
                    this.error = 'You can upload not more that 4 files at once';
                    return;
                }

                let data = new FormData();
                let filesToUploadCount = 0;
                for (let i = 0; i < files.length; i++) {
                    const error = this.fileHasError(files[i]);
                    if (!error) {
                        data.append(name + i, files[i]);
                        filesToUploadCount++;
                    } else {
                        this.error = 'There was an error with your file `' + files[i].name + '`. It will not be uploaded. <br>';
                        this.error += error;
                    }
                }

                if (filesToUploadCount === 0) {
                    return;
                }

                this.showUploadForm = false;
                this.showLoader = true;
                Client.post('/audio/upload', data, (response) => {
                    this.uploadedFiles = response;
                    this.showEditForm = true;
                    this.editing = this.uploadedFiles[0].id;
                    this.showLoader = false;
                }, (error) => {
                    console.log(error);
                    this.showLoader = false;
                });

            },
            fileHasError(file) {
                if (file.size > MAX_UPLOADED_FILE_SIZE) {
                    return 'File should be less than ' + MAX_UPLOADED_FILE_SIZE / 1024 / 1024 + 'MB ';
                }
                if (UPLOAD_ALLOWED_TYPES.indexOf(file.type) === -1) {
                    return 'File should be of type ' + UPLOAD_ALLOWED_EXTENSIONS[0] + ' or ' + UPLOAD_ALLOWED_EXTENSIONS[1];
                }

                return false;
            },
            save(file) {
                this.saving = file.id;
                window.setTimeout(() => {
                    this.saving = null;
                    const currentIndex = this.uploadedFiles.indexOf(file);
                    if (!this.uploadedFiles[currentIndex + 1]) {
                        this.editing = null;
                        this.showEditForm = false;
                        this.showUploadForm = true;
                        this.error = null;
                    } else {
                        this.editing = this.uploadedFiles[currentIndex + 1].id;
                    }

                }, 1000);
            }
        },
        components: {Message},
    }
</script>