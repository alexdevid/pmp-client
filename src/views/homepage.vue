<template>
    <div class="homepage">
        <playlist :showLoadingIfEmpty="false"></playlist>
    </div>
</template>

<script>
    import playlist from "../components/Playlist.vue";

    export default {
        name: "home",
        components: {playlist}
    };
</script>
