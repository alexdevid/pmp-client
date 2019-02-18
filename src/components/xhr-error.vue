<template>
    <div class="xhr-error">
        <p>{{ message }}</p>
        <button class="button" @click="$emit('retry')">Retry</button>
    </div>
</template>

<script>
    export default {
        name: "xhr-error",
        props: {
            message: {
                type: String,
                required: true
            }
        }
    };
</script>

<style lang="less" scoped>
    .xhr-error {
        text-align: center;
        margin: 50px auto;
        border: 1px solid #ccc;
        padding: 20px;
        border-radius: 2px;

        .button {
            margin-top: 10px;
        }
    }
</style>