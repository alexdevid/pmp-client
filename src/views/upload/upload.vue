<template>
    <div class="upload-page">
        <upload-form
                v-if="filesToUpload.length === 0 && !showEditForm"
                @change="onAddFiles">
        </upload-form>
        <upload-progress
                @upload-complete="onComplete"
                @upload-error="onError"
                @upload-finish="onFinish"
                v-for="uploadedFile in filesToUpload"
                :file="uploadedFile">
        </upload-progress>
        <div v-if="showNexButton" class="uploaded-form-next">
            <button class="button" @click="onShowEditForm">Next</button>
        </div>
        <edit-form
                v-if="showEditForm"
                @skip="onEditFormSkip"
                @save="onEditFormSave"
                :saving="saving"
                :audio="audio">
        </edit-form>
    </div>
</template>

<script>
    import events from '../../events';
    import client from '../../services/api/api-client';
    import message from '../../components/message.vue';
    import uploadForm from './upload-form.vue';
    import editForm from './edit-form.vue';
    import uploadProgress from './progress.vue';

    const MAX_UPLOADED_FILES = 10;

    export default {
        name: 'upload',
        components: {message, uploadForm, editForm, uploadProgress},
        data() {
            return {
                showEditForm: false,
                audio: null,
                saving: false,

                filesToUpload: [],
                uploadedFiles: [],
                uploadCompleteCount: 0,
                showNexButton: false,
            };
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
            onEditFormSkip() {
                if (this.uploadedFiles.length) {
                    this.audio = this.uploadedFiles.shift();
                } else {
                    this.audio = null;
                    this.showEditForm = false;
                    this.$router.push('/profile');
                }
            },
            onEditFormSave(file) {
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
        }
    }
</script>

<style lang="less" scoped>
    .uploaded-form-next {
        width: 480px;
        margin: 0 auto;
        text-align: right;
    }
</style>