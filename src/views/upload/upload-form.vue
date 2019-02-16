<template>
    <form enctype="multipart/form-data" novalidate class="upload-form">
        <p>You can upload not more that 10 files at once</p>
        <p>Each file should be less than 50MB</p>
        <p>Allowed file types are <code>mp3</code> and <code>m4a</code></p>
        <a href="#" class="button file-select" @click="$refs.file.click()">Select files</a>
        <input type="file" multiple name="audio" ref="file" @change="$emit('change', $event.target.files)" accept="audio/mp3, audio/mp4">
    </form>
</template>

<style lang="less" scoped>
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
</style>