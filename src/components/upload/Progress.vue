<template>
    <div class="upload-progress" :class="[complete ? 'complete': '', error ? 'error' : '']">
        <div class="upload-progress-image">
            <i class="fa fa-music"></i>
        </div>
        <div class="upload-progress-info">
            <div>{{ file.name }}</div>
            <div>{{ error ? error : status }}</div>
        </div>
        <div class="upload-progress-status">
            <span v-if="percent > 0 && percent < 100">{{ percent + '%' }}</span>
            <i class="fa fa-check" v-if="complete"></i>
            <i class="fas fa-sync-alt fa-spin" v-if="percent === 100 && !complete && !error"></i>
            <i class="fa fa-exclamation-triangle" v-if="error"></i>
        </div>
        <div class="upload-progress-bar" :style="{width: percent + '%'}"></div>
    </div>
</template>

<style lang="less" scoped>
    .upload-progress {
        margin: 15px auto;
        width: 50%;
        display: flex;
        position: relative;
        padding: 10px;

        &.complete {
            .upload-progress-info div:first-child {
                color: #000;
            }
        }

        &.error {
            .upload-progress-status,
            .upload-progress-info div:first-child {
                color: red;
            }
        }

        &-image {
            width: 40px;
            height: 40px;
            background-color: #f4f9fc;
            border-radius: 2px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        &-info {
            padding-left: 10px;
            line-height: 20px;
            display: flex;
            flex-direction: column;

            div:last-child {
                font-size: 12px;
                margin-top: auto;
            }
        }
        &-status {
            margin-left: auto;
            line-height: 40px;
        }
        &-bar {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.03);
            z-index: -1;
        }
    }
</style>

<script>
    import events from '../../events';
    import client from '../../services/api-client';

    const UPLOAD_STATUS_SERVER = 'Uploading to remote server';
    const UPLOAD_STATUS_CLOUD = 'Storing in cloud storage';
    const UPLOAD_STATUS_ERROR = 'Error';
    const UPLOAD_STATUS_COMPLETE = 'Complete';

    const MAX_UPLOADED_FILE_SIZE = 50 * 1024 * 1024; //50MB
    const UPLOAD_ALLOWED_TYPES = ['audio/mp3', 'audio/x-m4a'];
    const UPLOAD_ALLOWED_EXTENSIONS = ['mp3', 'm4a'];

    export default {
        name: "UploadProgress",
        props: ["file"],
        data() {
            return {
                status: UPLOAD_STATUS_SERVER,
                percent: 0,
                complete: false,
                error: false,
            }
        },
        mounted() {
            const error = this.fileHasError();
            if (error) {
                this.status = error;
                this.error = error;
                this.$emit(events.UPLOAD.ERROR, error);
            } else {
                this.upload();
            }
        },
        methods: {
            upload() {
                let data = new FormData();
                data.append('audio', this.file);

                this.status = UPLOAD_STATUS_SERVER;
                client.post('/audio/upload', data, percent => {
                    this.percent = Math.floor(percent);
                    if (this.percent === 100) {
                        this.status = UPLOAD_STATUS_CLOUD;
                    }
                }).then(
                    response => {
                        this.$emit(events.UPLOAD.COMPLETE, response.body[0]);
                        this.$emit(events.UPLOAD.FINISH);
                        this.complete = true;
                        this.status = UPLOAD_STATUS_COMPLETE;
                    }, error => {
                        this.$emit(events.UPLOAD.ERROR, error.statusText);
                        this.$emit(events.UPLOAD.FINISH);
                        this.error = error.statusText;
                        this.status = UPLOAD_STATUS_ERROR;
                    }
                );
            },

            fileHasError() {
                if (this.file.size > MAX_UPLOADED_FILE_SIZE) {
                    return 'File should be less than ' + MAX_UPLOADED_FILE_SIZE / 1024 / 1024 + 'MB ';
                }
                if (UPLOAD_ALLOWED_TYPES.indexOf(this.file.type) === -1) {
                    return 'File should be of type ' + UPLOAD_ALLOWED_EXTENSIONS[0] + ' or ' + UPLOAD_ALLOWED_EXTENSIONS[1];
                }

                return false;
            },
        }
    };
</script>